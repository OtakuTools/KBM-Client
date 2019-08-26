<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-row>
          <el-col :span="10" :offset="6">
            <el-form :model="infoForm" label-position="left" ref="infoForm" label-width="80px" :rules="rules">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="infoForm.username" placeholder="请输入用户名" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="infoForm.password" placeholder="请输入密码" clearable show-password></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="6">
            <span>拖动验证</span>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-slider v-model="verifySlider" @input="move"></el-slider>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="6">
            <el-button id="loginButton" type="success" @click="login('infoForm')" :disabled="!isVerified"> 登录 </el-button>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'comp_login',
  data () {
    return {
      websocket: null,
      verifySlider: 0,
      isVerified: false,
      infoForm: {
        username: '',
        password: ''
      },

      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      }
    }
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
        if (valid && this.isVerified) {
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
                this.verifySlider = 0;
              }
            },
          ).catch(
            (err) => { 
              this.$message({
                message: err,
                type: "error"
              });
              this.verifySlider = 0;
            }
          )
          return true;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    move(val) {
      this.verifySlider = val;
      if (this.verifySlider < 100) {
        this.isVerified = false;
      } else {
        this.$refs['infoForm'].validate((valid) => {
          if (valid) {
            this.isVerified = true;
            return true;
          } else {
            this.isVerified = false;
            return false;
          }
        });
      }
    }
  }
}
</script>
