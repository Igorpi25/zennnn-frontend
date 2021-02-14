<template>
  <Switch v-model="model1" label="Default" class="mb-6">
    <span class="ml-2">Value: {{ model1 }}</span>
  </Switch>
  <Switch v-model="model2" label="Small" small>
    <span class="ml-2">Value: {{ model2 }}</span>
  </Switch>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref(false)
const model2 = ref(false)
</script>
