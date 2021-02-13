<template>
  <Messages :value="items">
    <template v-slot:default="{ message }">
      <span class="text-lg text-red-500">{{ message }}</span>
    </template>
  </Messages>
</template>

<script setup>
const items = ['Message 1.', 'Message 2.']
</script>
