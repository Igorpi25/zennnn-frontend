<template>
  <Window
    v-model="model"
    :continuous="true"
    show-arrows
    class="bg-white dark:bg-gray-800"
  >
    <WindowItem
      v-for="n in length"
      :key="n"
      :value="n"
    >
      <div class="text-center text-2xl p-8">
        Item {{ n }}
      </div>
    </WindowItem>
  </Window>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(1)
const length = ref(3)
</script>
