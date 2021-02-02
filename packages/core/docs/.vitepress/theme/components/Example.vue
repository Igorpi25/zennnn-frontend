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
    // const m = await import(/* @vite-ignore */ `../../examples/${props.file}.vue`)
    const path = `../../examples/${props.file}.vue`
    const modules = await getComponentsModules()
    const m = modules[path]
    isPreviewLoaded.value = true
    return m
  },
})

const Code = defineAsyncComponent({
  loader: async () => {
    const path = `../../examples_code/${props.file}.md`
    const modules = await getCodesModules()
    const m = await modules[path]()
    isCodeLoaded.value = true
    return m
  },
})

const getComponentsModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Alert': return import.meta.globEager('../../examples/Alert/*.vue')
    case 'Btn': return import.meta.globEager('../../examples/Btn/*.vue')
    case 'BtnToggle': return import.meta.globEager('../../examples/BtnToggle/*.vue')
    case 'Icon': return import.meta.globEager('../../examples/Icon/*.vue')
    case 'Progress': return import.meta.globEager('../../examples/Progress/*.vue')
    case 'LoadingSpinner': return import.meta.globEager('../../examples/LoadingSpinner/*.vue')
  }
}

const getCodesModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Alert': return import.meta.glob('../../examples_code/Alert/*.md')
    case 'Btn': return import.meta.glob('../../examples_code/Btn/*.md')
    case 'BtnToggle': return import.meta.glob('../../examples_code/BtnToggle/*.md')
    case 'Icon': return import.meta.glob('../../examples_code/Icon/*.md')
    case 'Progress': return import.meta.glob('../../examples_code/Progress/*.md')
    case 'LoadingSpinner': return import.meta.glob('../../examples_code/LoadingSpinner/*.md')
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
