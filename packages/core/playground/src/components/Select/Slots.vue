<template>
  <Select
    v-model="model"
    :items="items"
    placeholder="Search..."
  >
    <template v-slot:prepend>
      <Icon class="mx-2">{{ ziSearch }}</Icon>
    </template>
    <template v-slot:append>
      <Icon class="mx-2">{{ ziFactory }}</Icon>
    </template>
    <template v-slot:item="{ item, selected }">
      <div class="w-10 flex justify-center flex-shrink-0 ml-2">
        <Icon v-if="selected">{{ ziChecked }}</Icon>
      </div>
      <div class="truncate flex-grow">{{ item.text }}</div>
      <div class="text-right">{{ item.value }}</div>
    </template>
    <template v-slot:prepend-item>
      <button class="h-10 w-full flex items-center focus:outline-none text-blue-500 hover:text-blue-400 px-2 ml-10">
        Prepend item
      </button>
    </template>
    <template v-slot:append-item>
      <button class="h-10 w-full flex items-center focus:outline-none text-blue-500 hover:text-blue-400 px-2 ml-10">
        Append Item
      </button>
    </template>
  </Select>
</template>

<script setup>
import { ref } from 'vue'
import { ziSearch, ziFactory, ziChecked } from '@zennnn/icons'

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
