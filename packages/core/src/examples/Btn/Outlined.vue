<template>
  <div class="space-x-4 mb-6">
    <Btn outlined>
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn outlined>Text</Btn>
    <Btn outlined icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4 mb-6">
    <Btn outlined small>
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn outlined small>Text</Btn>
    <Btn outlined small icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4 mb-6">
    <Btn disabled outlined small>
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled outlined small>Text</Btn>
    <Btn disabled outlined small icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4">
    <Btn :loading="loading" outlined block @click="toggleLoading">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
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
