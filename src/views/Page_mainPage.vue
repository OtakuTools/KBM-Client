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
