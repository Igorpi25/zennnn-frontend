<template>
  <div class="flex">
    <div class="relative mr-4">
      <Btn min-width="none" @click="visible1 = !visible1">
        fade-transition
      </Btn>
      <transition name="fade-transition">
        <div
          v-show="visible1"
          class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
          @click="visible1 = false"
        >
        </div>
      </transition>
    </div>
    <div class="relative">
      <Btn min-width="none" @click="visible2 = !visible2">
        leave-active-class
      </Btn>
      <transition name="fade-transition" leave-active-class="hidden">
        <div
          v-show="visible2"
          class="z-1 absolute top-0 w-32 h-32 bg-red-500 p-8"
          @click="visible2 = false"
        >
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
</script>
