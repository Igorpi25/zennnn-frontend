<template>
  <div class="space-y-6">
    <div v-if="!model" class="text-center">
      <Btn @click="model = true">
        Reset
      </Btn>
    </div>
    <Alert v-model="model" close>
      Dissmissable
    </Alert>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(true)
</script>
