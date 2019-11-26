<template>
  <div class="modal">
    <div class="modal__title">
      <Icon size="21">
        {{ icons.ziPattern }}
      </Icon>
      <span class="ml-2">{{ $t('label.saveAsPattern') }}</span>
    </div>
    <div class="flex flex-col sm:flex-row items-center">
      <TextField
        ref="textfield"
        v-model="name"
        :placeholder="$t('action.createPatternName')"
        class="w-full sm:w-4/5 py-5"
        height="36"
        hide-details
        outlined
      />
      <Button
        large
        class="sm:ml-5"
        @click="save"
      >
        <span>{{ $t('action.save') }}</span>
      </Button>
    </div>
    <span class="close-btn" @click="$emit('close')">
      <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0.780869" y1="1.3753" x2="8.78087" y2="11.3753" stroke="#9F9F9F" stroke-width="2"/>
        <line x1="8.78087" y1="1.6247" x2="0.780869" y2="11.6247" stroke="#9F9F9F" stroke-width="2"/>
      </svg>
    </span>
  </div>
</template>

<script>
import { ziPattern } from '@/assets/icons'

export default {
  name: 'TemplateSaveModal',
  props: {
    visibility: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      name: '',
      defaultName: this.$t('label.defaultTemplateName'),
      icons: {
        ziPattern,
      },
    }
  },
  watch: {
    visibility (val) {
      if (!val) {
        setTimeout(() => {
          this.name = ''
        }, 200)
      }
    },
  },
  methods: {
    focusInput () {
      this.$refs.textfield.focus()
    },
    save () {
      this.$emit('save', this.name)
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    height: 100%;
    padding: 25px;
    position: relative;
    @apply bg-gray;
  }
  .modal__title {
    display: flex;
    align-items: center;
    color: #aaaaaa;
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    color: #fff;
    cursor: pointer;
  }
</style>
