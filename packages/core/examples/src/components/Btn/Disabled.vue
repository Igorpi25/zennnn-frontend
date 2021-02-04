<template>
  <div>
    <Btn disabled class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled class="mr-4 mb-6">
      Text
    </Btn>
    <Btn disabled icon class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
  <div class="-mb-6">
    <Btn disabled small class="mr-4 mb-6">
      <Icon left>
        {{ ziVisible }}
      </Icon>
      Text icon
    </Btn>
    <Btn disabled small class="mr-4 mb-6">
      Text
    </Btn>
    <Btn disabled icon small class="mb-6">
      <Icon>
        {{ ziVisible }}
      </Icon>
    </Btn>
  </div>
</template>

<script setup>
import { ziVisible } from '@zennnn/icons'
</script>
