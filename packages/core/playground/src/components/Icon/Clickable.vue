<template>
  <Icon
    class="mr-6"
    @click="onClick"
  >
    {{ ziEdit }}
  </Icon>
  <Icon
    tag="button"
    role="button"
    large
    class="text-blue-500 hover:text-blue-600 focus:text-blue-600"
    @click="onClick"
  >
    {{ ziEdit }}
  </Icon>
</template>

<script setup>
import { ziEdit } from '@zennnn/icons'

function onClick () {
  console.log('Clicked!')
}
</script>
