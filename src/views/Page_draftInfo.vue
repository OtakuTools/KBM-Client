<template>
  <el-container>
    <el-header>
      <compheader />
    </el-header>
    <el-main>
      <compDraftInfo />
    </el-main>
  </el-container>
</template>

<style lang="less" scoped>
  .el-container {
    width: 100%;
    height: calc(100vh);
    background-color: #f2f2f2;
  }

  .el-header {
    padding: 0;
  }
</style>


<script>
// @ is an alias to /src
import compDraftInfo from '@/components/comp_draftInfo.vue'
import compheader from "@/components/comp_header.vue";

export default {
  name: 'Page_createInfo',
  components: {
    compDraftInfo,
    compheader
  }
}
</script>
