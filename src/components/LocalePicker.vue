<template>
  <div class="flex items-center">
    <Menu
      v-model="menu"
      :content-class="light ? 'locale-picker__menu locale-picker__menu--light' : 'locale-picker__menu'"
      :nudge-bottom="nudgeBottom"
      bottom
      left
    >
      <template v-slot:activator>
        <div
          class="flex items-center cursor-pointer pr-1"
        >
          <img
            :src="require(`@/assets/img/flags/locale/${$i18n.locale}.svg`)"
            :class="[
              'h-6 w-6 rounded-full mr-1',
            ]"
          >
          <i class="zi-chevron-down text-lg text-blue-500 hover:text-blue-600 cursor-pointer" />
        </div>
      </template>
      <template>
        <ul
          :class="[
            'text-sm rounded py-2',
            light ? 'border-white text-gray-900 bg-white' : 'border-gray-400 text-gray-100 bg-gray-400'
          ]"
          role="menu"
        >
          <li
            v-for="locale in locales"
            :key="locale.value"
            :value="locale.value"
            :class="[
              light ? 'hover:bg-light-gray-100 focus:bg-light-gray-100' : 'hover:bg-gray-300 focus:bg-gray-300',
              'flex items-center h-9 px-2 cursor-pointer focus:outline-none',
              'transition-colors duration-100 ease-out',
              locale.value === $i18n.locale && light ? 'text-gray-900 font-semibold' : locale.value === $i18n.locale ? 'text-white' : '',
            ]"
            tabindex="0"
            role="menuitem"
            @click="changeLocale(locale.value)"
          >
            <img
              :src="require(`@/assets/img/flags/locale/${locale.value}.svg`)"
              :alt="locale.text"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ locale.text }}</span>
          </li>
        </ul>
      </template>
    </Menu>
  </div>
</template>

<script>
import { CURRENT_LOCALE_STORE_KEY, LOCALES_LIST } from '../config/globals'

import Menu from './Base/Menu'

export default {
  name: 'LocalePicker',
  components: { Menu },
  props: {
    nudgeBottom: {
      type: [String, Number],
      default: 40,
    },
    light: Boolean,
  },
  data () {
    return {
      menu: false,
    }
  },
  computed: {
    locales () {
      return LOCALES_LIST
    },
  },
  methods: {
    changeLocale (locale) {
      localStorage.setItem(CURRENT_LOCALE_STORE_KEY, locale)
      this.$i18n.locale = locale
      this.menu = false
    },
  },
}
</script>

<style lang="postcss">
[data-theme="light"] .locale-picker__menu {
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.15)!important;
}
.locale-picker__menu {
  margin-top: 8px;
  overflow: visible;
  contain: initial;
}
.locale-picker__menu > ul {
  position: relative;
}
.locale-picker__menu > ul::after {
  border-color: transparent;
  border-style: solid;
  content: "";
  position: absolute;
  pointer-events: none;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  top: -2px;
  right: 8px;
  border-width: 0 5px 5px 5px;
  border-bottom-color: inherit;
}
.locale-picker__menu--light {}
</style>
