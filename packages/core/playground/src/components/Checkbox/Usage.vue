<template>
  <Checkbox v-model="model">
    <span class="ml-2">Value: {{ model }}</span>
  </Checkbox>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
</script>
