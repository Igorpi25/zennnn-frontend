<template>
  <div class="modal">
    <div class="modal__title">
      <Icon size="21">
        {{ icons.ziPattern }}
      </Icon>
      <span class="ml-2">{{ $t('label.template') }}</span>
    </div>
    <div class="list">
      <div class="list-item">
        <RadioButton
          :value="internalValue"
          label="default"
          name="template-item"
          @input="change"
        >
          <span class="list-label">{{ defaultName }}</span>
        </RadioButton>
      </div>
      <div v-for="(item, i) in templates" :key="i" class="list-item">
        <RadioButton
          :value="internalValue"
          :label="item.id"
          name="template-item"
          class="flex-grow"
          @input="change"
        >
          <span class="list-label">
            {{ item.templateName }}
          </span>
        </RadioButton>
        <svg class="list-item__close" @click="$emit('delete', item.id)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" role="img" aria-hidden="true">
          <path fill="#9F9F9F" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
        </svg>
      </div>
    </div>
    <div class="modal__footer">
      <Button
        @click="$emit('set-template', internalValue)"
      >
        <span>{{ $t('action.apply') }}</span>
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
  name: 'TemplateListModal',
  props: {
    visibility: {
      type: Boolean,
      default: false,
    },
    templates: {
      type: Array,
      default: () => ([]),
    },
    currentTemplate: {
      type: [String],
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      internalValue: '',
      defaultName: this.$t('label.defaultTemplateName'),
      icons: {
        ziPattern,
      },
    }
  },
  watch: {
    currentTemplate: {
      handler (val) {
        this.internalValue = val
      },
      immediate: true,
    },
    visibility () {
      this.internalValue = this.currentTemplate
    },
  },
  methods: {
    change (v) {
      this.internalValue = v
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    height: 100%;
    position: relative;
    @apply bg-gray;
  }
  .modal__title {
    padding: 25px;
    display: flex;
    align-items: center;
    color: #aaaaaa;
    @apply bg-gray-darkest;
  }
  .modal__footer {
    padding: 25px;
    display: flex;
    justify-content: center;
    @apply bg-gray-darkest;
  }
  .list {
    padding: 25px 0;
  }
  .list-item {
    display: flex;
    padding: 4px 32px;
  }
  .list-item > div:first-child {
    flex-grow: 1;
  }
  .list-item__close {
    transition: opacity .15 cubic-bezier(0.215, 0.610, 0.355, 1);
    cursor: pointer;
    opacity: 0;
  }
  .list-item:hover .list-item__close {
    opacity: 1;
  }
  .list-label {
    color: #CDCDCD;
    /* font-size: 18px; */
    margin-left: 4px;
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    color: #fff;
    cursor: pointer;
  }
</style>
