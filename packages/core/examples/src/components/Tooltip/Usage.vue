<template>
  <div class="space-x-4">
    <Tooltip>
      <template v-slot:activator>
        <Btn>
          Button
        </Btn>
      </template>
      This is tooltip!
    </Tooltip>
    <Tooltip>
      <template v-slot:activator>
        <Icon>
          {{ ziQuestionSign }}
        </Icon>
      </template>
      This is tooltip!
    </Tooltip>
    <Tooltip>
      <template v-slot:activator>
        <span>Text</span>
      </template>
      This is tooltip!
    </Tooltip>
  </div>
</template>

<script setup>
import { ziQuestionSign } from '@zennnn/icons'
</script>
