<template>
  <div class="h-12 flex items-center justify-end space-x-4 border-b border-light-gray-400">
    <Btn
      :primary="false"
      icon
      x-small
      retain-focus-on-click
      class="text-gray-200 hover:text-blue-500 active:text-blue-500"
      @click="dark = !dark"
    >
      <Icon>
        {{ dark ? ziSun : ziMoon }}
      </Icon>
    </Btn>
    <Btn
      v-for="item in items"
      :key="item.name"
      :class="{
        'hover:text-blue-500 active:text-blue-500 rounded px-2': true,
        'text-blue-500 bg-blue-400 bg-opacity-20': activeTab === item.name,
      }"
      :primary="false"
      x-small
      retain-focus-on-click
      @click="activeTab = item.name"
    >
      {{ item.text }}
    </Btn>
  </div>
  <div :class="{ dark: dark }">
    <div
      v-if="activeTab === 'preview'"
      :class="[dark ? 'bg-gray-900 text-gray-100' : 'bg-light-gray-100']"
      class="rounded-md my-4 p-6"
    >
      <component :is="Preview" />
    </div>
    <div v-else-if="activeTab === 'code'">
      <component :is="Code" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, shallowRef } from 'vue'
import { ziSun, ziMoon } from '@zennnn/icons'

const modules = import.meta.globEager('../examples/**/*.*')

const props = defineProps({
  file: {
    type: String,
    required: true,
  },
})

let Preview = shallowRef(null)
let Code = shallowRef(null)

const previewRe = new RegExp(`${props.file}.vue`)
const codeRe = new RegExp(`${props.file}Code.md`)

for (const path in modules) {
  if (previewRe.test(path)) {
    Preview.value = modules[path].default
  }
  if (codeRe.test(path)) {
    Code.value = modules[path].default
  }
}

const dark = ref(false)
const activeTab = ref('preview')
const items = [{ name: 'preview', text: 'Preview' }, { name: 'code', text: 'Code' }]
</script>
