<template>
  <TextField
    v-model="model"
    :prepend-icon="ziSearch"
    :append-icon="ziFactory"
    label="Default"
    placeholder="Custom slots"
  >
    <template v-slot:prepend>
      <div class="px-4" :class="isRed ? 'text-red-500' : 'text-yellow-500'">
        Custom slot
      </div>
    </template>
    <template v-slot:append>
      <a href="#" class="text-blue-500 px-4" @click.prevent.stop="isRed = !isRed">
        Toggle
      </a>
    </template>
  </TextField>
</template>

<script setup>
import { ref } from 'vue'
import { ziSearch, ziFactory } from '@zennnn/icons'

const model = ref('')
const isRed = ref(false)
</script>
