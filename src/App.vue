<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { CONFIG } from './static/js/Config';

export default {
  data() {
    return {
      logoutLimit: 1000 * 60 * 5, // 5分钟
      websocket: null
    }
  },

  mounted() {
    if (typeof(WebSocket) === "undefined"){
      this.$message({
        message: "该浏览器不支持WebSocket",
        type: "error"
      });
    } else {
      this.websocket = new WebSocket(CONFIG.WS.url);
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

    // 超时登出
    let logoutTimer = setTimeout(this.logout, this.logoutLimit);
  
    let userOpDelay = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(this.logout, this.logoutLimit);
    }

    document.getElementById("app").addEventListener('keydown', function(e){ userOpDelay(); });
    document.getElementById("app").addEventListener('mousemove', function(e){ userOpDelay(); });
    document.getElementById("app").addEventListener('mousedown', function(e){ userOpDelay(); });
    document.getElementById("app").addEventListener('click', function(e){ userOpDelay(); });
    document.getElementById("app").addEventListener('scroll', function(e){ userOpDelay(); });
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
      if (this.$cookies && this.$cookies.get("token") && this.$cookies.get("token") != "") {
        this.axios.get(`api/user/logout?token=${this.$cookies.get("token")}`).then(
          (res) => {
            let response = res.data;
            if (!response.errorCode) {
              this.sendMessage({
                type: 0,
                event: "user logout"
              });
              this.$confirm('检测到无任何操作，账户登出。请重新登录！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              }).then(() => {
                this.$cookies.remove("token");
                this.$router.push({
                  name: "login"
                });
              }).catch(() => {
  
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
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
