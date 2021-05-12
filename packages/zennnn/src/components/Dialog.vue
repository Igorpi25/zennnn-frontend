<template>
  <Modal
    v-model="internal"
    v-bind="computedProps"
  >
    <template v-slot:activator="{ attrs, listeners }">
      <slot name="activator" :attrs="attrs" :listeners="listeners" />
    </template>

    <div class="flex items-center bg-light-gray-300 dark:bg-gray-500 p-4">
      <div class="self-start">
        <slot name="icon">
          <Icon
            v-if="icon"
            large
            class="w-8 h-8"
          >
            {{ icon }}
          </Icon>
        </slot>
      </div>
      <div class="flex-grow text-lg font-semibold leading-tight px-2">
        <span>
          <slot name="title">
            {{ title }}
          </slot>
        </span>
      </div>
      <div class="self-start">
        <Icon
          :tabIndex="closeFocusable ? 0 : undefined"
          class="w-8 h-8 text-blue-500 hover:text-blue-400 focus:outline-none focus:ring"
          @click="internal = false"
        >
          {{ icons.ziCloseWindow }}
        </Icon>
      </div>
    </div>

    <slot />
  </Modal>
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { useDimensionProps } from 'vue-supp'

import { ziCloseWindow } from '@zennnn/icons'
import { Icon, Modal } from '@zennnn/core'

export default {
  name: 'Dialog',

  components: {
    Icon,
    Modal,
  },

  props: {
    ...useDimensionProps({ width: '100%', maxWidth: 448 }),
    modelValue: Boolean,
    title: String,
    icon: String,
    closeFocusable: Boolean,
  },

  emits: ['update:modelValue'],

  setup (props, { emit }) {
    const { modelValue } = toRefs(props)
    const internal = ref(modelValue.value)

    const computedProps = computed(() => {
      return {
        width: props.width,
        height: props.height,
        minWidth: props.minWidth,
        minHeight: props.minHeight,
        maxWidth: props.maxWidth,
        maxHeight: props.maxHeight,
      }
    })

    watch(modelValue, val => {
      internal.value = val
    })

    watch(internal, val => {
      emit('update:modelValue', val)
    })

    return {
      internal,
      computedProps,
      icons: {
        ziCloseWindow,
      },
    }
  },
}
</script>
