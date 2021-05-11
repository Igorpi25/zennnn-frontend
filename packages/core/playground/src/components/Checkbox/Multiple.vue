<template>
  <div class="mb-6">
    {{ model }}
  </div>
  <Checkbox
    v-for="item in items"
    v-model="model"
    :key="item"
    :value="item"
    class="mb-6"
  >
    <span class="ml-2">{{ item }}</span>
  </Checkbox>
  <Checkbox
    v-model:indeterminate="indeterminate"
    v-model="modelAll"
    @change="updateModelAll"
  >
    <span class="ml-2">All</span>
  </Checkbox>
</template>

<script setup>
import { ref, watch } from 'vue'
import { deepEqual } from 'vue-supp'

const model = ref([])
const modelAll = ref(false)
const indeterminate = ref(false)
const items = ['item-1', 'item-2', 'item-3', 'item-4']

watch(model, (val, oldVal) => {
  if (deepEqual(val, oldVal)) return
  indeterminate.value = val.length > 0 && val.length < items.length
  modelAll.value = val.length === items.length
})

function updateModelAll (val) {
  indeterminate.value = false
  if (val) {
    model.value = items.slice()
    modelAll.value = true
  } else {
    model.value = []
    modelAll.value = false
  }
}
</script>
