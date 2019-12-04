<template>
  <div class="content view">
    <StatusBar />
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import StatusBar from '@/components/StatusBar'
import NavBar from '@/components/NavBar'

export default {
  name: 'SpecLayout',
  components: {
    StatusBar,
    NavBar,
  },
}
</script>
