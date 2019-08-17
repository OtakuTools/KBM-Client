<template>
<div>
  <showList />
</div>
</template>

<script>
// @ is an alias to /src
import showList from '@/components/comp_showFile.vue'

export default {
  name: 'Page_login',
  components: {
    showList
  }
}
</script>
