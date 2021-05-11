<template>
  <div class="space-x-6 text-blue-500">
    <Icon small>
      {{ ziEdit }}
    </Icon>
    <Icon large>
      {{ ziEdit }}
    </Icon>
    <Icon size="48">
      {{ ziEdit }}
    </Icon>
    <Icon :base="false" class="text-base">
      {{ ziEdit }}
    </Icon>
  </div>
</template>

<script setup>
import { ziEdit } from '@zennnn/icons'
</script>
