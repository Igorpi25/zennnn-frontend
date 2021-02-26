<template>
  <NavBar @toggle="toggleMenu" />
  <div class="max-w-8xl mx-auto">
    <div class="md:flex">
      <SideBar :open="isOpen" @close="toggleMenu(false)" />
      <div class="min-w-0 w-full flex-auto">
        <div class="flex w-full">
          <main class="min-w-0 w-full flex-auto p-6 pb-12">
            <Content />
          </main>
          <Toc />
        </div>
      </div>
    </div>
  </div>

  <Debug />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import NavBar from './components/NavBar.vue'
import SideBar from './components/SideBar.vue'
import Toc from './components/Toc.vue'

const route = useRoute()

const isOpen = ref<boolean>(false)

watch(() => route.path, () => { isOpen.value = false })

function toggleMenu (to: boolean | undefined) {
  isOpen.value = typeof to === 'boolean' ? to : !isOpen.value
}
</script>
