<template>
  <div>
    <el-card>
      <el-container>
        <el-aside width="180px" height="100%">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="handleMenuSelect"
            width="280px;">
            <el-menu-item index="1" style="margin-top: 20px">
              <i class="el-icon-document"></i>
              <span>{{menuText[uType][0]}}</span>
              <el-badge :value="count[0]" style="float: right" />
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span>{{menuText[uType][1]}}</span>
              <el-badge :value="count[1]" style="float: right" />
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span>{{menuText[uType][2]}}</span>
              <el-badge :value="count[2]" style="float: right" />
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-document"></i>
              <span>{{menuText[uType][3]}}</span>
              <el-badge :value="count[3]" style="float: right" />
            </el-menu-item>
          </el-menu>
        
        </el-aside>
        <el-container>
          <el-main>
            <el-row>
              <el-col :span="uType=='dataentry'? 16:20" :offset="2">
                <el-input placeholder="请输入内容" v-model="searchContent" style="background-color: #fff;" @focus="timeChoice=searchType=='timeInterval'" :readonly="searchType=='timeInterval'">
                  <el-select v-model="searchType" slot="prepend" placeholder="请选择查找类型" style="width: 180px;">
                    <el-option label="部门名称" value="department"></el-option>
                    <el-option label="申请人" value="applicant"></el-option>
                    <el-option label="入库时间" value="timeInterval"></el-option>
                    <el-option label="知识标题" value="kTitle"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
                </el-input>
                <el-dialog title="时间选择" :visible.sync="timeChoice" width="30%" center>
                  <el-date-picker style="width:100%;"
                    v-model="searchContent"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="timeChoice=false">确 定</el-button>
                    <el-button @click="searchContent=''">重 置</el-button>
                  </span>
                </el-dialog>
              </el-col>
              <el-col :span="4" v-if="uType=='dataentry'">
                <el-button type="primary" icon="el-icon-plus" @click="NewInfo">新建知识</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="2">
                <el-switch
                  style="display: block; float: left; margin-top: 20px"
                  v-model="recentOnly"
                  inactive-color="#13ce66"
                  active-color="#409eff"
                  active-text="查看一周内更新"
                  inactive-text="查看全部"
                  @change="showRecent()"
                  >
                </el-switch>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20" :offset="2">
                <el-table v-loading="loadingTable" ref="filterTable" :data="tableData" style="width: 100%; margin-top: 20px" stripe>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-form label-position="left" inline class="table-expand">
                        <el-form-item label="知识类别">
                          <span>{{ props.row.knowledgeType }}</span>
                        </el-form-item>
                        <el-form-item label="问题发现时间">
                          <span>{{ props.row.discoverTime }}</span>
                        </el-form-item>
                        <el-form-item label="问题解决时间">
                          <span>{{ props.row.resolveTime }}</span>
                        </el-form-item>
                        <el-form-item label="问题持续时间">
                          <span>{{ props.row.lastfor }}</span>
                        </el-form-item>
                        <el-form-item label="知识条目标题">
                          <span>{{ props.row.kTitle }}</span>
                        </el-form-item>
                        <el-form-item label="内容描述">
                          <span>{{ props.row.kContent }}</span>
                        </el-form-item>
                        <el-form-item label="解决方法">
                          <span>{{ props.row.kMethod }}</span>
                        </el-form-item>
                        <el-form-item label="修改意见" v-if="uType=='dataentry'&&props.row.opinion&&props.row.opinion!=''">
                          <span style="color: red">{{ props.row.opinion }}</span>
                        </el-form-item>
                      </el-form>
                    </template>
                  </el-table-column>
                  <el-table-column prop="sequence" label="知识编号" sortable></el-table-column>
                  <el-table-column prop="curStatus" label="当前状态" v-if="menuIndex==1||menuIndex==2" >
                    <template slot-scope="scope">
                      <el-tag effect="dark" type="success" size="small" v-if="scope.row.curStatus<10">{{status_succ[scope.row.curStatus]}}</el-tag>
                      <el-tag effect="dark" type="danger" size="small" @click="showOpinion(scope.row.opinion, scope.row.curStatus)" v-else>{{status_fail[scope.row.curStatus-10]}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="department" label="申请人部门" v-if="false">
                    <template slot-scope="scope">
                      <el-tag effect="dark" size="small">
                        {{scope.row.department}}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="applicant" label="申请人姓名" sortable v-if="false"></el-table-column>
                  <el-table-column prop="kTitle" label="知识条目标题"></el-table-column>
                  <el-table-column prop="modifyTime" label="入库时间"></el-table-column>
                  <el-table-column prop="tag" label="操作">
                    <template slot="header">
                      <div>
                        <a>操作</a>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <div v-if="menuIndex==1">
                        <el-tooltip effect="dark" content="修改" placement="top">
                          <el-button type="primary" size="small" icon="el-icon-edit" @click="More(scope.row)" circle :disabled="scope.row.curStatus==2" v-if="uType=='dataentry'"></el-button>
                          <el-button type="primary" size="small" icon="el-icon-more" @click="More(scope.row)" circle v-else></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top">
                          <el-button type="danger" size="small" icon="el-icon-delete" @click="Delete(scope.row)" circle :disabled="scope.row.curStatus==2" v-if="uType=='dataentry'"></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="同意" placement="top">
                          <el-button type="success" size="small" icon="el-icon-check" @click="Agree(scope.row)" circle v-if="uType!='dataentry'"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="不同意" placement="top">
                          <el-button type="danger" size="small" icon="el-icon-close" @click="Disagree(scope.row)" circle v-if="uType!='dataentry'"></el-button>
                        </el-tooltip>
                      </div>
                      <div v-else>
                        <el-tooltip effect="dark" content="更多" placement="top">
                          <el-button type="primary" size="small" icon="el-icon-more" @click="More(scope.row)" circle></el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="移库" placement="top">
                          <el-button type="danger" size="small" icon="el-icon-document-remove" @click="MoveDB(scope.row)" circle v-show="uType=='dataentry' && scope.row.curStatus==4"></el-button>
                        </el-tooltip>
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
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  width: 100%;
  height: 100%;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 300px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
  color: #99a9bf;
}
</style>

<script>
import {CONFIG} from './../static/js/Config'

export default {
  data () {
    return {
      timeChoice: false,

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
      menuText3: "一周内更新）",
      menuText4: "知识信息",
      menuText5: "移库信息",

      menuOptions: {},
      menuOption: "",
      count:[0,1,2,3,4],

      uType: "",
      menuIndex: 1,
      recentOnly: false,
      timeRange: "",

      websocket: null,
      loadingTable: false
    }
  },

  created() {
    var [type, name, t] = this.$cookies.get('token').split('_');
    this.uType = type;

    // 各页显示状态
    this.menuOptions[CONFIG.UserType.dataEntry] = [`status=0,1,2,5,10,11,12,13,14,15,16,17&author=${name}`, `status=3,4,6,7&author=${name}`,`status=4`,`status=7`];
    this.menuOptions[CONFIG.UserType.manager] = ["status=2,5", "status=3,4,6,7",`status=4`,`status=7`];
    this.menuOptions[CONFIG.UserType.kbAdmin] = ["status=3,6", "status=4,7",`status=4`,`status=7`];

    this.menuText[CONFIG.UserType.dataEntry] = [`未审批信息`, `已审批信息`,`知识信息`,`移库信息`];
    this.menuText[CONFIG.UserType.manager] = [`待办事项`, `已审批事项`,`知识信息`,`移库信息`];
    this.menuText[CONFIG.UserType.kbAdmin] = [`待办事项`, `已审批事项`,`知识信息`,`移库信息`];
    
    [this.menuText1, this.menuText2] = this.menuText[type];
    this.menuOption = this.menuOptions[type][0];
    this.getBadge();
    this.getAllInfo(this.currentPage, this.pageSize, this.menuOption);
  },

  mounted() {
    if (typeof(WebSocket) === "undefined"){
      this.$message({
        message: "该浏览器不支持WebSocket",
        type: "error"
      });
    } else {
      this.websocket = new WebSocket(CONFIG.WS.url);
      this.websocket.onopen = (event) => {
        console.log('websocket connected');
      };

      this.websocket.onmessage = (event) => {
        let data = event.data;
        let result = JSON.parse(data);
        if (result.type === 1) {
          this.getBadge();
          this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
    showOpinion( opinion, status ){
      this.$alert(opinion, status == CONFIG.Status.AUDIT_FAIL? "审批意见":"入库意见", {
        confirmButtonText: '确定'
      });
    },

    showRecent(){
      if ( this.recentOnly == true ) {
        var end = new Date();
        var begin = new Date();
        begin.setDate( end.getDate()-7 );
        let startStr = `${begin.getFullYear()}-${begin.getMonth()>=10?begin.getMonth():"0"+""+begin.getMonth()}-${begin.getDate()>=10?begin.getDate():"0"+""+begin.getDate()}`;
        let endStr = `${end.getFullYear()}-${end.getMonth()>=10?end.getMonth():"0"+""+end.getMonth()}-${end.getDate()>=10?end.getDate():"0"+""+end.getDate()}`;
        this.timeRange = `recent=${startStr},${endStr}`;
      }
      this.getBadge();
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`)
    },

    filterHandler(value, row, column) {
      const property = column['property']
      return row[property] === value
    },

    pageSizeChangeHandler(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
    },

    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    pageChangeHandler(val) {
      this.currentPage = val;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
    },

    handleMenuSelect(key, keyPath) {
      var [type, name, t] = this.$cookies.get('token').split('_');
      this.menuOption = this.menuOptions[type][parseInt(key)-1];
      this.currentPage = 1;
      this.menuIndex = parseInt(key);
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
    },

    searchData() {
      if (this.searchType == "" || this.searchContent == "") {
        this.$message({
          message: "搜索类型或搜索内容为空，显示所有信息",
          type: "warning"
        });
        this.getAllInfo(this.currentPage, this.pageSize, `${this.menuOption}`);
        return;
      } else if(this.searchType == "department") {
        this.searchText = `department=${this.searchContent}`
      } else if(this.searchType == "applicant") {
        this.searchText = `applicant=${this.searchContent}`
      } else if(this.searchType == "timeInterval") {
        this.searchText = `timeInterval=${this.searchContent}`
      } else if(this.searchType == "kTitle") {
        this.searchText = `kTitle=${this.searchContent}`
      }
      this.currentPage = 1;
      this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
    },

    getBadge() {
      //badge
      let qry = {
        "data": this.menuOptions[ this.uType ]
      };
      this.axios.post(`api/info/getBadge?token=${this.$cookies.get('token')}`,qry).then(
        (res) => {
          this.count = res.data.data;
        }
      ).catch(
        (err) => {
          console.log(err);
        }
      );
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
      this.$confirm(`确认删除编号为${row.sequence}的知识条目吗？`, {
        confirmButtonClass: 'cancel-btn',
        cancelButtonClass: 'success-btn',
      })
        .then(() => {
          var seq = row.sequence;
          this.axios.get(`api/info/delete?token=${this.$cookies.get('token')}&sequence=${row.sequence}`).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
        })
        .catch(_ => {

        });
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
            this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
            auditor: name,
            opinion: "*"
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
            curStatus: row.curStatus == CONFIG.Status.AUDIT_SUCC? CONFIG.Status.INBOUND_SUCC : CONFIG.Status.MOVE_SUCC,
            opinion: "*"
          }
          this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
            (res) => {
              var response = res.data;
              if (!response.errorCode) {
                this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
        if (row.curStatus == CONFIG.Status.SUBMIT_SUCC || row.curStatus == CONFIG.Status.MOVE_SUB_SUCC ) {
          this.$prompt( '审核意见' , '审核确认' , {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonClass: 'cancel-btn',
            cancelButtonClass: 'success-btn',
          } ).then(({ value }) => {
            var data = {
              sequence: row.sequence,
              curStatus: row.curStatus == CONFIG.Status.SUBMIT_SUCC? CONFIG.Status.AUDIT_FAIL: CONFIG.Status.MOVE_AUD_FAIL,
              auditor: name,
              opinion: value
            }
            this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
              (res) => {
                var response = res.data;
                if (!response.errorCode) {
                  this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
          }).catch(()=>{ return; }) 
        }
      } else if (type == CONFIG.UserType.kbAdmin) {
        if (row.curStatus == CONFIG.Status.AUDIT_SUCC || row.curStatus == CONFIG.Status.MOVE_AUD_SUCC) {
          this.$prompt( '入库意见' , '审核确认' , {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonClass: 'cancel-btn',
            cancelButtonClass: 'success-btn',
          }).then(({ value }) => {
            var data = {
              sequence: row.sequence,
              curStatus: row.curStatus == CONFIG.Status.AUDIT_SUCC? CONFIG.Status.INBOND_FAIL : CONFIG.Status.MOVE_FAIL,
              opinion: value
            }
            this.axios.post(`api/info/updateStatus?token=${this.$cookies.get('token')}`, data).then(
              (res) => {
                var response = res.data;
                if (!response.errorCode) {
                  this.getAllInfo(this.currentPage, this.pageSize, `${this.searchText}&${this.menuOption}${this.recentOnly?"&"+this.timeRange:""}`);
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
          }).catch(()=>{ return; }) 
        }
      }
    },
  }
}
</script>