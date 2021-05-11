<template>
  <Select
    v-model="model"
    :items="items"
    :prepend-icon="ziPublish"
    :append-icon="ziPublish"
    placeholder="Select item"
  >
  </Select>
</template>

<script setup>
import { ref } from 'vue'
import { ziPublish } from '@zennnn/icons'

const model = ref(null)
const items = Array.from(Array(5).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
    disabled: i === 3,
  }
})
</script>
