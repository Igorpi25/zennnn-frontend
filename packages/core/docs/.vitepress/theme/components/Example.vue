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
      :key="item.value"
      :class="{
        'hover:text-blue-500 active:text-blue-500 rounded px-2': true,
        'text-blue-500 bg-blue-400 bg-opacity-20': activeTab === item.value,
      }"
      :primary="false"
      x-small
      retain-focus-on-click
      @click="switchTab(item.value)"
    >
      {{ item.text }}
    </Btn>
  </div>
  <div :class="{ 'my-4': true, dark: dark }">
    <div
      ref="previewRef"
      v-if="activeTab === TAB.PREVIEW"
      :class="[dark ? 'bg-gray-900 text-gray-100' : 'bg-light-gray-100']"
      class="xs:rounded-md -mx-6 xs:mx-0 p-6"
    >
      <component :is="Preview" />
    </div>
    <div
      v-else-if="activeTab === TAB.CODE"
      :style="{ height: !isCodeLoaded ? `${initialHeight}px` : undefined }"
    >
      <component :is="Code" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineAsyncComponent } from 'vue'
import { ziSun, ziMoon } from '@zennnn/icons'

const TAB = {
  PREVIEW: 1,
  CODE: 2,
}

const props = defineProps({
  file: {
    type: String,
    required: true,
  },
})

const previewRef = ref(null)
const initialHeight = ref(80)
const isPreviewLoaded = ref(false)
const isCodeLoaded = ref(false)

const Preview = defineAsyncComponent({
  loader: async () => {
    // TypeError: Failed to fetch dynamically imported module
    // const m = await import(/* @vite-ignore */ `../../../../src/examples/${props.file}.vue`)
    const path = `../../../../src/examples/${props.file}.vue`
    const modules = await getComponentsModules()
    const m = modules[path]
    isPreviewLoaded.value = true
    return m
  },
})

const Code = defineAsyncComponent({
  loader: async () => {
    const path = `../../../../src/examples_code/${props.file}.md`
    const modules = await getCodesModules()
    const m = await modules[path]()
    isCodeLoaded.value = true
    return m
  },
})

const getComponentsModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Btn': return import.meta.globEager('../../../../src/examples/Btn/*.vue')
    case 'Icon': return import.meta.globEager('../../../../src/examples/Icon/*.vue')
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
const activeTab = ref(TAB.PREVIEW)
const items = [{ value: TAB.PREVIEW, text: 'Preview' }, { value: TAB.CODE, text: 'Code' }]

function switchTab (tab) {
  activeTab.value = tab
  if (tab === TAB.CODE && !isCodeLoaded.value) {
    initialHeight.value = previewRef.value.clientHeight
  }
}
</script>
