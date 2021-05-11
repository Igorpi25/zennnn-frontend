<template>
  <Switch
    v-model="model"
    true-value="on"
    false-value="off"
  >
    <span class="ml-2">Value: {{ model }}</span>
  </Switch>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('off')
</script>
