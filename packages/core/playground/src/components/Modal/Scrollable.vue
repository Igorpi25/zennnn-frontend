<template>
  <Modal v-model="model">
    <template v-slot:activator>
      <Btn>
        Dialog
      </Btn>
    </template>
    <div class="p-6">
      Header
    </div>
    <div class="h-64 overflow-y-auto px-6">
      <div v-for="n in 100" :key="n">
        Content content content content content content content content content
      </div>
    </div>
    <div class="p-6">
      <Btn outlined class="mt-4 mx-4" @click="model = false">
        Cancel
      </Btn>
      <Btn class="mt-4 mx-4" @click="model = false">
        Ok
      </Btn>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
</script>
