<template>
  <div class="space-x-4 mb-6">
    <Btn x-small outlined dark-icon>
      Date
      <Icon right>
        {{ ziCalendar }}
      </Icon>
    </Btn>
    <Btn x-small disabled outlined dark-icon>
      Date
      <Icon right>
        {{ ziCalendar }}
      </Icon>
    </Btn>
    <Btn x-small :loading="loading" outlined dark-icon @click="toggleLoading">
      Date
      <Icon right>
        {{ ziCalendar }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4 mb-6">
    <Btn x-small outlined dark-icon>
      <Icon left>
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
    <Btn x-small disabled outlined dark-icon>
      <Icon left>
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
    <Btn x-small :loading="loading" outlined dark-icon @click="toggleLoading">
      <Icon left>
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
  </div>
  <div class="space-x-4">
    <Btn x-small icon outlined>
      <Icon>
        {{ ziDimentions }}
      </Icon>
    </Btn>
    <Btn x-small icon disabled outlined>
      <Icon>
        {{ ziDimentions }}
      </Icon>
    </Btn>
    <Btn x-small icon :loading="loading" outlined @click="toggleLoading">
      <Icon>
        {{ ziDimentions }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ziCalendar, ziPlay, ziDimentions } from '@zennnn/icons'

const loading = ref(false)

function toggleLoading () {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
