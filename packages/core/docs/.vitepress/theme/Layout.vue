<template>
  <div>
    <NavBar @toggle="toggleMenu" />
    <SideBar :open="isOpen" />
    <div
      v-if="isOpen"
      class="sidebar-mask md:hidden fixed top-0 left-0 w-screen h-screen"
      @click="toggleMenu(false)"
    />
    <main class="flex-grow md:ml-64 xl:ml-72 xl:mr-72 p-6">
      <div class="max-w-screen-md mx-auto">
        <Content />
      </div>
    </main>
    <nav id="toc" class="hidden lg:block w-64 xl:w-72 fixed py-6 px-4"></nav>
  </div>

  <Debug />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'

const route = useRoute()

const isOpen = ref(false)

watch(() => route.path, () => { isOpen.value = false })

function toggleMenu (to) {
  isOpen.value = typeof to === 'boolean' ? to : !isOpen.value
}
</script>
