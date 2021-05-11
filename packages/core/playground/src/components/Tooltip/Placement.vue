<template>
  <div>
    <Tooltip top>
      <template v-slot:activator>
        <Btn class="mr-4 mb-6">
          Top
        </Btn>
      </template>
      Top tooltip!
    </Tooltip>
    <Tooltip right>
      <template v-slot:activator>
        <Btn class="mr-4 mb-6">
          Right
        </Btn>
      </template>
      Right tooltip!
    </Tooltip>
    <Tooltip bottom>
      <template v-slot:activator>
        <Btn class="mr-4 mb-6">
          Bottom
        </Btn>
      </template>
      Bottom tooltip!
    </Tooltip>
    <Tooltip left>
      <template v-slot:activator>
        <Btn class="mr-4 mb-6">
          Left
        </Btn>
      </template>
      Left tooltip!
    </Tooltip>
  </div>
  <div class="space-x-4 -mb-6">
    <Tooltip placement="top-start" max-width="250" skidding="-16" origin="24px 100%">
      <template v-slot:activator>
        <Icon class="mb-6">
          {{ ziQuestionSign }}
        </Icon>
      </template>
      Top-start tooltip!
    </Tooltip>
    <Tooltip placement="right-start" max-width="250" skidding="-16" origin="0 24px">
      <template v-slot:activator>
        <Icon class="mb-6">
          {{ ziQuestionSign }}
        </Icon>
      </template>
      Right-start tooltip!
    </Tooltip>
    <Tooltip placement="bottom-start" max-width="250" skidding="-16" origin="24px 0">
      <template v-slot:activator>
        <Icon class="mb-6">
          {{ ziQuestionSign }}
        </Icon>
      </template>
      Bottom-start tooltip!
    </Tooltip>
    <Tooltip placement="left-start" max-width="120" skidding="-16" origin="100% 24px">
      <template v-slot:activator>
        <Icon class="mb-6">
          {{ ziQuestionSign }}
        </Icon>
      </template>
      Left-start tooltip!
    </Tooltip>
  </div>
</template>

<script setup>
import { ziQuestionSign } from '@zennnn/icons'
</script>
