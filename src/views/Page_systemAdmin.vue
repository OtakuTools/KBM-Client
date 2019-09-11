<template>
  <div>
    <el-container>
      <el-header>
        <compheader />
      </el-header>
      <el-main style="background-color:#f9f9f9">
        <el-tabs tab-position="left">
          <el-tab-pane label="用户状态">
            <userList />
          </el-tab-pane>
          <el-tab-pane label="新建用户">
            <compRegist />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>


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
