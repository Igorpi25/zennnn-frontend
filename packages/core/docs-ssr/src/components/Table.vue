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
            v-html="item[header]"
            :key="header"
            :width="header === 'name' ? '180' : header === 'type' ? '120' : undefined"
            :class="{
              'font-medium': header === 'name',
              'font-mono': header === 'name' || header === 'type' || header === 'default',
            }"
            class="align-top border-b border-light-gray-200 text-sm p-2"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onBeforeMount, ref, computed } from 'vue'

interface Header {
  props?: any
  slots?: any
  emits: any
}

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
  return HEADERS[props.field as keyof Header]
})

const items = computed(() => {
  return (api.value as Header)[props.field as keyof Header]
})

onBeforeMount(async () => {
  api.value = (await getApi(props.name)).default
})

function getApi (name: string) {
  return import(`../../data/${name}.json`)
}
</script>
