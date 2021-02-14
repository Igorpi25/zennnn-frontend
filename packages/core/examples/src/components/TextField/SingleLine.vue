<template>
  <TextField v-model="model" label="Single Line" placeholder="Single Line" single-line>
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
