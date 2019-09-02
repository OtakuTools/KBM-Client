<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">{{menuText1}}</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span slot="title">{{menuText2}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-row>
            <el-col :span="uType=='dataentry'? 16:20" :offset="2">
              <el-input placeholder="请输入内容" v-model="searchContent" style="background-color: #fff;">
                <el-select v-model="searchType" slot="prepend" placeholder="请选择查找类型" style="width: 180px;">
                  <el-option label="部门名称" value="department"></el-option>
                  <el-option label="申请人" value="applicant"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4" v-if="uType=='dataentry'">
              <el-button type="primary" icon="el-icon-plus" @click="NewInfo">新建知识</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="2">
              <el-table v-loading="loadingTable" ref="filterTable" :data="tableData" style="width: 100%" stripe>
                <el-table-column prop="sequence" label="知识编号" sortable></el-table-column>
                <el-table-column prop="curStatus" label="当前状态">
                  <template slot-scope="scope">
                    <el-tag effect="dark" type="success" size="small" v-if="scope.row.curStatus<10">{{status_succ[scope.row.curStatus]}}</el-tag>
                    <el-tag effect="dark" type="danger" size="small" v-else>{{status_fail[scope.row.curStatus-10]}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="department" label="申请人部门">
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
                  </template>
                  <template slot-scope="scope">
                    <div v-if="menuIndex==1">
                      <el-button type="primary" size="small" icon="el-icon-edit" @click="More(scope.row)" circle :disabled="scope.row.curStatus==2" v-if="uType=='dataentry'"></el-button>
                      <el-button type="primary" size="small" icon="el-icon-more" @click="More(scope.row)" circle v-else></el-button>

                      <el-button type="danger" size="small" icon="el-icon-delete" @click="Delete(scope.row)" circle :disabled="scope.row.curStatus==2" v-if="uType=='dataentry'"></el-button>

                      <el-button type="success" size="small" icon="el-icon-check" @click="Agree(scope.row)" circle v-if="uType!='dataentry'"></el-button>
                      <el-button type="danger" size="small" icon="el-icon-close" @click="Disagree(scope.row)" circle v-if="uType!='dataentry'"></el-button>
                    </div>
                    <div v-else>
                      <el-button type="primary" size="small" icon="el-icon-more" @click="More(scope.row)" circle></el-button>
                      <el-button type="danger" size="small" icon="el-icon-document-remove" @click="MoveDB(scope.row)" circle v-if="uType=='dataentry' && scope.row.curStatus==4"></el-button>
                    </div>
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
      searchText: "",

      tableData : [],
      departments : [],
      status_succ: ["创建成功","修改成功","提交审核","审核通过","入库成功","移库审核","移库审核通过","移库成功"],
      status_fail: ["创建失败","修改失败","提交失败","审核失败","入库失败","移库失败","移库审核失败","移库失败"],

      menuText: {},
      menuText1: "",
      menuText2: "",

      menuOptions: {},
      menuOption: "",

      uType: "",
      menuIndex: 1,

      websocket: null,
      loadingTable: false
    }
  },

  created() {
    var [type, name, t] = this.$cookies.get('token').split('_');
    this.uType = type;

    this.menuText[CONFIG.UserType.dataEntry] = ["未审批信息", "已审批信息"];
    this.menuText[CONFIG.UserType.manager] = ["待办事项", "已审批事项"];
    this.menuText[CONFIG.UserType.kbAdmin] = ["待办事项", "已审批事项"];

    // 各页显示状态
    this.menuOptions[CONFIG.UserType.dataEntry] = [`status=0,1,2,5,10,11,12,13,14,15,16,17&author=${name}`, "status=3,4,6,7"];
    this.menuOptions[CONFIG.UserType.manager] = ["status=2,5", "status=3,4,6,7"];
    this.menuOptions[CONFIG.UserType.kbAdmin] = ["status=3,6", "status=3,4,7"];
    
    [this.menuText1, this.menuText2] = this.menuText[type];
    this.menuOption = this.menuOptions[type][0];
    this.getAllInfo(this.currentPage, this.pageSize, this.menuOption);
  },

  mounted() {
    if (typeof(WebSocket) === "undefined"){
      this.$message({
        message: "该浏览器不支持WebSocket",
        type: "error"
      });
    } else {
      this.websocket = new WebSocket('ws://localhost:3001/');
      this.websocket.onopen = (event) => {
        console.log('websocket connected');
      };

      this.websocket.onmessage = (event) => {
        let data = event.data;
        let result = JSON.parse(data);
        if (result.type === 1) {
          this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
        }
      };

      this.websocket.onclose = (event) => {
        console.log("WebSocket is closed now.");
      };

      this.websocket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };
    }
  },

  destroyed () {
      // 销毁监听
      this.websocket.close();
  },

  methods: {
    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    pageSizeChangeHandler(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
    },

    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    pageChangeHandler(val) {
      this.currentPage = val;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
    },

    handleMenuSelect(key, keyPath) {
      var [type, name, t] = this.$cookies.get('token').split('_');
      this.menuOption = this.menuOptions[type][parseInt(key)-1];
      this.currentPage = 1;
      this.menuIndex = parseInt(key);
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
    },

    searchData() {
      if (this.searchType == "" || this.searchContent == "") {
        this.$message({
          message: "搜索类型或搜索内容不能为空",
          type: "error"
        });
        return;
      } else if(this.searchType == "department") {
        this.searchText = `department=${this.searchContent}`
      } else if(this.searchType == "applicant"){
        this.searchText = `applicant=${this.searchContent}`
      }
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
    },

    getAllInfo(page, pageSize, option) {
      this.loadingTable = true;
      this.axios.get(`api/info/search?token=${this.$cookies.get('token')}&page=${page}&pageSize=${pageSize}${option? "&"+option: ""}`).then(
        (res) => {
          this.loadingTable = false;
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
          this.loadingTable = false;
          this.$message({
            message: err,
            type: "error"
          });
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

    Delete(row) {
      var seq = row.sequence;
      this.axios.get(`api/info/delete?token=${this.$cookies.get('token')}&sequence=${row.sequence}`).then(
        (res) => {
          var response = res.data;
          if (!response.errorCode) {
            this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
            this.sendMessage({
              type: 1,
              event: "delete info"
            });
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
    },

    MoveDB(row) {
      var [type, name, t] = this.$cookies.get('token').split('_');
      var data = {
        sequence: row.sequence,
        curStatus: CONFIG.Status.MOVE_SUB_SUCC,
        auditor: name
      }
      this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
        (res) => {
          var response = res.data;
          if (!response.errorCode) {
            this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
            this.sendMessage({
              type: 1,
              event: "move db"
            });
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
    },

    Agree(row) {
      console.log(row);
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (row.curStatus == CONFIG.Status.SUBMIT_SUCC || row.curStatus == CONFIG.Status.MOVE_SUB_SUCC) {
          var data = {
            sequence: row.sequence,
            curStatus: row.curStatus == CONFIG.Status.SUBMIT_SUCC? CONFIG.Status.AUDIT_SUCC : CONFIG.Status.MOVE_AUD_SUCC,
            auditor: name
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
                this.sendMessage({
                  type: 1,
                  event: "agree audit"
                });
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
        if (row.curStatus == CONFIG.Status.AUDIT_SUCC || row.curStatus == CONFIG.Status.MOVE_AUD_SUCC) {
          var data = {
            sequence: row.sequence,
            curStatus: row.curStatus == CONFIG.Status.AUDIT_SUCC? CONFIG.Status.INBOUND_SUCC : CONFIG.Status.MOVE_SUCC
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
                this.sendMessage({
                  type: 1,
                  event: "agree inbound"
                });
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
      var [type, name, t] = this.$cookies.get('token').split('_');
      if (type == CONFIG.UserType.manager) {
        if (row.curStatus == CONFIG.Status.SUBMIT_SUCC || row.curStatus == CONFIG.Status.MOVE_AUD_SUCC ) {
          var data = {
            sequence: row.sequence,
            curStatus: row.curStatus == CONFIG.Status.SUBMIT_SUCC? CONFIG.Status.AUDIT_FAIL: CONFIG.Status.MOVE_AUD_FAIL,
            auditor: name
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
                this.sendMessage({
                  type: 1,
                  event: "disagree audit"
                });
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
        if (row.curStatus == CONFIG.Status.AUDIT_SUCC || row.curStatus == CONFIG.Status.MOVE_AUD_SUCC) {
          var data = {
            sequence: row.sequence,
            curStatus: row.curStatus == CONFIG.Status.AUDIT_SUCC? CONFIG.Status.INBOND_FAIL : CONFIG.Status.MOVE_FAIL
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}`);
                this.sendMessage({
                  type: 1,
                  event: "disagree inbound"
                });
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