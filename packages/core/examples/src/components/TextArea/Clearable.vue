<template>
  <TextArea
    v-model="model"
    placeholder="Clearable"
    clearable
  >
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
