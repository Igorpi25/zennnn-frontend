<template>
  <div class="space-x-4 mb-6">
    <Btn disabled>
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled>Text</Btn>
    <Btn disabled icon>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="space-x-4">
    <Btn disabled small>
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled small>Text</Btn>
    <Btn disabled icon small>
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ziVisible } from '@zennnn/icons'
</script>
