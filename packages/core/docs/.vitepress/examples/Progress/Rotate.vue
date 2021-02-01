<template>
  <div class="-mb-6">
    <Progress
      :rotate="360"
      :size="100"
      :width="15"
      :value="progress"
      class="text-blue-500 mr-6 mb-6"
    >
      {{ progress }}
    </Progress>
    <Progress
      :rotate="-90"
      :size="100"
      :width="15"
      :value="progress"
      class="text-green-500 mr-6 mb-6"
    >
      {{ progress }}
    </Progress>
    <Progress
      :rotate="90"
      :size="100"
      :width="15"
      :value="progress"
      class="text-purple-500 mr-6 mb-6"
    >
      {{ progress }}
    </Progress>
    <Progress
      :rotate="180"
      :size="100"
      :width="15"
      :value="progress"
      class="text-red-500 mb-6"
    >
      {{ progress }}
    </Progress>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

let interval = null
const progress = ref(0)

onMounted(() => {
  interval = setInterval(() => {
    if (progress.value === 100) {
      return (progress.value = 0)
    }
    progress.value += 10
  }, 1000)
})

</script>
