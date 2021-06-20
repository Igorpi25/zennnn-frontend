import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, MenuItem } from '@zennnn/core'
import { CURRENT_LOCALE_STORE_KEY, LOCALES_LIST } from '../config'

export interface Locale {
  text: string
  value: string
  icon: string
}

export interface LocaleActivatorSlotProps {
  active: boolean
  text?: string
  icon?: string
  locale?: string
}

export default defineComponent({
  props: {
    placementStart: Boolean,
    distance: {
      type: Number,
      default: 16,
    },
    skidding: Number,
  },

  setup(props, { slots }) {
    const { locale } = useI18n()
    const isActive = ref(false)

    const localesList = LOCALES_LIST as Locale[]

    const currentLocale = computed(() =>
      localesList.find((item) => item.value === locale.value)
    )

    function changeLocale(val: string) {
      localStorage.setItem(CURRENT_LOCALE_STORE_KEY, val)
      locale.value = val
      isActive.value = false
    }

    return () => (
      <Menu
        v-model={isActive.value}
        v-slots={{
          activator: () =>
            slots.activator?.({
              active: isActive.value,
              text: currentLocale.value?.text,
              icon: currentLocale.value?.icon,
              locale: currentLocale.value?.value,
            }),
        }}
        value={locale.value}
        arrow={false}
        distance={props.distance}
        skidding={props.skidding}
        placement={props.placementStart ? 'bottom-start' : 'bottom-end'}
        {...{
          'onUpdate:value': changeLocale,
        }}
      >
        {localesList.map((item, i) => (
          <MenuItem key={item.value} index={i} value={item.value} class="px-4">
            <img
              src={require(`@zennnn/icons/flags/${item.icon}.svg`).default}
              class="h-6 w-6 rounded-full mr-4"
            />
            <span>{item.text}</span>
          </MenuItem>
        ))}
      </Menu>
    )
  },
})
