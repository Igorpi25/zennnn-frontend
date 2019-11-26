<template>
  <InputBase
    :is-dirty="!!internalValue"
    :has-error="hasError"
    :hide-details="hideDetails"
    :detail-text="errorText"
    :class="[
      'checkbox',
      {'checkbox--secondary': secondary},
      {'checkbox--vertical': verticalAlign},
      {'checkbox--horizontal': horizontalAlign},
    ]"
  >
    <div class="checkbox__slot">
      <div class="checkbox__input">
        <input
          ref="input"
          type="checkbox"
          v-model="internalValue"
          :id="inputId"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
          @input="checkField"
        >
        <i class="checkbox__icon">
          <div class="icon__item">
            <Icon v-if="checked" size="8">
              <IconToggleIndicator />
            </Icon>
          </div>
        </i>
      </div>
      <label :for="inputId" class="cursor-pointer">
        <slot />
      </label>
    </div>
  </InputBase>
</template>

<script>
import validatable from '@/mixins/validatable'

export default {
  name: 'Checkbox',
  inject: {
    form: {
      default: null,
    },
  },
  mixins: [validatable],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array,
    },
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
    horizontalAlign: {
      type: Boolean,
      default: false,
    },
    verticalAlign: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      checked: false,
      // TODO input registrator
      inputId: 'input' + Math.round(Math.random() * 100000),
      lazyValue: this.value,
    }
  },
  computed: {
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val
        this.checked = !this.checked
        this.$emit('input', val)
      },
    },
  },
  watch: {
    value (val) {
      this.lazyValue = val
    },
  },
  created () {
    if (this.form) {
      this.form.register(this)
    }
  },
  beforeDestroy () {
    if (this.form) {
      this.form.unregister(this)
    }
  },
}
</script>
