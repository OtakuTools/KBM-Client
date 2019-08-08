<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-form :model="infoForm">
          <el-form-item label="用户名">
            <el-input v-model="infoForm.user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="infoForm.pswd" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="success"> 登录 </el-button>
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
        'user': '',
        'pswd': ''
      }
    }
  }
}
</script>
