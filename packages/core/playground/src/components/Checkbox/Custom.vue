<template>
  <div class="space-y-6">
    <Checkbox
      label="Red"
      input-class="peer-checked:bg-green-500 peer-checked:border-green-500 peer-focus:ring-green-400"
    >
      <span class="ml-2">Green color</span>
    </Checkbox>
    <Checkbox
      input-class="peer-checked:bg-red-600 peer-checked:border-red-600 peer-focus:ring-red-500 w-6 h-6"
      control-class="items-center"
    >
      <span class="ml-2">Red color and size</span>
    </Checkbox>
    <Checkbox :checked-icon="ziStatusPoint">
      <span class="ml-2">Custom checked icon</span>
    </Checkbox>
  </div>
</template>

<script setup>
import { ziStatusPoint } from '@zennnn/icons'
</script>
