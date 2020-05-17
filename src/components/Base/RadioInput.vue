<template>
  <div :class="{ 'opacity-40': disabled }">
    <div class="flex items-start">
      <div
        class="flex-shrink-0 relative rounded-full"
        :style="{
          width: '18px',
          height: '18px',
        }"
      >
        <div
          :class="[
            'transition-colors duration-100 ease-out',
            'relative w-full h-full flex border-2 rounded-full',
            checked ? 'border-blue-500' : borderColor ? borderColor : 'border-gray-300',
            { [bgColor || 'bg-blue-500']: checked },
            { 'shadow-blue-600': hasFocus },
          ]"
        >
          <v-fade-transition>
            <div v-show="checked" class="absolute inset-0 flex items-center justify-center">
              <div class="bg-white rounded-full w-2 h-2" />
            </div>
          </v-fade-transition>
        </div>
        <input
          ref="input"
          v-model="internalValue"
          :value="label"
          :id="computedId"
          :name="name"
          :required="required"
          :readonly="readonly"
          :disabled="disabled"
          :class="[
            'absolute opacity-0 select-none cursor-pointer top-0 left-0',
            { 'cursor-not-allowed': disabled },
          ]"
          :style="{
            width: '18px',
            height: '18px',
          }"
          type="radio"
          tabindex="0"
          aria-hidden="true"
          @focus="hasFocus = true"
          @blur="hasFocus = false"
        >
      </div>
      <label :for="computedId" class="cursor-pointer select-none leading-tight">
        <slot />
      </label>
    </div>
    <div v-if="!hideDetails" class="h-6 pt-2 leading-tight text-sm text-yellow-400">
      {{ errorText }}
    </div>
  </div>
</template>

<script>
import validatable from '@/mixins/validatable'

export default {
  name: 'RadioInput',
  mixins: [validatable],
  props: {
    value: [String, Number, Boolean],
    label: String,
    borderColor: String,
    bgColor: String,
    name: String,
    required: Boolean,
    readonly: Boolean,
    disabled: Boolean,
    hideDetails: Boolean,
  },
  data () {
    return {
      hasFocus: false,
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
        this.$emit('input', val)
      },
    },
    checked () {
      return this.label === this.internalValue
    },
  },
  watch: {
    value: {
      handler (val) {
        this.lazyValue = val
      },
      immediate: true,
    },
  },
}
</script>
