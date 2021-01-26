<template>
  <div class="space-x-4 mb-6">
    <Btn :loading="loading" @click="toggleLoading">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn :loading="loading" @click="toggleLoading">Text</Btn>
    <Btn :loading="loading" @click="toggleLoading" icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4">
    <Btn :loading="loading" small @click="toggleLoading">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn :loading="loading" small @click="toggleLoading">Text</Btn>
    <Btn :loading="loading" small @click="toggleLoading" icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziVisible } from '@zennnn/icons'

const loading = ref(false)

function toggleLoading () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
