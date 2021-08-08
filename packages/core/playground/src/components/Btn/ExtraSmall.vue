<template>
  <div>
    <Btn x-small outlined class="mr-4 mb-6">
      Date
      <Icon right class="text-gray-100 dark:text-gray-200">
        {{ ziCalendar }}
      </Icon>
    </Btn>
    <Btn x-small disabled outlined class="mr-4 mb-6">
      Date
      <Icon right class="text-gray-100 dark:text-gray-200">
        {{ ziCalendar }}
      </Icon>
    </Btn>
    <Btn
      x-small
      :loading="loading"
      outlined
      @click="toggleLoading"
      class="mb-6"
    >
      Date
      <Icon right class="text-gray-100 dark:text-gray-200">
        {{ ziCalendar }}
      </Icon>
    </Btn>
  </div>
  <div>
    <Btn x-small outlined class="mr-4 mb-6">
      <Icon left class="text-gray-100 dark:text-gray-200">
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
    <Btn x-small disabled outlined class="mr-4 mb-6">
      <Icon left class="text-gray-100 dark:text-gray-200">
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
    <Btn
      x-small
      :loading="loading"
      outlined
      @click="toggleLoading"
      class="mb-6"
    >
      <Icon left class="text-gray-100 dark:text-gray-200">
        {{ ziPlay }}
      </Icon>
      Start
    </Btn>
  </div>
  <div class="-mb-6">
    <Btn x-small icon outlined class="mr-4 mb-6">
      <Icon>
        {{ ziDimentions }}
      </Icon>
    </Btn>
    <Btn x-small icon disabled outlined class="mr-4 mb-6">
      <Icon>
        {{ ziDimentions }}
      </Icon>
    </Btn>
    <Btn
      x-small
      icon
      :loading="loading"
      outlined
      @click="toggleLoading"
      class="mb-6"
    >
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

function toggleLoading() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}
</script>
