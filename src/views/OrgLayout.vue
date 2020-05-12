<template>
  <div class="min-h-screen flex flex-col relative">
    <StatusBar />
    <NavBar />
    <div class="mb-12">
      <router-view />
    </div>
    <div class="h-12 absolute bottom-0 w-full flex items-center justify-center text-center">
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
