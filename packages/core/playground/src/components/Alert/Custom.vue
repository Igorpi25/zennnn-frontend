<template>
  <div class="space-y-6">
    <Alert :icon="false"> Primary Alert without icon </Alert>
    <Alert color="info">
      <template v-slot:icon>
        <Icon class="text-blue-500 mr-3">
          {{ ziCheckFill }}
        </Icon>
      </template>
      Info Alert custom icon
    </Alert>
    <div v-if="!model" class="text-center">
      <Btn @click="model = true"> Reset </Btn>
    </div>
    <Alert
      v-model="model"
      close
      transition="fade-transition"
      container-class="items-center text-white bg-green-500 bg-opacity-75 p-6"
      content-class="text-black text-2xl"
      icon-class="text-red-500"
    >
      Custom alert
      <template v-slot:close>
        <Btn
          x-small
          :primary="false"
          class="text-white bg-gray-600 hover:bg-gray-400 active:bg-gray-400"
        >
          Close
        </Btn>
      </template>
    </Alert>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziCheckFill } from '@zennnn/icons'

const model = ref(true)
</script>
