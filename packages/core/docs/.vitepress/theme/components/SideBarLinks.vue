<template>
  <li class="mb-8">
    <h6 v-if="item.text" class="text-gray-600 font-semibold px-2 mb-3">
      {{ item.text }}
    </h6>
    <ul v-if="item.children">
      <SideBarLink
        v-for="child in item.children"
        :key="child.text"
        :item="child"
        class="mb-1"
      />
    </ul>
  </li>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import SideBarLink from './SideBarLink.vue'

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})
</script>
