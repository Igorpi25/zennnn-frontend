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
      :class="[
        'xs:rounded-md -mx-6 xs:mx-0 p-6',
        dark ? 'bg-gray-500 text-gray-100' : 'bg-light-gray-100',
      ]"
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
import { useExampleTheme } from '../composables/exampleTheme'

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

const items = [{ value: TAB.PREVIEW, text: 'Preview' }, { value: TAB.CODE, text: 'Code' }]
const previewRef = ref(null)
const initialHeight = ref(80)
const isPreviewLoaded = ref(false)
const isCodeLoaded = ref(false)
const activeTab = ref(TAB.PREVIEW)

const { dark } = useExampleTheme(previewRef, props.file)

const Preview = defineAsyncComponent({
  loader: async () => {
    // TypeError: Failed to fetch dynamically imported module
    // const m = await import(/* @vite-ignore */ `../../../../examples/src/components/${props.file}.vue`)
    const path = `../../../../examples/src/components/${props.file}.vue`
    const modules = await getComponentsModules()
    const m = modules[path]
    isPreviewLoaded.value = true
    return m
  },
})

const Code = defineAsyncComponent({
  loader: async () => {
    const path = `../../../../examples/generated/code/${props.file}.md`
    const modules = await getCodesModules()
    const m = await modules[path]()
    isCodeLoaded.value = true
    return m
  },
})

const getComponentsModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Alert': return import.meta.globEager('../../../../examples/src/components/Alert/*.vue')
    case 'Btn': return import.meta.globEager('../../../../examples/src/components/Btn/*.vue')
    case 'BtnToggle': return import.meta.globEager('../../../../examples/src/components/BtnToggle/*.vue')
    case 'Checkbox': return import.meta.globEager('../../../../examples/src/components/Checkbox/*.vue')
    case 'DataTable': return import.meta.globEager('../../../../examples/src/components/DataTable/*.vue')
    case 'DatePicker': return import.meta.globEager('../../../../examples/src/components/DatePicker/*.vue')
    case 'Icon': return import.meta.globEager('../../../../examples/src/components/Icon/*.vue')
    case 'Image': return import.meta.globEager('../../../../examples/src/components/Image/*.vue')
    case 'Label': return import.meta.globEager('../../../../examples/src/components/Label/*.vue')
    case 'LoadingSpinner': return import.meta.globEager('../../../../examples/src/components/LoadingSpinner/*.vue')
    case 'Menu': return import.meta.globEager('../../../../examples/src/components/Menu/*.vue')
    case 'Messages': return import.meta.globEager('../../../../examples/src/components/Messages/*.vue')
    case 'Modal': return import.meta.globEager('../../../../examples/src/components/Modal/*.vue')
    case 'Progress': return import.meta.globEager('../../../../examples/src/components/Progress/*.vue')
    case 'Radio': return import.meta.globEager('../../../../examples/src/components/Radio/*.vue')
    case 'Switch': return import.meta.globEager('../../../../examples/src/components/Switch/*.vue')
    case 'Styles': return import.meta.globEager('../../../../examples/src/components/Styles/*.vue')
    case 'TextField': return import.meta.globEager('../../../../examples/src/components/TextField/*.vue')
    case 'Tooltip': return import.meta.globEager('../../../../examples/src/components/Tooltip/*.vue')
    case 'Transition': return import.meta.globEager('../../../../examples/src/components/Transition/*.vue')
    case 'Window': return import.meta.globEager('../../../../examples/src/components/Window/*.vue')
  }
}

const getCodesModules = () => {
  const page = props.file.split('/')[0]
  switch (page) {
    case 'Alert': return import.meta.glob('../../../../examples/generated/code/Alert/*.md')
    case 'Btn': return import.meta.glob('../../../../examples/generated/code/Btn/*.md')
    case 'BtnToggle': return import.meta.glob('../../../../examples/generated/code/BtnToggle/*.md')
    case 'Checkbox': return import.meta.globEager('../../../../examples/generated/code/Checkbox/*.vue')
    case 'DataTable': return import.meta.glob('../../../../examples/generated/code/DataTable/*.md')
    case 'DatePicker': return import.meta.glob('../../../../examples/generated/code/DatePicker/*.md')
    case 'Icon': return import.meta.glob('../../../../examples/generated/code/Icon/*.md')
    case 'Image': return import.meta.glob('../../../../examples/generated/code/Image/*.md')
    case 'Label': return import.meta.glob('../../../../examples/generated/code/Label/*.md')
    case 'LoadingSpinner': return import.meta.glob('../../../../examples/generated/code/LoadingSpinner/*.md')
    case 'Menu': return import.meta.glob('../../../../examples/generated/code/Menu/*.md')
    case 'Messages': return import.meta.glob('../../../../examples/generated/code/Messages/*.md')
    case 'Modal': return import.meta.glob('../../../../examples/generated/code/Modal/*.md')
    case 'Progress': return import.meta.glob('../../../../examples/generated/code/Progress/*.md')
    case 'Radio': return import.meta.globEager('../../../../examples/generated/code/Radio/*.vue')
    case 'Switch': return import.meta.globEager('../../../../examples/generated/code/Switch/*.vue')
    case 'Styles': return import.meta.glob('../../../../examples/generated/code/Styles/*.md')
    case 'TextField': return import.meta.glob('../../../../examples/generated/code/TextField/*.md')
    case 'Tooltip': return import.meta.glob('../../../../examples/generated/code/Tooltip/*.md')
    case 'Transition': return import.meta.glob('../../../../examples/generated/code/Transition/*.md')
    case 'Window': return import.meta.glob('../../../../examples/generated/code/Window/*.md')
  }
}

function switchTab (tab) {
  activeTab.value = tab
  if (tab === TAB.CODE && !isCodeLoaded.value) {
    initialHeight.value = previewRef.value.clientHeight
  }
}
</script>
