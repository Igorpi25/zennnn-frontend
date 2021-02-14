<template>
  <div class="grid sm:grid-cols-2 gap-x-4 gap-y-6">
    <TextField
      v-model="model"
      label="Solo"
      placeholder="Solo"
      solo
    >
    </TextField>
    <TextField
      v-model="model2"
      label="Solo custom"
      placeholder="Solo custom"
      solo
      control-class="bg-transparent dark:bg-transparent"
      input-class="placeholder-blue-500 dark:placeholder-blue-500"
    >
    </TextField>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
const model2 = ref('')
</script>
