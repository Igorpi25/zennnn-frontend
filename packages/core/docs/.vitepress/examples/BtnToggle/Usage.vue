<template>
  <div class="mb-6">
    <BtnToggle
      v-model="model1"
      :items="items"
      class="inline-flex mr-6"
    />
    <span class="text-gray-200">
      Value: {{ model1 }}
    </span>
  </div>
  <div>
    <BtnToggle
      v-model="model2"
      :items="items"
      class="inline-flex mr-6"
    />
    <span class="text-gray-200">
      Value: {{ model2 }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref(0)
const model2 = ref(1)

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
