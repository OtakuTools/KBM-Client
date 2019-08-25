<template>
  <el-container>
    <el-header>
      <compheader />
    </el-header>
    <el-mian>
      <compDraftInfo />
    </el-mian>
  </el-container>
</template>

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
