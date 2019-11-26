<template>
  <InputBase
    :is-dirty="!!internalValue"
    :has-error="hasError"
    :hide-details="hideDetails"
    :detail-text="errorText"
    :class="['radio', {'radio--center': center}]"
  >
    <div class="radio__slot">
      <div class="radio__input">
        <input
          ref="input"
          type="radio"
          v-model="internalValue"
          :value="label"
          :id="inputId"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
        >
        <i class="radio__icon">
          <div class="icon__item">
            <Icon
              v-if="checked"
              size="6"
            >
              <IconToggleIndicator />
            </Icon>
          </div>
        </i>
      </div>
      <label :for="inputId">
        <slot />
      </label>
    </div>
  </InputBase>
</template>

<script>
import validatable from '@/mixins/validatable'

export default {
  name: 'RadioButton',
  mixins: [validatable],
  props: {
    value: [String, Number, Boolean],
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
    center: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
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
        this.$emit('input', val)
      },
    },
    checked () {
      return this.label === this.internalValue
    },
  },
  watch: {
    value (val) {
      this.lazyValue = val
    },
  },
}
</script>
