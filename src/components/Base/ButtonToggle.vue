<template>
  <div :class="{ 'opacity-40': disabled }">
    <div class="flex items-center">
      <button
        v-for="(item, i) in items"
        :key="item.value"
        :style="item.value === internalValue ? activeStyles : inActiveStyles"
        :class="[
          'h-10 w-32 focus:outline-none transition-all duration-75 ease-in-out hover:text-white focus:text-white',
          { 'rounded-l-md': i === 0 },
          { 'rounded-r-md': i === items.length - 1 },
          item.value === internalValue ? activeClasses : inActiveClasses
        ]"
        @click="internalValue = item.value"
      >
        {{ item.text }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonToggle',
  props: {
    value: [String, Number],
    disabled: Boolean,
    items: {
      type: Array,
      default: () => ([
        { value: 'margin', text: 'margin' },
        { value: 'commission', text: 'commission' },
      ]),
    },
  },
  data () {
    return {
      hasFocus: false,
      lazyValue: this.value,
    }
  },
  computed: {
    activeClasses () {
      return 'bg-gray-900 text-white'
    },
    inActiveClasses () {
      return 'bg-gray-600 text-gray-200 border-l border-t border-b border-gray-900'
    },
    activeStyles () {
      const val = 'inset 0px 2px 1px rgba(0, 0, 0, 0.7)'
      return { '-webkit-box-shadow': val, 'box-shadow': val }
    },
    inActiveStyles () {
      const val = '0px 2px 1px #1E1E1E'
      return { '-webkit-box-shadow': val, 'box-shadow': val }
    },
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
  },
  watch: {
    value (val) {
      this.lazyValue = val
    },
  },
}
</script>
