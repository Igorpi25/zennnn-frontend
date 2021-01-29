<template>
  <nav
    :class="{ open }"
    class="sidebar bg-white border-r md:border-r-0 border-light-gray-400 w-64 xl:w-72 fixed top-0 overflow-y-auto transform -translate-x-full md:translate-x-0 transition-transform duration-200 mt-12 py-6 px-4"
  >
    <ul
      v-for="item in items"
      :key="item.text"
      class="text-sm"
    >
      <SideBarLinks :item="item" />
    </ul>
  </nav>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useSiteData } from 'vitepress'
import SideBarLinks from './SideBarLinks.vue'

defineProps({
  open: Boolean,
})

const siteData = useSiteData()

const items = computed(() => {
  return siteData.value.themeConfig.sidebar
})
</script>

<style scoped>
.sidebar {
  min-height: calc(100vh - 3rem);
  z-index: 10;
}
.sidebar.open {
  transform: translateX(0);
}

.sidebar-mask {
  z-index: 9;
}
</style>
