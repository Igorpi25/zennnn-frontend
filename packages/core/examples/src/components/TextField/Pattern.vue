<template>
  <TextField
    v-model="model"
    :pattern="pattern"
    :pattern-message="patternMessage"
    :hide-details="false"
    label="Default"
    placeholder="Input pattern"
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
const pattern = '^[a-zA-Z0-9~`!@#$%^&+=*.,:;\\-_ ()№?"\\|/\']*$'
const patternMessage = 'Use (A-Z) and special characters.'
</script>
