<template>
  <nav
    class="toc h-page-wrapper hidden lg:block text-sm sticky top-12 overflow-y-auto w-64 xl:w-72 py-6 px-6"
  >
    <h6 v-if="headers" class="text-gray-600 font-semibold mb-3">On this page</h6>
    <ul>
      <li
        v-for="item in headers"
        :key="item.slug"
        :class="['py-1', { 'ml-4': item.level === 3 }]"
      >
        <a
          :href="`#${item.slug}`"
          :class="`#${item.slug}` === activeHash ? 'text-blue-500' : 'text-gray-200 hover:text-black'"
        >
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute, usePageData } from 'vitepress'
import { computed } from 'vue'
import { useTocActiveLink } from '../composables/tocActiveLink'

const route = useRoute()
const page = usePageData()

const { activeHash } = useTocActiveLink()

const headers = computed(() => {
  return page.value.headers
})
</script>
