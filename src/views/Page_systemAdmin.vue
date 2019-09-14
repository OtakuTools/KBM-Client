<template>
  <el-container>
    <el-header>
      <compheader />
    </el-header>
    <el-main>
      <el-card>
        <el-tabs tab-position="left">
          <el-tab-pane label="用户状态">
            <userList />
          </el-tab-pane>
          <el-tab-pane label="新建用户">
            <compRegist />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>
  .el-container {
    width: 100%;
    height: calc(100vh);
    background-color: #f2f2f2;
    padding: 0;
  }

  .el-header {
    padding: 0;
  }
</style>

<script>
// @ is an alias to /src
import userList from "@/components/comp_userList.vue";
import compheader from "@/components/comp_header.vue";
import compRegist from "@/components/comp_regist.vue";

export default {
  name: 'Page_systemAdmin',
  components: {
    userList,
    compRegist,
    compheader,
  }
}
</script>
