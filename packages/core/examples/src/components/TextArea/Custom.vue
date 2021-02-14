<template>
  <TextField
    v-model="model"
    placeholder="Custom"
    control-class="bg-transparent dark:bg-transparent"
    input-class="placeholder-blue-500 dark:placeholder-blue-500"
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
