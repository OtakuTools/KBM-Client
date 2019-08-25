<template>
  <div>
    <el-menu mode="vertical" collapse=true @open="handleOpen" @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu index="1">
          <template slot="title">
          <i class="el-icon-collection-tag"></i>
          </template>
          <el-menu-item-group>
            <span slot="title">书签栏</span>
            <el-menu-item index="1-1">全部事项</el-menu-item>
            <el-menu-item index="1-2">代办事项</el-menu-item>
            <el-menu-item index="1-3">已办事项</el-menu-item>
          </el-menu-item-group>
      </el-submenu>
    </el-menu>
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