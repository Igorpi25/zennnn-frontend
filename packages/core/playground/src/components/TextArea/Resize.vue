<template>
  <TextArea v-model="model" placeholder="With resize" :auto-grow="false" :no-resize="false">
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
