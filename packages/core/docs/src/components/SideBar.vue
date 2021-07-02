<template>
  <div
    v-if="open"
    class="md:hidden fixed top-0 left-0 w-screen h-screen"
    @click="$emit('close')"
  />
  <nav
    :class="[
      'h-[calc(100vh-3rem)] bg-white border-r md:border-r-0 border-light-gray-400 w-64 xl:w-72 fixed md:sticky top-12 z-10 overflow-y-auto -translate-x-full md:translate-x-0 transition-transform duration-200 py-6 px-4',
      { 'translate-x-0': open },
    ]"
  >
    <ul v-for="item in items" :key="item.text" class="text-sm">
      <SideBarLinks :item="item" />
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmit } from 'vue'
import { useSiteData } from '../composables/siteData'
import SideBarLinks from './SideBarLinks.vue'

defineProps({
  open: Boolean,
})

defineEmit(['close'])

const siteData = useSiteData()

const items = computed(() => {
  return siteData.value.themeConfig.sidebar
})
</script>
