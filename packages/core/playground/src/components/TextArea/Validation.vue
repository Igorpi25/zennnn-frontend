<template>
  <TextArea
    v-model="model"
    :hide-details="false"
    :rules="[rules.required]"
    label="Label"
    placeholder="Value required"
  >
  </TextArea>
</template>

<script setup>
import { ref } from 'vue'

const model = ref('')
const rules = {
  required: (v) => !!v || 'Please select.',
}
</script>
