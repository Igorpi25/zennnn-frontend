<template>
  <TextField
    v-model="model"
    label="Default"
    placeholder="Clearable"
    clearable
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
