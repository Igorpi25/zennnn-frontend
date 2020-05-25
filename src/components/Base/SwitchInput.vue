<template>
  <div :class="{ 'opacity-40': disabled }">
    <div class="flex items-center">
      <label
        :for="computedId"
        :class="[
          'switch align-middle',
          { 'mr-2': $slots.default },
          { 'switch--small': small }
        ]"
      >
        <input
          ref="input"
          v-model="internalValue"
          :id="computedId"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
          type="checkbox"
          role="checkbox"
          aria-hidden="true"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
        />
        <span
          :class="['switch-slider', { 'shadow-blue-600': hasFocus }, { 'cursor-not-allowed': disabled }]"
        />
      </label>
      <label
        :for="computedId"
        :class="[
          'select-none leading-tight',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ]"
      >
        <slot />
      </label>
    </div>
    <div v-if="!hideDetails" class="h-6 pt-2 leading-tight text-sm text-yellow-400">
      <v-slide-y-transition>
        <span v-show="errorText">{{ errorText }}</span>
      </v-slide-y-transition>
    </div>
  </div>
</template>

<script>
import validatable from '@/mixins/validatable'

export default {
  name: 'SwitchInput',
  mixins: [validatable],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: String,
    id: String,
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    hideDetails: Boolean,
    small: Boolean,
  },
  data () {
    return {
      hasFocus: false,
      checked: false,
      lazyValue: this.value,
    }
  },
  computed: {
    computedId () {
      return this.id || `input-${this._uid}`
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val
        this.checked = !!val
        this.$emit('input', val)
      },
    },
  },
  watch: {
    value: {
      handler (val) {
        this.lazyValue = val
        this.checked = !!val
      },
      immediate: true,
    },
  },
}
</script>
