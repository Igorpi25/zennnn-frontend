<template>
  <div class="simple-table">
    <table>
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="capitalize text-left text-sm font-semibold p-2"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.name"
        >
          <td
            v-for="header in headers"
            :key="header"
            v-html="item[header]"
            class="text-sm p-2"
            :class="{
              'font-medium': header === 'name',
              'font-mono': header === 'name' || header === 'type' || header === 'default',
            }"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, onBeforeMount, ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
})

const getApi = name => {
  switch (name) {
    case 'btn': return import('../../../../src/api/data/btn.js')
    case 'icon': return import('../../../../src/api/data/icon.js')
  }
}

const HEADERS = {
  props: ['name', 'type', 'default', 'description'],
  slots: ['name', 'description'],
  emits: ['name', 'description'],
}

const api = ref({})

onBeforeMount(async () => {
  api.value = (await getApi(props.name)).default
})

const headers = computed(() => {
  return HEADERS[props.field]
})

const items = computed(() => {
  return api.value[props.field]
})
</script>
