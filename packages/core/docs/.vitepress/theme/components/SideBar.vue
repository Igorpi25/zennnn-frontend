<template>
  <nav
    :class="{ open }"
    class="sidebar h-page-wrapper bg-white border-r md:border-r-0 border-light-gray-400 w-64 xl:w-72 fixed top-0 md:sticky top-12 overflow-y-auto transform -translate-x-full md:translate-x-0 transition-transform duration-200 py-6 px-4"
  >
    <ul
      v-for="item in items"
      :key="item.text"
      class="text-sm"
    >
      <SideBarLinks :item="item" />
    </ul>
  </nav>
  <div
    v-if="open"
    class="sidebar-mask md:hidden fixed top-0 left-0 w-screen h-screen"
    @click="$emit('close')"
  />
</template>

<script setup>
import { computed, defineProps, defineEmit } from 'vue'
import { useSiteData } from 'vitepress'
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

<style scoped>
.sidebar {
  z-index: 10;
}
.sidebar.open {
  transform: translateX(0);
}

.sidebar-mask {
  z-index: 9;
}
</style>
