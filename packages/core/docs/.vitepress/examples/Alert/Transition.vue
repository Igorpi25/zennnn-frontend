<template>
  <div class="space-y-6">
    <div class="text-center">
      <Btn retain-focus-on-click @click="model = !model">
        Toggle
      </Btn>
    </div>
    <div class="h-24">
      <Alert v-model="model" color="warn" transition="scale-transition" mode="out-in" class="origin-top-left">
        Alert with transition.
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
</script>
