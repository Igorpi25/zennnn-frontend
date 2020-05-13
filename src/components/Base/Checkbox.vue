<template>
  <div>
    <div class="flex items-start">
      <div class="flex-shrink-0 relative w-5 h-5">
        <input
          ref="input"
          type="checkbox"
          role="checkbox"
          v-model="internalValue"
          :id="computedId"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
          class="absolute opacity-0 select-none cursor-pointer inset-0"
          aria-hidden="true"
          @change="checkField"
        >
        <div
          :class="[
            'transition-colors duration-100 ease-out',
            'relative w-full h-full flex pointer-events-none border-2 border-gray-300',
            { 'bg-gray-300': checked }
          ]"
          style="border-radius: 3px;"
        >
          <v-fade-transition>
            <div v-show="checked" class="absolute inset-0 flex items-center justify-center">
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01953 3.68994L6.23828 7.81494L12.582 1.50244" stroke="white" stroke-width="3"/>
              </svg>
            </div>
          </v-fade-transition>
        </div>
      </div>
      <label :for="computedId" class="cursor-pointer select-none leading-tight">
        <slot />
      </label>
    </div>
    <div v-if="!hideDetails" class="h-6 pt-2 leading-tight text-sm" style="color: #D7C370;">
      {{ errorText }}
    </div>
  </div>
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
    label: String,
    id: String,
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    hideDetails: Boolean,
  },
  data () {
    return {
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
