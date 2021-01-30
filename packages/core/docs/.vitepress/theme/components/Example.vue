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
      class="xs:rounded-md -mx-6 xs:mx-0 my-4 p-6"
    >
      <component :is="Preview" />
    </div>
    <div v-else-if="activeTab === 'code'">
      <component :is="Code" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, shallowRef, defineAsyncComponent } from 'vue'
import { ziSun, ziMoon } from '@zennnn/icons'

const props = defineProps({
  file: {
    type: String,
    required: true,
  },
})

const Preview = defineAsyncComponent(async () => {
  // TypeError: Failed to fetch dynamically imported module
  // const m = await import(/* @vite-ignore */ `../../../../src/examples/${props.file}.vue`)
  const path = `../../../../src/examples/${props.file}.vue`
  const modules = await getComponentsModules()
  const m = await modules[path]()
  return m
})

const Code = defineAsyncComponent(async () => {
  const path = `../../../../src/examples_code/${props.file}.md`
  const modules = await getCodesModules()
  const m = await modules[path]()
  return m
})

const getComponentsModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Btn': return import.meta.glob('../../../../src/examples/Btn/*.vue')
    case 'Icon': return import.meta.glob('../../../../src/examples/Icon/*.vue')
  }
}

const getCodesModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Btn': return import.meta.glob('../../../../src/examples_code/Btn/*.md')
    case 'Icon': return import.meta.glob('../../../../src/examples_code/Icon/*.md')
  }
}

const dark = ref(false)
const activeTab = ref('preview')
const items = [{ name: 'preview', text: 'Preview' }, { name: 'code', text: 'Code' }]
</script>
