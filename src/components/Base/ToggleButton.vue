<template>
  <div
    :class="[
      'toggle',
      {'toggle--small': small},
      {'toggle--large': large},
    ]"
  >
    <input
      type="checkbox"
      v-model="internalValue"
    >
    <div
      v-if="checked"
      class="icon mr-2"
      style="width:10px; height:10px"
    >
      <div class="icon__item">
        <Icon size="8">
          <IconToggleIndicator />
        </Icon>
      </div>
    </div>
    <Icon
      v-else
      size="10"
      class="mr-2"
    >
      {{ icons.mdiCircleOutline }}
    </Icon>
    <slot />
  </div>
</template>

<script>
import { mdiCircleOutline } from '@mdi/js'

export default {
  name: 'ToggleButton',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      checked: false,
      lazyValue: this.value,
      icons: {
        mdiCircleOutline,
      },
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
}
</script>

<style scoped lang="postcss">
.toggle {
  width: 150px;
  height: 26px;
  padding-left: 5px;
  padding-right: 20px;
  position: relative;
  cursor: pointer;
  @apply flex justify-center items-center;
  @apply text-primary border border-primary rounded-full relative;
}
.toggle input {
  opacity: 0;
  position: absolute;
  user-select: none;
  width: 100%;
  height: 100%;
}
.toggle--small {
  width: 95px;
  height: 22px;
  padding-right: 10px;
}
.toggle--large {
  height: 36px;
  padding: 0 35px;
}
</style>
