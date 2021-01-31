<template>
  <div>
    <Btn icon outlined dark-icon class="mr-4 mb-6">
      <Icon>
        {{ ziAddCart }}
      </Icon>
    </Btn>
    <Btn icon outlined dark-icon disabled class="mr-4 mb-6">
      <Icon>
        {{ ziAddCart }}
      </Icon>
    </Btn>
    <Btn icon outlined dark-icon :loading="loading" @click="toggleLoading" class="mb-6">
      <Icon>
        {{ ziAddCart }}
      </Icon>
    </Btn>
  </div>
  <div>
    <Btn :class="custom1" class="mr-4 mb-6">
      Start using
    </Btn>
    <Btn disabled :class="custom1" class="mr-4 mb-6">
      Start using
    </Btn>
    <Btn :class="custom1" :loading="loading" @click="toggleLoading" class="mb-6">
      Start using
    </Btn>
  </div>
  <div>
    <Btn :primary="false" :class="custom2" class="mr-4 mb-6">
      Delete
    </Btn>
    <Btn :primary="false" disabled class="mr-4 mb-6 disabled:bg-gray-100 disabled:text-gray-700">
      Delete
    </Btn>
    <Btn :primary="false" :class="custom2" :loading="loading" @click="toggleLoading" class="mr-4 mb-6">
      Delete
    </Btn>
  </div>
  <div>
    <Btn x-small :primary="false" class="text-white bg-gray-600 hover:bg-gray-400 focus:bg-gray-400 mb-6">
      <Icon class="mr-2">
        {{ ziAddCart }}
      </Icon>
      Add to Cart
      <div class="text-sm text-white flex items-center justify-center w-lg h-lg rounded-full bg-purple-500 ml-2">
        1
      </div>
    </Btn>
  </div>
  <div>
    <Btn block outlined class="mb-6">
      <Icon left>
        {{ ziQr }}
      </Icon>
      Create New Product
    </Btn>
    <Btn block outlined disabled class="mb-6">
      <Icon left>
        {{ ziQr }}
      </Icon>
      Create New Product
    </Btn>
    <Btn block outlined :loading="loading" @click="toggleLoading">
      <Icon left>
        {{ ziQr }}
      </Icon>
      Create New Product
    </Btn>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ziAddCart, ziPlusOutline, ziQr } from '@zennnn/icons'

const loading = ref(false)

const custom1 = 'bg-blue-600'
const custom2 = computed(() => {
  return [
    'text-white bg-red-700',
    { 'disabled:bg-gray-100 disabled:text-gray-700 hover:bg-red-600 focus:bg-red-600' : !loading.value },
  ]
})

function toggleLoading () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
