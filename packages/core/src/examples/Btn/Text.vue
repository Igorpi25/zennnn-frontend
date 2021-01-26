<template>
  <div class="space-x-4 mb-6">
    <Btn text small>
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
    <Btn text small disabled>
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
    <Btn text small :loading="loading" @click="toggleLoading">
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
  </div>
  <div class="space-x-4">
    <Btn text mini>
      <Icon left>
        {{ ziReply }}
      </Icon>
      Reply
    </Btn>
    <Btn text mini disabled>
      <Icon left>
        {{ ziReply }}
      </Icon>
      Reply
    </Btn>
    <Btn text mini :loading="loading" @click="toggleLoading">
      <Icon left>
        {{ ziReply }}
      </Icon>
      Reply
    </Btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziEdit, ziReply } from '@zennnn/icons'

const loading = ref(false)

function toggleLoading () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
