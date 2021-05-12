<template>
  <div class="bg-gray-400 relative">
    <div class="absolute top-0 right-0 mt-2 mr-2">
      <Icon
        class="text-gray-200 hover:text-gray-100 cursor-pointer"
        @click="$emit('cancel')"
      >
        {{ icons.ziCloseWindow }}
      </Icon>
    </div>
    <div class="text-center text-base sm:text-left p-8">
      <div class="py-10">
        <p>
          {{ text }}
        </p>
        <p v-if="postScriptum" class="pt-4">
          {{ postScriptum }}
        </p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center">
        <Btn
          outlined
          class="border-gray-200 sm:flex-1 mb-3 sm:mb-0 sm:mr-2 whitespace-nowrap"
          @click="$emit('dontSave')"
        >
          <span>{{ dontSaveButton || $t('action.dontSave') }}</span>
        </Btn>

        <Btn
          outlined
          class="border-gray-200 sm:flex-1 mb-3 sm:mb-0 sm:mx-2 whitespace-nowrap"
          @click="$emit('cancel')"
        >
          <span>{{ cancelButton || $t('action.cancel') }}</span>
        </Btn>

        <Btn
          class="sm:flex-1 mb-3 sm:mb-0 sm:ml-2 whitespace-nowrap"
          @click="$emit('save')"
        >
          <span>{{ saveButton || $t('action.save') }}</span>
        </Btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

export default {
  name: 'SaveBeforeCloseModal',
  components: {
    Btn,
    Icon,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    postScriptum: {
      type: String,
      default: '',
    },
    dontSaveButton: {
      type: String,
      default: '',
    },
    cancelButton: {
      type: String,
      default: '',
    },
    saveButton: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      icons: {
        ziCloseWindow,
      },
    }
  },
}
</script>
