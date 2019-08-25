<template>
  <div>
    <el-table
      ref="filterTable"
      style="width:100%"
      :data="userData"
      >
      <el-table-column
        prop="username"
        label="用户名"
        sortable
        >
      </el-table-column>
      <el-table-column
        prop="type"
        label="权限"
        width= 180px
        sortable
        :filters="[
          {text: '录入员', value: '录入员'},
          {text: '审批经理', value: '审批经理'},
          {text: '系统管理员', value: '系统管理员'},
          {text: '知识库管理员', value: '知识库管理员'}
          ]"
        :filter-method="filterHandler"
        >
        <template slot-scope="scope">
          <el-tag effect="dark">
            {{scope.row.type}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="lastLogin"
        label="最后登录"
        sortable
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="账户状态"
        width= 180px
        sortable
        >
        <template slot-scope="scope">
          <el-tag effect="dark" :type="scope.row.status===1?'success':'info'">
            {{scope.row.status===1?'在线':'离线'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="账户操作"
        >
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="info" round size="small">审计操作记录</el-button>
            <el-button type="warning" round size="small" :disabled="scope.row.status===0">强制下线</el-button>
            <el-button type="danger" round size="small">删除账户</el-button>
          </el-button-group>
          </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      // userData: [{
      //   type: '录入员',
      //   username: '王小一',
      //   password: '文本生成至 28% 出错',
      //   lastLogin: '0807',
      //   status: 0,
      // },{
      //   type: '录入员',
      //   username: '王小二',
      //   password: '文本生成至 28% 出错',
      //   lastLogin: '20190807',
      //   status: 0,
      // },{
      //   type: '审核经理',
      //   username: 'zzm',
      //   password: '文本生成至 28% 出错',
      //   lastLogin: '2019-08-07 13:14:00',
      //   status: 1,
      // },{
      //   type: '知识库管理员',
      //   username: 'hzt',
      //   password: '文本生成至 28% 出错',
      //   lastLogin: '2019-08-07',
      //   status: 1,
      // },{
      //   type: '系统管理员',
      //   username: '云焰',
      //   password: '文本生成至 28% 出错',
      //   lastLogin: '无登录记录',
      //   status: 0,
      // },]
      userData: []
    }
  },

  created() {
    this.getInfo();
  },

  methods: {
    filterHandler (value, row, column) {
      return row.type === value
    },

    getInfo() {
      this.axios.get(`api/user/information?token=${this.$cookies.get("token")}`).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.userData = response.data;
          } else {
            this.$message({
              message: "无法获取用户信息",
              type: "error"
            });
          }
        }
      ).catch(
        (error) => {
          this.$message({
            message: error,
            type: "error"
          });
        }
      )
    }
  }
}
</script>
