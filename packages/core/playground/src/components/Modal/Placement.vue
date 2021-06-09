<template>
  <Modal
    v-model="model1"
    fullscreen
    width="256px"
    class="text-right"
    content-class="w-[256px]"
    :transition="{
      appear: true,
      enterActiveClass: 'transition ease-out duration-300',
      enterFromClass: 'transform translate-x-full',
      enterToClass: 'transform translate-x-0',
      leaveActiveClass: 'transition ease-in duration-300',
      leaveFromClass: 'transform translate-x-0',
      leaveToClass: 'transform translate-x-full',
    }"
  >
    <template v-slot:activator>
      <Btn> Right Dialog </Btn>
    </template>
    <div class="p-6">
      <div v-for="n in 10" :key="n">
        Content content content content content content content content content
      </div>
      <Btn outlined class="mt-4 mx-4" @click="model1 = false"> Cancel </Btn>
      <Btn class="mt-4 mx-4" @click="model1 = false"> Ok </Btn>
    </div>
  </Modal>
  <Modal
    v-model="model2"
    class="flex items-end min-h-full h-full"
    content-class="max-h-[256px] w-full h-full rounded-none overflow-auto m-0"
    top="auto"
    :hide-overflow="true"
    :transition="{
      appear: true,
      enterActiveClass: 'transition ease-out duration-300',
      enterFromClass: 'transform translate-y-full',
      enterToClass: 'transform translate-y-0',
      leaveActiveClass: 'transition ease-in duration-300',
      leaveFromClass: 'transform translate-y-0',
      leaveToClass: 'transform translate-y-full',
    }"
  >
    <template v-slot:activator>
      <Btn class="block my-6"> Bottom Dialog </Btn>
    </template>
    <div class="p-6">
      <div v-for="n in 10" :key="n">
        Content content content content content content content content content
      </div>
      <Btn outlined class="mt-4 mx-4" @click="model2 = false"> Cancel </Btn>
      <Btn class="mt-4 mx-4" @click="model2 = false"> Ok </Btn>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'

const model1 = ref(false)
const model2 = ref(false)
</script>
