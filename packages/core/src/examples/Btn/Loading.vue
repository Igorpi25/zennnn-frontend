<template>
  <div class="space-x-4">
    <Btn loading>
      <Icon class="mr-2">
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn loading>Text</Btn>
    <Btn loading>
      <Icon class="mr-2">
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ziVisible } from '@zennnn/icons'
</script>
