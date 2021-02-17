<template>
  <Menu
    v-model:value="value"
    :arrow="false"
    bottom
    width="auto"
    max-height="304"
  >
    <template v-slot:activator>
      <Btn>
        Dropdown
      </Btn>
    </template>
    <MenuItem
      v-slot="{ selected }"
      v-for="(item, i) in items"
      :key="item.value"
      :index="i"
      :value="item.value"
      :disabled="item.disabled"
      class="pl-0 pr-3"
    >
      <div class="w-8 flex justify-center flex-shrink-0">
        <Icon v-if="selected" >{{ ziChecked }}</Icon>
      </div>
      <span class="truncate">
        {{ item.text }}
      </span>
    </MenuItem>
  </Menu>
  <span class="inline-block ml-4 py-2">
    <span class="text-gray-200">Value: </span>{{ value }}
  </span>
</template>

<script setup>
import { ref } from 'vue'
import { ziChecked } from '@zennnn/icons'

const value = ref(null)

const items = Array.from(Array(20).keys()).map(key => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i} Item ${i} Item ${i} Item ${i}`,
    disabled: i === 3
  }
})
</script>
