<template>
  <TextArea v-model="model" placeholder="No auto grow" :auto-grow="false">
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
</script>
