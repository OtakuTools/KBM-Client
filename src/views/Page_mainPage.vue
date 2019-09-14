<template>
  <div>
    <el-container>
      <el-header>
        <compheader />
      </el-header>
      <el-main>
        <showList />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
  .el-container {
    background-color:#f2f2f2;
    width:calc(100vw);
    height:calc(100vh);
    overflow:hidden;
    padding:0;
    margin:0;
  }

  .el-header {
    padding: 0;
  }

  .el-main {
    background-color:#f2f2f2;
    height: 100%;
  }
</style>

<script>
// @ is an alias to /src
import showList from '@/components/comp_showFile.vue'
import compheader from "@/components/comp_header.vue";

export default {
  name: 'Page_main',
  components: {
    showList,
    compheader
  }
}
</script>
