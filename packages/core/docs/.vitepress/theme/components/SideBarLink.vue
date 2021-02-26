<template>
  <li>
    <a
      v-bind="linkProps"
      :class="[
        'block hover:bg-gray-100 bg-opacity-10 hover:bg-opacity-10 rounded py-2 px-2',
        isActive ? 'text-blue-500 hover:text-blue-500 bg-blue-500 hover:bg-blue-500' : 'text-gray-400',
      ]"
    >
      {{ item.text }}
    </a>
  </li>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useNavLink } from '../composables/navLink'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
})

const { props: linkProps, isActive, isExternal } = useNavLink(props.item)
</script>
