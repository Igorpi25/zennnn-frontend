<template>
  <Modal v-model="model">
    <template v-slot:activator>
      <Btn>
        Dialog
      </Btn>
    </template>
    <div class="p-6">
      <div v-for="n in 10" :key="n">
        Content content content content content content content content content
      </div>
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
