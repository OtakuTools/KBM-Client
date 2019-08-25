<template>
  <div>
    <compheader />
    <userList />
  </div>
</template>


<script>
// @ is an alias to /src
import userList from "@/components/comp_userList.vue";
import compheader from "@/components/comp_header.vue";

export default {
  name: 'Page_systemAdmin',
  components: {
    userList,
    compheader
  }
}
</script>
