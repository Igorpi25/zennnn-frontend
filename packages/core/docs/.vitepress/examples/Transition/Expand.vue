<template>
  <div class="pb-6">
    <Btn @click="increaseVisible">
      expand-transition
    </Btn>
  </div>
  <div v-for="n in 5" :key="n">
    <ExpandTransition>
      <div v-show="n < visible" class="w-full h-40 bg-red-500 text-2xl text-white flex items-center justify-center">
        Content {{ n }}
      </div>
    </ExpandTransition>
    <div class="w-full h-10 bg-yellow-500"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(1)

function increaseVisible () {
  if (visible.value > 5) {
    visible.value = 1
    return
  }
  visible.value++
}
</script>
