<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-bottom="8"
    transition="scale-transition"
    min-width="290px"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>
    <v-date-picker
      :value="compValue"
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      :next-icon="icons.mdiChevronRight"
      :prev-icon="icons.mdiChevronLeft"
      color="#7E99D0"
      no-title
      dark
      @input="input"
      @change="change"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { mdiChevronRight, mdiChevronLeft } from '@mdi/js'

export default {
  name: 'DatePicker',
  props: {
    value: String,
  },
  data () {
    return {
      menu: false,
      icons: {
        mdiChevronRight,
        mdiChevronLeft,
      },
    }
  },
  computed: {
    compValue () {
      const parsed = this.$parseDate(this.value)
      return this.$toISOString(parsed).substr(0, 10)
    },
    locale () {
      return this.$i18n.locale
    },
    firstDayOfWeek () {
      return this.$i18n.locale === 'ru' ? 1 : 0
    },
  },
  methods: {
    input (val) {
      this.$emit('input', val || null)
    },
    change (val) {
      this.$emit('change', val || null)
      this.menu = false
    },
  },
}
</script>
