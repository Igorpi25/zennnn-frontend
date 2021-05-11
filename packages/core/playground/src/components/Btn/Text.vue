<template>
  <div>
    <Btn text small class="mr-4 mb-6">
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
    <Btn text small disabled class="mr-4 mb-6">
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
    <Btn text small :loading="loading" @click="toggleLoading" class="mb-6">
      <Icon left>
        {{ ziEdit }}
      </Icon>
      Text
    </Btn>
  </div>
  <div class="-mb-6">
    <Btn text mini class="mr-4 mb-6">
      <Icon left>
        {{ ziReply }}
      </Icon>
      Reply
    </Btn>
    <Btn text mini disabled class="mr-4 mb-6">
      <Icon left>
        {{ ziReply }}
      </Icon>
      Reply
    </Btn>
    <Btn text mini :loading="loading" @click="toggleLoading" class="mb-6">
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
