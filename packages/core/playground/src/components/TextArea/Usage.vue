<template>
  <TextArea v-model="model" label="Default" placeholder="Default">
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
