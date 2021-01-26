<template>
  <div class="flex flex-wrap">
    <div
      v-for="(icon, name) of icons"
      :key="name"
      class="w-40 px-4 mt-2 mb-3"
    >
      <div class="text-gray-400 text-sm white-space-none pb-1">{{ name.replace('zi', '') }}</div>
      <Icon>
        {{ icon }}
      </Icon>
    </div>
  </div>
</template>

<script setup>
import * as icons from '@zennnn/icons'
</script>
