<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-form :model="infoForm">
          <el-form-item label="用户名">
            <el-input v-model="infoForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="infoForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="login"> 登录 </el-button>
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
      infoForm: {
        'username': '',
        'password': ''
      }
    }
  },

  methods: {
    login () {
      this.axios.post("api/user/login", this.infoForm).then(
        (res) => { console.log(res.data); },
      ).catch(
        (err) => { console.log(err); }
      )
    }
  }
}
</script>
