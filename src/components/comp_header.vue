<template>
  <div>
    <el-container>
      <el-header></el-header>
      <el-main>
        <el-row type="flex" align="middle">
          <el-col :span="11">
            <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-menu-item index="1" disabled><i class="el-icon-info"></i></el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="2">
            <img :height="150" src="../assets/logo.png">
          </el-col>
          <el-col :span="11">
            <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
              <el-submenu index="3">
                <template slot="title">
                  <el-avatar shape="circle" fit="fill" size="small" src="../assets/logo.png"></el-avatar>
                  <span v-text="username"> 用户名 </span>
                </template>            
                <el-menu-item index="3-1" v-text="username"> 用户名 </el-menu-item>
                <el-menu-item index="3-2" v-text="userType"> 用户权限 </el-menu-item>
              </el-submenu>
              <el-menu-item index="5"><i class="el-icon-switch-button"></i><a>退出登录</a></el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-main>
      <el-footer></el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
    data () {
        return {
          username : 'Ming',
          userType : 'admin',
        }
    },
    methods: {
    }
}
</script>