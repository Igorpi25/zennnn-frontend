<template>
  <header class="nav-bar sticky top-0 bg-white z-10 h-12 flex items-center border-b border-light-gray-400 px-6">
    <Icon
      class="md:hidden hover:text-gray-200 active:text-gray-200 mr-3"
      @click="toggleMenu"
    >
      {{ ziMenu }}
    </Icon>
    <a href="/" class="font-semibold text-xl">
      {{ $site.title }}
    </a>
  </header>
  <SideBar :open="isOpen" />
  <div
    v-if="isOpen"
    class="sidebar-mask md:hidden fixed top-0 left-0 w-screen h-screen"
    @click="isOpen = false"
  />
  <main class="flex-grow md:ml-64 xl:ml-72 xl:mr-72 p-6">
    <div class="max-w-screen-md mx-auto">
      <Content />
    </div>
  </main>
  <nav id="toc" class="hidden lg:block w-64 xl:w-72 fixed py-6 px-4"></nav>

  <Debug />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { ziMenu } from '@zennnn/icons'
import SideBar from './components/SideBar.vue'

const route = useRoute()

const isOpen = ref(false)

watch(() => route.path, () => { isOpen.value = false })

function toggleMenu () {
  isOpen.value = !isOpen.value
}
</script>
