<template>
  <div>
    <el-table
      ref="filterTable"
      style="width:100%"
      :data="userData"
      v-loading="loadingTable"
      >
      <el-table-column
        prop="username"
        label="用户名"
        sortable
        >
      </el-table-column>
      <el-table-column
        prop="type"
        label="权限"
        width= 180px
        sortable
        :filters="[
          {text: '录入员', value: '录入员'},
          {text: '审批经理', value: '审批经理'},
          {text: '系统管理员', value: '系统管理员'},
          {text: '知识库管理员', value: '知识库管理员'}
          ]"
        :filter-method="filterHandler"
        >
        <template slot-scope="scope">
          <el-tag effect="dark">
            {{userType[scope.row.type]}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLogin"
        label="最后登录"
        sortable
        >
        <template slot-scope="scope">
            {{scope.row.lastLogin==="0"? "无登陆状态": scope.row.lastLogin}}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="账户状态"
        width= 180px
        sortable
        >
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.status===0?'success':'info'">
            {{scope.row.status===0?'在线':'离线'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="账户操作"
        >
        <template slot-scope="scope">
          <el-button type="text" round size="small" @click="showLog(scope.row)">操作记录</el-button>
          <el-button type="text" round size="small" @click="forceOffline(scope.row)" :disabled="scope.row.status===1">强制下线</el-button>
          <el-button type="text" round size="small" @click="deleteUser(scope.row)" :disabled="scope.row.status===0">删除账户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="操作日志" :visible.sync="logTableVisible">
      <el-container>
        <el-main>
          <el-table :data="logData">
            <el-table-column property="modifyTime" label="日期" width="150"></el-table-column>
            <el-table-column property="type" label="类型" width="200">
              <template slot-scope="scope">
                {{scope.row.type? "知识类":"用户类"}}
              </template>
            </el-table-column>
            <el-table-column property="content" label="内容"></el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-pagination :total="logTotal" :page-sizes="[1,10,20,50,80,100]" :current-page="logCurPage" 
          :page-size="logPageSize" layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandler" @current-change="pageChangeHandler"></el-pagination>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import {CONFIG} from "./../static/js/Config"
export default {
  data () {
    return {
      userType: {},
      userData: [],
      websocket: null,
      logTableVisible: false,
      logData: [],
      logCurPage: 0,
      logPageSize: 0,
      logTotal: 0,
      currentRow: null,
      loadingTable: false
    }
  },

  created() {
    this.getInfo();
    this.userType[CONFIG.UserType.admin] = "系统管理员";
    this.userType[CONFIG.UserType.manager] = "审批经理";
    this.userType[CONFIG.UserType.kbAdmin] = "知识库管理员";
    this.userType[CONFIG.UserType.dataEntry] = "录入员";
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
        if (result.type === 0) {
          this.getInfo();
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
    filterHandler (value, row, column) {
      return row.type === value
    },

    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    sizeChangeHandler(val) {
      this.logCurPage = 1;
      this.logPageSize = val;
      this.getLog(this.currentRow.username, this.logCurPage, this.logPageSize);
    },

    pageChangeHandler(val) {
      this.logCurPage = val;
      this.getLog(this.currentRow.username, this.logCurPage, this.logPageSize);
    },

    getInfo() {
      this.loadingTable = true;
      this.axios.get(`api/user/information?token=${this.$cookies.get("token")}`).then(
        (res) => {
          this.loadingTable = false;
          let response = res.data;
          if (!response.errorCode) {
            this.userData = response.data;
          } else {
            this.$message({
              message: "无法获取用户信息",
              type: "error"
            });
          }
        }
      ).catch(
        (error) => {
          this.loadingTable = false;
          this.$message({
            message: error,
            type: "error"
          });
        }
      );
    },

    deleteUser(row) {
      let data = {
        "username": row.username
      };
      this.axios.post(`api/user/delete?token=${this.$cookies.get("token")}`, data).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.$message({
              message: "删除用户成功",
              type: "success"
            });
            this.sendMessage({
              type: 0,
              event: "delete user"
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
      )
    },

    forceOffline(row) {
      let data = {
        "username": row.username
      };
      this.axios.post(`api/user/offline?token=${this.$cookies.get("token")}`, data).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.$message({
              message: "用户强制下线成功",
              type: "success"
            });
            this.sendMessage({
              type: 0,
              event: "force offline"
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
      )
    },

    showLog(row) {
      this.currentRow = row;
      this.logCurPage = 1;
      this.logPageSize = 20;
      this.getLog(row.username, this.logCurPage, this.logPageSize);
    },

    getLog(username, page, pageSize, option=null) {
      this.axios.get(`api/user/log?token=${this.$cookies.get("token")}&username=${username}&page=${page}&pageSize=${pageSize}${option?"&"+option:""}`).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.logTotal = response.data.count;
            this.logData = response.data.content;
            this.logTableVisible = true;
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
      )
    }
  }
}
</script>
