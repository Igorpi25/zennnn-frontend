<template>
  <p class="text-gray-200 pb-2">
    min-width: none;
  </p>
  <BtnToggle
    :items="items"
    min-width="none"
    class="mb-6"
  />
  <p class="text-gray-200 pb-2">
    min-width: 100px;
  </p>
  <BtnToggle
    :items="items"
    min-width="100px"
  />
</template>

<script setup>
const items = [
  {
    text: 'Item 1',
    value: 'item-1',
  },
  {
    text: 'Item 2',
    value: 'item-2',
  },
  {
    text: 'Item 3',
    value: 'item-3',
  },
]
</script>
