<template>
  <div class="mb-6">
    Value: {{ model }}
  </div>
  <Radio
    v-for="(item, i) in items"
    v-model="model"
    :key="item"
    :value="item"
    :disabled="i === 2"
    name="radio-group"
    class="pb-1"
  >
    <span class="ml-2">{{ item }}</span>
  </Radio>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
const items = ['item-1', 'item-2', 'item-3', 'item-4']
</script>
