<template>
  <div>
    <VScroll
      :bench="0"
      :item-height="32"
      :items="items"
      :height="300"
    >
      <template v-slot:default="{ item, index }">
        <div>
          {{ index }} - {{ item.text }}
        </div>
      </template>
    </VScroll>
  </div>
</template>

<script setup>
const items = Array.from(Array(100).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
  }
})
</script>
