<template>
  <div>
    <userList />
  </div>
</template>


<script>
// @ is an alias to /src
import userList from "@/components/comp_userList.vue";

export default {
  name: 'Page_systemAdmin',
  components: {
    userList
  }
}
</script>
