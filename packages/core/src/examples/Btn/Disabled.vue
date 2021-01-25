<template>
  <div class="space-x-4">
    <Btn disabled>
      <Icon class="mr-2">
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled>Text</Btn>
    <Btn disabled>
      <Icon class="mr-2">
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ziVisible } from '@zennnn/icons'
</script>
