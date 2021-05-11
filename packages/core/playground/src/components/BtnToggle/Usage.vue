<template>
  <div class="mb-6">
    <BtnToggle
      v-model="model"
      :items="items"
      class="inline-flex mr-6"
    />
    <span class="text-gray-200">
      Value: {{ model }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(0)

const items = [
  {
    text: 'Item 1',
    value: 1,
  },
  {
    text: 'Item 2',
    value: 2,
  },
]
</script>
