<template>
  <Autocomplete
    v-model="model"
    :items="items"
    :rules="[rules.required]"
    placeholder="Select item"
    state-icon
  >
  </Autocomplete>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const items = Array.from(Array(10).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
  }
})
const rules = {
  required: v => !!v || 'Please select.',
}
</script>
