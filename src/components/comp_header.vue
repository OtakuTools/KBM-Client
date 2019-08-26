<template>
  <div>
    <el-menu mode="horizontal" style="overflow: hidden; height: 60px;">
      <el-submenu index="1" style="position: absolute; right: 120px; height: 60px; overflow: hidden;">
        <template slot="title">
          <el-avatar shape="circle" fit="fill" size="small" src="../assets/logo.png" style="margin-right: 10px;"></el-avatar>
          <span v-text="username"></span>
        </template>            
        <el-menu-item index="1-1" v-text="userType"></el-menu-item>
      </el-submenu>
      <el-menu-item index="2" style="position: absolute; right: 0px; height: 60px; overflow: hidden;">
        <i class="el-icon-switch-button"></i><a @click="logout">退出登录</a>
      </el-menu-item>
      <el-menu-item index="3" style="position: absolute; left: 0px; height: 60px; overflow: hidden;">
        <img :height="60" src="../assets/logo.png">
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      websocket: null,
      username : '',
      userType : '',
    }
  },

  created() {
    let [type, name, t] = this.$cookies.get("token").split("_");
    this.username = name;
    this.userType = `权限：${type}`;
  },

  mounted() {
    if (typeof(WebSocket) === "undefined"){
      this.$message({
        message: "该浏览器不支持WebSocket",
        type: "error"
      });
    } else {
      this.websocket = new WebSocket('ws://localhost:3001/');
      this.websocket.onopen = (event) => {
        console.log('websocket connected');
      };

      this.websocket.onmessage = (event) => {
        
      };

      this.websocket.onclose = (event) => {
        console.log("WebSocket is closed now.");
      };

      this.websocket.onerror = (event) => {
        console.error("WebSocket error observed:", event);
      };
    }
  },

  destroyed () {
    // 销毁监听
    this.websocket.close();
  },

  methods: {
    sendMessage(info) {
      if (this.websocket && typeof this.websocket.send === 'function') {
        this.websocket.send(JSON.stringify(info));
      }
    },

    logout() {
      this.axios.get(`api/user/logout?token=${this.$cookies.get("token")}`).then(
        (res) => {
          let response = res.data;
          if (!response.errorCode) {
            this.sendMessage({
              type: 0,
              event: "user logout"
            });
            this.$router.push({
              name: "login"
            });
          } else {
            this.$message({
              message: "登出失败",
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