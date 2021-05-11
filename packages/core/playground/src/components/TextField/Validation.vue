<template>
  <TextField
    v-model="model"
    :hide-details="false"
    :rules="[rules.required]"
    placeholder="Value required"
  >
  </TextField>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
const rules = {
  required: v => !!v || 'Please select.',
}
</script>
