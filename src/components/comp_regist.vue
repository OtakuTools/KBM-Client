<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-row>
          <el-col :span="10" :offset="6">
            <el-form :model="infoForm" label-position="left" ref="infoForm" label-width="80px" :rules="rules">
              <el-form-item label="用户姓名" prop="realname">
                <el-input v-model="infoForm.realname" placeholder="请输入真实姓名" clearable></el-input>
              </el-form-item>
              <el-form-item label="所属部门" prop="department">
                <el-input v-model="infoForm.department" placeholder="请输入所属部门" clearable></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input v-model="infoForm.username" placeholder="请输入用户名" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="infoForm.password" placeholder="请输入密码" clearable show-password></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="type">
                <el-radio-group v-model="infoForm.type" placeholder="请选择用户角色" style="width: 100%;">
                  <el-radio-button v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10" :offset="6">
            <el-button type="success" @click="regist('infoForm')"> 创建 </el-button>
            <el-button type="danger" @click="clear('infoForm')"> 取消 </el-button>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
import {CONFIG} from "./../static/js/Config"
export default {
  name: 'comp_regist',
  data () {
    return {
      websocket: null,
      
      options: [
        {
          value: "admin",
          label: "系统管理员"
        },
        {
          value: "dataentry",
          label: "录入员"
        },
        {
          value: "manager",
          label: "审批经理"
        },
        {
          value: "kbAdmin",
          label: "知识库管理员"
        },
      ],

      infoForm: {
        realname: '',
        department: '',
        username: '',
        password: '',
        type: ''
      },

      rules: {
        realname: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],

        department: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],

        username: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],

        password: [
          { required: true, message: '输入不能为空', trigger: 'blur' },
        ],

        type: [
          { required: true, message: '请选择角色', trigger: 'blur' },
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

    clear(formName) {
      this.$refs[formName].resetFields();
    },

    regist(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            "username": this.infoForm.username,
            "password": this.infoForm.password,
            "realname": this.infoForm.realname,
            "department": this.infoForm.department,
            "type": this.infoForm.type
          }
          this.axios.post(`api/user/regist?token=${this.$cookies.get("token")}`, data).then(
            (res) => { 
              let response = res.data;
              if (!response.errorCode) {
                this.$message({
                  message: "创建角色成功",
                  type: "success"
                });
                this.clear(formName);
                this.sendMessage({
                  type: 0,
                  event: "create user"
                });
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
