<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="align-top border-b border-light-gray-200 capitalize text-left text-xs text-gray-200 font-semibold p-2"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.name"
          class="hover:bg-light-gray-100"
        >
          <td
            v-for="header in headers"
            :key="header"
            v-html="item[header]"
            class="align-top border-b border-light-gray-200 text-sm p-2"
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

const HEADERS = {
  props: ['name', 'type', 'default', 'description'],
  slots: ['name', 'description'],
  emits: ['name', 'description'],
}

const api = ref({})

const headers = computed(() => {
  return HEADERS[props.field]
})

const items = computed(() => {
  return api.value[props.field]
})

onBeforeMount(async () => {
  api.value = (await getApi(props.name)).default
})

function getApi (name) {
  switch (name) {
    case 'alert': return import('../../data/alert.json')
    case 'btn': return import('../../data/btn.json')
    case 'btn-toggle': return import('../../data/btn-toggle.json')
    case 'icon': return import('../../data/icon.json')
    case 'progress': return import('../../data/progress.json')
    case 'loading-spinner': return import('../../data/loading-spinner.json')
  }
}
</script>
