<template>
  <div class="bg-gray-400 relative">
    <div class="absolute top-0 right-0 mt-2 mr-2">
      <i
        class="zi-close text-2xl text-gray-200 hover:text-gray-100 cursor-pointer"
        @click="$emit('cancel')"
      />
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
        <Button
          outlined
          class="sm:flex-1 mb-3 sm:mb-0 sm:mr-2"
          merge-class="border-gray-200"
          @click="$emit('dontSave')"
        >
          <span>{{ dontSaveButton || $t('action.dontSave') }}</span>
        </Button>

        <Button
          outlined
          class="sm:flex-1 mb-3 sm:mb-0 sm:mx-2"
          merge-class="border-gray-200"
          @click="$emit('cancel')"
        >
          <span>{{ cancelButton || $t('action.cancel') }}</span>
        </Button>

        <Button
          class="sm:flex-1 mb-3 sm:mb-0 sm:ml-2"
          @click="$emit('save')"
        >
          <span>{{ saveButton || $t('action.save') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { ziAlert } from '@/assets/icons'

export default {
  name: 'SaveBeforeCloseModal',
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
        ziAlert,
      },
    }
  },
}
</script>
