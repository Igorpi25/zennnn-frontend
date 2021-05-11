<template>
  <Btn block class="mb-6">
    <Icon left>
      {{ ziVisible }}
    </Icon>
    Text icon
  </Btn>
  <Btn block disabled class="mb-6">
    Disabled
  </Btn>
  <Btn block :loading="loading" @click="toggleLoading">
    Loading
  </Btn>
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
