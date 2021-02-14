<template>
  <div class="grid grid-flow-col">
    <Checkbox :model-value="true" label="on">
    </Checkbox>
    <Checkbox :model-value="false" label="off">
    </Checkbox>
    <Checkbox indeterminate label="indeterminate">
    </Checkbox>
  </div>
  <div class="grid grid-flow-col">
    <Checkbox :model-value="true" label="on disabled" disabled>
    </Checkbox>
    <Checkbox :model-value="false" label="off disabled" disabled>
    </Checkbox>
    <Checkbox indeterminate label="indeterminate disabled" disabled>
    </Checkbox>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const model = ref(false)
</script>
