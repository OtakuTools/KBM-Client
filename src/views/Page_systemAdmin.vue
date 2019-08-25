<template>
  <div>
    <compheader />
    <compaside />
    <userList />
  </div>
</template>


<script>
// @ is an alias to /src
import userList from "@/components/comp_userList.vue";
import compheader from "@/components/comp_header.vue";
import compaside from "@/components/comp_aside.vue";

export default {
  name: 'Page_systemAdmin',
  components: {
    userList,
    compaside,
    compheader,
  }
}
</script>
