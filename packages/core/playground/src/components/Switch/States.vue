<template>
  <div class="grid grid-flow-col">
    <Switch :model-value="true" label="on">
    </Switch>
    <Switch :model-value="false" label="off">
    </Switch>
  </div>
  <div class="grid grid-flow-col">
    <Switch :model-value="true" label="on disabled" disabled>
    </Switch>
    <Switch :model-value="false" label="off disabled" disabled>
    </Switch>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
</script>
