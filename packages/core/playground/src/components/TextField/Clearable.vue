<template>
  <TextField
    v-model="model"
    placeholder="Clearable"
    clearable
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
