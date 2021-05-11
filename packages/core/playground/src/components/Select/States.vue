<template>
  <div class="grid sm:grid-cols-2 gap-x-4 gap-y-6">
    <Select
      v-model="model"
      :items="items"
      label="Default disabled"
      placeholder="Default disabled"
      disabled
    >
    </Select>
    <Select
      v-model="model2"
      :items="items"
      label="Default readonly"
      placeholder="Default readonly"
      readonly
    >
    </Select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const model2 = ref(null)
const items = Array.from(Array(5).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
  }
})
</script>
