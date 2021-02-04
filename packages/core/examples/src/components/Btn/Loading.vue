<template>
  <div>
    <Btn :loading="loading" @click="toggleLoading" class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn :loading="loading" @click="toggleLoading" class="mr-4 mb-6">
      Text
    </Btn>
    <Btn :loading="loading" @click="toggleLoading" icon class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="-mb-6">
    <Btn :loading="loading" small @click="toggleLoading" class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn :loading="loading" small @click="toggleLoading" class="mr-4 mb-6">
      Text
    </Btn>
    <Btn :loading="loading" small @click="toggleLoading" icon class="mb-6">
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
