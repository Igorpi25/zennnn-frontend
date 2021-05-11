<template>
  <li>
    <a
      v-if="isExternal"
      :rel="item.rel || 'noopener noreferrer'"
      :aria-label="item.ariaLabel"
      :href="item.link"
      :class="classes"
      target="_blank"
    >
      {{ item.text }}
    </a>
    <router-link
      v-else
      :to="item.link"
      custom
      v-slot="{ isActive, href, navigate }"
    >
      <a
        :href="href"
        :class="[classes, isActive ? activeClasses : inactiveClasses]"
        @click="navigate"
      >
        {{ item.text }}
      </a>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { isExternal as isExternalCheck } from '../utils'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const isExternal = computed(() => isExternalCheck(props.item.link))

const classes = 'block hover:bg-gray-100 bg-opacity-10 hover:bg-opacity-10 rounded py-2 px-2'
const activeClasses = 'text-blue-500 hover:text-blue-500 bg-blue-500 hover:bg-blue-500'
const inactiveClasses = 'text-gray-400'
</script>
