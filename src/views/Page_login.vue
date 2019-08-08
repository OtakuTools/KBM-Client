<template>
  <div>
    <compLogin />
    <userList />
  </div>
</template>

<script>
// @ is an alias to /src
import compLogin from '@/components/comp_login.vue'
import userList from "@/components/comp_userList.vue";

export default {
  name: 'Page_login',
  components: {
    compLogin,
    userList
  }
}
</script>
