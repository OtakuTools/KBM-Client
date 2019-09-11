<template>
  <div style="background-color:#f9f9f9">
    <el-container style="background-color:#f9f9f9">
      <el-header></el-header>
      <el-main style="background-color:#f9f9f9">
        <el-card class="box-card" style="width: 500px; height: 420px; position: absolute; left: calc(50% - 250px); top: calc(50% - 210px);">
          <el-row style="margin: 10px 0px;">
            <el-col :span="20" :offset="2">
              <img :height="100" src="../assets/logo.png">
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0px;">
            <el-col :span="20" :offset="2">
              <el-form :model="infoForm" status-icon label-position="left" ref="infoForm" label-width="80px" :rules="rules">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="infoForm.username" placeholder="请输入用户名" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="infoForm.password" placeholder="请输入密码" clearable show-password></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="verifycode">
                  <template>
                    <el-input v-model="infoForm.verifycode" placeholder="请输入验证码" clearable style="width: calc(100% - 100px); display: inline-block;"></el-input>
                    <div id="verify" style="float: right; overflow:hidden; height: 40px; display: inline-block;"></div>
                  </template>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row style="margin: 10px 0px;">
            <el-col :span="20" :offset="2">
              <el-button type="success" @click="login('infoForm')" :disabled="!isVerified" style="width: 100%;"> 登录 </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import {getGVerify} from '../static/js/verifyCode'
import { CONFIG } from '../static/js/Config';
export default {
  name: 'comp_login',
  data () {
    var checkVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'));
      } else {
        if (this.infoForm.verifycode !== '' && this.verifyCode.validate(this.infoForm.verifycode)) {
          this.isVerified = true;
          callback();
        } else {
          callback(new Error('验证码出错'));
        }
      }
    };
    return {
      websocket: null,
      verifyCode: null,
      isVerified: false,
      infoForm: {
        username: '',
        password: '',
        verifycode: ''
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],

        verifycode: [
          { validator: checkVerifyCode, trigger: 'blur' },
        ],
      }
    }
  },

  mounted() {
    this.verifyCode = getGVerify({
        id: "verify",
        canvasId: "verifyCanvas",
        width: "100",
        height: "40",
        type: "blend",
        code: ""
    });
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

    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            "username": this.infoForm.username,
            "password": this.infoForm.password
          }
          this.axios.post("api/user/login", data).then(
            (res) => { 
              let response = res.data;
              console.log(response);
              if (!response.errorCode) {
                // 保存到cookies
                this.$cookies.set("token", res.data.data.token);
                // name为router.js中的对应路径名称
                var [type, name, time] = res.data.data.token.split("_");
                this.sendMessage({
                  type: 0,
                  event: "user login"
                })
                if (type == "admin") {
                  this.$router.push({'name': 'adminControl'})
                } else {
                  this.$router.push({'name': 'listAll'})
                }
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
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
