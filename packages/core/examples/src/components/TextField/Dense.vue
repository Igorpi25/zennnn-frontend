<template>
  <TextField v-model="model" label="Dense" placeholder="Dense" dense>
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
