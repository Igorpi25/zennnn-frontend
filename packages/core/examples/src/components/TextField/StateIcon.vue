<template>
  <div class="grid sm:grid-cols-2 gap-x-4 gap-y-6">
    <TextField
      v-model="model"
      :rules="[rules.required]"
      state-icon
      label="Default"
      placeholder="Value required"
    >
    </TextField>
    <TextField
      v-model="model2"
      :rules="[rules.required]"
      state-icon
      state-error-color="none"
      label="Only success"
      placeholder="Value required"
    >
    </TextField>
    <TextField
      v-model="model3"
      :rules="[rules.required]"
      required
      state-icon
      label="Required"
      placeholder="Value required"
    >
    </TextField>
    <TextField
      v-model="model4"
      :rules="[rules.required]"
      :state-success-icon="ziUser"
      :state-error-icon="ziWarning"
      state-success-color="text-blue-500"
      state-error-color="text-gray-200"
      state-icon
      label="Custom"
      placeholder="Value required"
    >
    </TextField>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziUser, ziWarning } from '@zennnn/icons'

const model = ref('')
const model2 = ref('')
const model3 = ref('')
const model4 = ref('')
const rules = {
  required: v => !!v || 'Please select.',
}
</script>
