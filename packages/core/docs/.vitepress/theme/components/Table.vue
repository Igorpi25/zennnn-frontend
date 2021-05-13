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
  switch (name) {
    case 'alert': return import('../../data/alert.json')
    case 'autocomplete': return import('../../data/autocomplete.json')
    case 'btn': return import('../../data/btn.json')
    case 'btn-toggle': return import('../../data/btn-toggle.json')
    case 'checkbox': return import('../../data/checkbox.json')
    case 'data-table': return import('../../data/data-table.json')
    case 'date-picker': return import('../../data/date-picker.json')
    case 'expand-transition': return import('../../data/expand-transition.json')
    case 'form': return import('../../data/form.json')
    case 'icon': return import('../../data/icon.json')
    case 'image': return import('../../data/image.json')
    case 'label': return import('../../data/label.json')
    case 'loading-spinner': return import('../../data/loading-spinner.json')
    case 'menu': return import('../../data/menu.json')
    case 'menu-item': return import('../../data/menu-item.json')
    case 'messages': return import('../../data/messages.json')
    case 'modal': return import('../../data/modal.json')
    case 'progress': return import('../../data/progress.json')
    case 'radio': return import('../../data/radio.json')
    case 'select': return import('../../data/select.json')
    case 'switch': return import('../../data/switch.json')
    case 'text-field': return import('../../data/text-field.json')
    case 'text-area': return import('../../data/text-area.json')
    case 'tooltip': return import('../../data/tooltip.json')
    case 'window': return import('../../data/window.json')
    case 'window-item': return import('../../data/window-item.json')
  }
}
</script>
