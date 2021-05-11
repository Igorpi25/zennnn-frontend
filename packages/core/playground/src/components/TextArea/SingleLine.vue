<template>
  <TextArea v-model="model" label="Single Line" placeholder="Single Line" single-line>
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
