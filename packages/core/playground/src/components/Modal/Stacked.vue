<template>
  <Modal v-model="model">
    <template v-slot:activator>
      <Btn> Dialog </Btn>
    </template>
    <div class="p-6">
      <div v-for="n in 10" :key="n">
        Content content content content content content content content content
      </div>
      <Btn outlined class="mt-4 mx-4" @click="model = false"> Cancel </Btn>
      <Modal v-model="model2" width="180">
        <template v-slot:activator>
          <Btn class="mt-4"> Open Dialog 2 </Btn>
        </template>
        <div class="p-6">
          <div class="p-4">
            <Select
              ref="searchRef"
              v-model="searchModel"
              :items="items"
              :max-height="304"
              label="Label"
              label-hint="Label hint"
              clearable
              placeholder="Search..."
            >
            </Select>
          </div>
          <div v-for="n in 10" :key="n">
            Content content content content content content content content
            content
          </div>
          <Btn outlined class="mt-4 mx-4" @click="model2 = false"> Cancel </Btn>
          <Btn class="mt-4 mx-4" @click="model2 = false"> Ok </Btn>
        </div>
      </Modal>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
const model2 = ref(false)
const searchModel = ref(null)
const items = Array.from(Array(10).keys()).map((key) => {
  const i = key + 1
  return {
    value: `item${i}`,
    text: `Item ${i}`,
    disabled: i === 3,
  }
})
</script>
