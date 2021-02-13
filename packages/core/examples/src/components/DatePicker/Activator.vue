<template>
  <DatePicker v-model="model">
    <template v-slot:activator="{ menu, formatted }">
      <input
        :class="{ 'ring-2 ring-blue-400': menu }"
        :value="formatted"
        class="text-blue-500 placeholder-blue-500 bg-transparent dark:text-white focus:ring-2 focus:ring-blue-400 focus:outline-none px-2"
        placeholder="Select Date"
        readonly
      >
    </template>
  </DatePicker>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(null)
</script>
