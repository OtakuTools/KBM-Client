<template>
  <div>
    <el-menu mode="horizontal" style="overflow: hidden; height: 60px;">
      <el-submenu index="1" style="position: absolute; right: 120px; height: 60px; overflow: hidden;">
        <template slot="title">
          <el-avatar shape="circle" fit="fill" size="small" src="../assets/logo.png" style="margin-right: 10px;"></el-avatar>
          <span v-text="username"></span>
        </template>            
        <el-menu-item index="1-1" v-text="userType"></el-menu-item>
        <el-menu-item index="1-2"><a @click="changePassword">修改密码</a></el-menu-item>
      </el-submenu>
      <el-menu-item index="2" style="position: absolute; right: 0px; height: 60px; overflow: hidden;" @click="logout">
        <i class="el-icon-switch-button"></i><a>退出登录</a>
      </el-menu-item>
      <el-menu-item index="3" style="position: absolute; left: 0px; height: 60px; overflow: hidden;">
        <img :height="60" src="../assets/logo.png">
      </el-menu-item>
    </el-menu>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form :model="pswForm" status-icon label-position="right" ref="pswForm" label-width="80px" :rules="rules">
        <el-form-item label="旧密码" prop="old">
          <el-input v-model="pswForm.old" autocomplete="off" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new">
          <el-input v-model="pswForm.new" autocomplete="off" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="again_new">
          <el-input v-model="pswForm.again_new" autocomplete="off" clearable show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CONFIG } from '../static/js/Config';
export default {
  data () {
    var checkNewPsw = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'));
      } else {
        if (this.pswForm.new === this.pswForm.again_new) {
          callback();
        } else {
          callback(new Error('前后密码不一致'));
        }
      }
    };
    return {
      websocket: null,
      username : '',
      userType : '',
      userTypeList: {},

      pswForm: {
        old: '',
        new: '',
        again_new: ''
      },

      rules: {
        old: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],

        new: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],

        again_new: [
          { validator: checkNewPsw, trigger: 'blur' },
        ],
      },

      dialogFormVisible: false
    }
  },

  created() {
    this.userTypeList[CONFIG.UserType.admin] = "系统管理员";
    this.userTypeList[CONFIG.UserType.manager] = "审批经理";
    this.userTypeList[CONFIG.UserType.kbAdmin] = "知识库管理员";
    this.userTypeList[CONFIG.UserType.dataEntry] = "录入员";

    let [type, name, t] = this.$cookies.get("token").split("_");
    this.username = name;
    this.userType = `权限：${this.userTypeList[type]}`;
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
    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    changePassword(){
      this.dialogFormVisible = true;
    },

    dialogClose() {
      this.$refs["pswForm"].resetFields();
    },

    cancel() {
      this.dialogFormVisible = false;
    },

    submit(){
      let [type, name, t] = this.$cookies.get("token").split("_");
      this.$refs["pswForm"].validate((valid) => {
        if (valid) {
          let data = {
            "username": name,
            "old": this.pswForm.old,
            "new": this.pswForm.new
          }
          this.axios.post(`api/user/modifyPsw?token=${this.$cookies.get('token')}`, data).then(
            (res) => { 
              let response = res.data;
              if (!response.errorCode) {
                this.$message({
                  message: response.msg,
                  type: "success"
                });
                this.dialogFormVisible = false;
              } else {
                this.$message({
                  message: response.msg,
                  type: "error"
                });
              }
            },
          ).catch(
            (err) => { 
              this.$message({
                message: err,
                type: "error"
              });
            }
          )
          return true;
        } else {
          return false;
        }
      });
    },

    logout() {
      this.axios.get(`api/user/logout?token=${this.$cookies.get("token")}`).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.sendMessage({
              type: 0,
              event: "user logout"
            });
            this.$cookies.remove("token");
            this.$cookies.remove("new_seq");
            this.$router.push({
              name: "login"
            });
          } else {
            this.$message({
              message: "登出失败",
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