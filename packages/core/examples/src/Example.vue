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
  </div>
  <div
    ref="previewRef"
    :class="[
      'xs:rounded-md -mx-6 xs:mx-0 my-4 p-6',
      dark ? 'dark bg-gray-500 text-gray-100' : 'bg-light-gray-100',
    ]"
  >
    <component :is="Preview" />
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from 'vue'
import { ziMoon, ziSun } from '@zennnn/icons'
import { useExampleTheme } from '../../docs/.vitepress/theme/composables/exampleTheme'

export default {
  props: {
    file: {
      type: String,
      required: true,
    },
  },
  setup (props) {
    const previewRef = ref()

    const { dark } = useExampleTheme(previewRef, props.file)

    const Preview = defineAsyncComponent(
      async () => {
        const path = `./components/${props.file}.vue`
        const modules = import.meta.glob('./components/**/*.vue')
        const m = await modules[path]()
        return m
      }
    )

    return {
      ziMoon,
      ziSun,
      dark,
      previewRef,
      Preview,
    }
  },
}
</script>
