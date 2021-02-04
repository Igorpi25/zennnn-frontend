<template>
  <div>
    <BtnToggle
      v-model="model"
      :items="items"
      class="inline-flex mr-6 mb-6"
    />
    <span class="text-gray-200">
      Value: {{ model }}
    </span>
  </div>
  <BtnToggle
    v-model="model"
    :items="items"
    disabled
  />
</template>

<script setup>
import { ref } from 'vue'

const model = ref('item-1')

const items = [
  {
    text: 'Item 1',
    value: 'item-1',
  },
  {
    disabled: true,
    text: 'Item 2',
    value: 'item-2',
  },
  {
    text: 'Item 3',
    value: 'item-3',
  },
]
</script>
