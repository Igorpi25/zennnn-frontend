<template>
  <div class="relative pb-6">
    <Btn @click="visible1 = !visible1">
      slide-x-transition
    </Btn>
    <transition name="slide-x-transition">
      <div
        v-show="visible1"
        class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
        @click="visible1 = false"
      >
      </div>
    </transition>
  </div>
  <div class="relative pb-6">
    <Btn @click="visible2 = !visible2">
      slide-x-transition-reverse
    </Btn>
    <transition name="slide-x-reverse-transition">
      <div
        v-show="visible2"
        class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
        @click="visible2 = false"
      >
      </div>
    </transition>
  </div>
  <div class="relative pb-6">
    <Btn @click="visible3 = !visible3">
      slide-y-transition
    </Btn>
    <transition name="slide-y-transition">
      <div
        v-show="visible3"
        class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
        @click="visible3 = false"
      >
      </div>
    </transition>
  </div>
  <div class="relative">
    <Btn @click="visible4 = !visible4">
      slide-y-transition-reverse
    </Btn>
    <transition name="slide-y-reverse-transition">
      <div
        v-show="visible4"
        class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
        @click="visible4 = false"
      >
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const visible4 = ref(false)
</script>
