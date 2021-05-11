<template>
  <Select
    v-model="model"
    :items="items"
    item-text="name"
    item-value="id"
    placeholder="Select item"
  >
  </Select>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const items = Array.from(Array(5).keys()).map(key => {
  const i = key + 1
  return {
    id: `item${i}`,
    name: `Item ${i}`,
  }
})
items.splice(3, 0, { divider: true })
</script>
