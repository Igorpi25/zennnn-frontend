<template>
  <div class="mb-12">
    <Btn @click="toggle = !toggle">
      Toggle
    </Btn>
  </div>
  <Tooltip v-model="toggle" :open-on-hover="false">
    <template v-slot:activator>
      <Icon>
        {{ ziQuestionSign }}
      </Icon>
    </template>
    This is tooltip!
  </Tooltip>
</template>

<script setup>
import { ref } from 'vue'
import { ziQuestionSign } from '@zennnn/icons'

const toggle = ref(false)
</script>
