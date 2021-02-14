<template>
  <TextField
    v-model="model"
    :prepend-icon="ziSearch"
    :append-icon="ziFactory"
    placeholder="With prepend and append"
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'
import { ziSearch, ziFactory } from '@zennnn/icons'

const model = ref('')
</script>
