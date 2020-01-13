<template>
  <div class="content view">
    <StatusBar />
    <NavBar />
    <div class="mb-12">
      <router-view />
    </div>
    <div class="absolute bottom-0 w-full">
      <Copyright />
    </div>
  </div>
</template>

<script>
import StatusBar from '@/components/StatusBar'
import NavBar from '@/components/NavBar'
import Copyright from '@/components/Copyright'

export default {
  name: 'OrgLayout',
  components: {
    StatusBar,
    NavBar,
    Copyright,
  },
}
</script>
