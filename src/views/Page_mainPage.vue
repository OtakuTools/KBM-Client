<template>
<div>
  <showList />
  <showForm />
</div>
</template>

<script>
// @ is an alias to /src
import showList from '@/components/comp_showFile.vue'
import showForm from '@/components/comp_draftInfo.vue'

export default {
  name: 'Page_login',
  components: {
    showList,
    showForm
  }
}
</script>
