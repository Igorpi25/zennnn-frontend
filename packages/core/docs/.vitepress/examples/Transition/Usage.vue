<template>
  <div class="relative">
    <Btn @click="visible = !visible" class="mr-6">
      slide-x-transition
    </Btn>
    <transition name="slide-x-transition">
      <div
        v-show="visible"
        class="inline-block align-middle w-12 h-12 bg-red-500 "
      >
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
</script>
