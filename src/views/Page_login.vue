<template>
  <div>
    <compLogin />
  </div>
</template>

<script>
// @ is an alias to /src
import compLogin from '@/components/comp_login.vue'

export default {
  name: 'Page_login',
  components: {
    compLogin
  }
}
</script>
