<template>
  <div class="mb-6">
    <Progress
      indeterminate
      class="mr-6"
    />
    <Progress
      indeterminate
      class="text-red-500 mr-6"
    />
    <Progress
      indeterminate
      class="text-yellow-500 mr-6"
    />
    <Progress
      indeterminate
      class="text-green-500"
    />
  </div>
  <div class="text-blue-500">
    <Progress
      :indeterminate="indeterminate"
      class="mr-6"
    />
    <Btn x-small outlined retain-focus-on-click @click="indeterminate = !indeterminate">
      Toggle
    </Btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const indeterminate = ref(false)
</script>
