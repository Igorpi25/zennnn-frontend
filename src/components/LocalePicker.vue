<template>
  <Menu
    v-model="menu"
    :value="locale"
    :arrow="false"
    :distance="distance"
    placement="bottom-end"
    content-class="dark:bg-gray-900"
    @update:value="changeLocale"
  >
    <template v-slot:activator>
      <div
        class="group flex items-center cursor-pointer"
      >
        <img
          :src="require(`@/assets/img/flags/locale/${locale}.svg`).default"
          :class="[
            'h-6 w-6 rounded-full mr-xs',
          ]"
        >
        <Icon
          role="button"
          tabindex="0"
          class="text-blue-500 group-hover:text-blue-600 focus:text-blue-600 focus:outline-none"
        >
          {{ icons.ziChevronDown }}
        </Icon>
      </div>
    </template>
    <MenuItem
      v-for="(locale, i) in locales"
      :key="locale.value"
      :index="i"
      :value="locale.value"
      class="bg-gray-900 dark:hover:text-light-gray-100 h-10"
    >
      <img
        :src="require(`@/assets/img/flags/locale/${locale.value}.svg`).default"
        :alt="locale.text"
        class="h-6 w-6 rounded-full mr-2"
      >
      <span>{{ locale.text }}</span>
    </MenuItem>
  </Menu>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { CURRENT_LOCALE_STORE_KEY, LOCALES_LIST } from '../config/globals'

import { ziChevronDown } from '../assets/icons'

import Icon from './Base/Icon'
import { Menu, MenuItem } from './Base/Menu'

export default {
  name: 'LocalePicker',
  components: {
    Icon,
    Menu,
    MenuItem,
  },
  props: {
    distance: [String, Number],
    light: Boolean,
  },
  setup () {
    const menu = ref(false)
    const { locale } = useI18n()

    const changeLocale = (val) => {
      localStorage.setItem(CURRENT_LOCALE_STORE_KEY, val)
      locale.value = val
      menu.value = false
    }

    return {
      icons: {
        ziChevronDown,
      },
      menu,
      locale,
      locales: LOCALES_LIST,
      changeLocale,
    }
  },
}
</script>
