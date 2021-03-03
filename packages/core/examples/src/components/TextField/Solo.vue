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
      :prepend-icon="ziPublish"
      label="Solo"
      placeholder="Solo"
      solo
    >
    </TextField>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziPublish } from '@zennnn/icons'

const model = ref('')
const model2 = ref('')
</script>
