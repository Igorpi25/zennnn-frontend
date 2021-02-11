<template>
  <Window
    v-model="model"
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
  <div class="text-center space-x-4 pt-4">
    <Btn x-small @click="prev">
      Prev
    </Btn>
    <Btn x-small @click="next">
      Next
    </Btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(1)
const length = ref(3)

function next () {
  model.value = model.value + 1 === length.value + 1
    ? 1
    : model.value + 1
}
function prev () {
  model.value = model.value - 1 < 1
    ? length.value
    : model.value - 1
}
</script>
