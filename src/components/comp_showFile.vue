<template>
  <div>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-input placeholder="请输入内容" v-model="searchContent" style="background-color: #fff;">
              <el-select v-model="searchType" slot="prepend" placeholder="请选择" style="width: 130px;">
                <el-option label="部门名称" value="department"></el-option>
                <el-option label="申请人" value="applicant"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" :offset="2">
            <el-table ref="filterTable" :data="tableData" style="width: 100%" stripe>
              <el-table-column prop="sequence" label="知识编号" sortable></el-table-column>
              <el-table-column prop="curStatus" label="当前状态">
                <template slot-scope="scope">
                  <el-tag effect="dark" type="success" size="small" v-if="scope.row.curStatus<10">{{status_succ[scope.row.curStatus]}}</el-tag>
                  <el-tag effect="dark" type="danger" size="small" v-else>{{status_fail[scope.row.curStatus-10]}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="department" label="申请人部门" :filters="departments" :filter-method="filterHandler">
                <template slot-scope="scope">
                  <el-tag effect="dark" size="small">
                    {{scope.row.department}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="applicant" label="申请人姓名" sortable></el-table-column>
              <el-table-column prop="kTitle" label="知识条目标题"></el-table-column>
              <el-table-column prop="tag" label="操作">
                <template slot="header">
                  <div>
                    <a>操作</a>
                  </div>
                  <div>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="NewInfo" circle></el-button>
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-button type="primary" size="small" icon="el-icon-more" @click="More(scope.row)" circle></el-button>
                  <el-button type="success" size="small" icon="el-icon-check" @click="Agree(scope.row)" circle></el-button>
                  <el-button type="danger" size="small" icon="el-icon-close" @click="Disagree(scope.row)" circle></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-pagination :total="totalItems" :page-sizes="[1,10,20,50,80,100]" :current-page="currentPage" :page-size="20" @size-change="pageSizeChangeHandler" @current-change="pageChangeHandler" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {CONFIG} from './../static/js/Config'

export default {
  data () {
    return {
      currentPage: 1,
      totalItems: 0,
      pageSize: 50,

      searchType: "",
      searchContent: "",

      tableData : [],
      departments : [],
      status_succ: ["创建成功","提交审核","修改成功","审核通过","入库成功","移库成功"],
      status_fail: ["创建失败","提交失败","修改失败","审核失败","入库失败","移库失败"],
    }
  },

  created() {
    this.getAllInfo(this.currentPage, this.pageSize, null);
  },

  methods: {
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    pageSizeChangeHandler(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, this.searchType);
    },

    pageChangeHandler(val) {
      this.currentPage = val;
      this.getAllInfo(this.currentPage, this.pageSize, this.searchType);
    },

    searchData() {
      let option = "";
      if (this.searchType == "" || this.searchContent == "") {
        this.$message({
          message: "搜索类型或搜索内容不能为空",
          type: "error"
        });
        return;
      } else if(this.searchType == "department") {
        option = `department=${this.searchContent}`
      } else if(this.searchType == "applicant"){
        option = `applicant=${this.searchContent}`
      }
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, option);
    },

    getAllInfo(page, pageSize, option) {
      this.axios.get(`api/info/search?token=${this.$cookies.get('token')}&page=${page}&pageSize=${pageSize}${option? "&"+option: ""}`).then(
        (res) => {
          let response = res.data;
          this.tableData = [];
          this.department = [];
          if (!response.errorCode) {
            let deps = [];
            for (var item in this.tableData) {
              deps.append({
                text: item.department,
                value: item.department
              })
            }
            this.totalItems = response.data.count;
            this.tableData = response.data.content;
            this.departments = deps;
          } else {
            this.$message(response.msg);
          }
        }
      ).catch(
        (err) => {
          this.$message(err);
        }
      );
    },

    NewInfo() {
      var [type, name, t] = this.$cookies.get('token').split('_');
      this.$router.push({ 
        name: 'draft', 
        query: {
          type: type
        }
      });
    },

    More(row) {
      var seq = row.sequence;
      var [type, name, t] = this.$cookies.get('token').split('_');
      this.$router.push({ 
        name: 'draft', 
        query: { 
          sequence: seq,
          type: type
        }
      });
    },

    Agree(row) {
      console.log(row);
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (row.curStatus == CONFIG.Status.SUBMIT_SUCC ) {
          var data = {
            sequence: row.sequence,
            curStatus: CONFIG.Status.AUDIT_SUCC,
            auditor: name
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(1, 10, null);
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        }
      } else if (type == CONFIG.UserType.kbAdmin) {
        if (row.curStatus == CONFIG.Status.AUDIT_SUCC) {
          var data = {
            sequence: row.sequence,
            curStatus: CONFIG.Status.INBOUND_SUCC
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(1, 10, null);
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        }
      }
    },

    Disagree(row) {
      console.log(row);
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (row.curStatus == CONFIG.Status.SUBMIT_SUCC ) {
          var data = {
            sequence: row.sequence,
            curStatus: CONFIG.Status.AUDIT_FAIL,
            auditor: name
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(1, 10, null);
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        }
      } else if (type == CONFIG.UserType.kbAdmin) {
        if (row.curStatus == CONFIG.Status.AUDIT_SUCC) {
          var data = {
            sequence: row.sequence,
            curStatus: CONFIG.Status.INBOND_FAIL
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(1, 10, null);
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            }
          ).catch(
            (error) => {
              this.$message({
                  message: error,
                  type: "error"
                });
            }
          );
        }
      }
    }
  }
}
</script>