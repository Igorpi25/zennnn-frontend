<template>
  <div>
    <Btn outlined class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn outlined class="mr-4 mb-6">
      Text
    </Btn>
    <Btn outlined icon class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div>
    <Btn outlined small class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn outlined small class="mr-4 mb-6">
      Text
    </Btn>
    <Btn outlined small icon class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div>
    <Btn disabled outlined small class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled outlined small class="mr-4 mb-6">
      Text
    </Btn>
    <Btn disabled outlined small icon class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div>
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
