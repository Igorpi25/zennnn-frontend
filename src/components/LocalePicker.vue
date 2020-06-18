<template>
  <div class="flex items-center">
    <v-menu
      v-model="menu"
      :nudge-bottom="nudgeBottom"
      bottom
      left
      content-class="locale-picker__menu"
    >
      <template v-slot:activator="{ on }">
        <div
          class="flex items-center cursor-pointer pr-1"
          v-on="on"
        >
          <img
            :src="require(`@/assets/img/flags/round/${$i18n.locale}.svg`)"
            :class="[
              'h-6 w-6 rounded-full mr-1',
            ]"
          >
          <i class="zi-chevron-down text-lg text-blue-500 hover:text-blue-600 cursor-pointer" />
        </div>
      </template>
      <template>
        <ul
          class="border-gray-400 text-sm text-gray-100 bg-gray-400 py-2"
          role="menu"
        >
          <li
            v-for="locale in locales"
            :key="locale.value"
            :value="locale.value"
            :class="[
              'flex items-center h-9 px-2 cursor-pointer hover:bg-gray-300 focus:outline-none focus:bg-gray-300',
              'transition-colors duration-100 ease-out',
              { 'text-white': locale.value === $i18n.locale }
            ]"
            tabindex="0"
            role="menuitem"
            @click="changeLocale(locale.value)"
          >
            <img
              :src="require(`@/assets/img/flags/round/${locale.value}.svg`)"
              :alt="locale.text"
              class="h-6 w-6 rounded-full mr-2"
            >
            <span>{{ locale.text }}</span>
          </li>
        </ul>
      </template>
    </v-menu>
  </div>
</template>

<script>
// TODO: rename to CURRENT_LOCALE_STORE_KEY
import { CURRENT_LANG_STORE_KEY, LOCALES_LIST } from '../config/globals'

export default {
  name: 'LocalePicker',
  props: {
    nudgeBottom: {
      type: [String, Number],
      default: 40,
    },
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
      localStorage.setItem(CURRENT_LANG_STORE_KEY, locale)
      this.$i18n.locale = locale
      this.menu = false
    },
  },
}
</script>

<style lang="postcss">
.locale-picker__menu > ul {
  position: relative;
  margin-top: 8px;
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
.locale-picker__menu > ul {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>
