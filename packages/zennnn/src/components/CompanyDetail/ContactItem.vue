<template>
  <div class="flex">
    <Select
      ref="selectRef"
      :model-value="selectValue"
      :items="items"
      :control-class="isInputFocused ? 'ring-1 ring-blue-500' : ''"
      :open-on-focus="false"
      :dependencies="dependencies"
      class="flex-grow"
      control-input-class="flex-shrink-0"
      input-class="w-0"
      @update:model-value="onContactTypeSelect"
    >
      <template v-slot:prepend>
        <div
          class="w-6 flex-shrink-0 inline-flex justify-center ml-2 mr-2"
        >
          <img
            :src="require(`@/assets/img/contacts/${selectedIcon}.svg`).default"
            aria-hidden="true"
          >
        </div>
      </template>
      <template v-slot:append-outer>
        <TextField
          ref="inputRef"
          v-model="inputValue"
          :loading="loading"
          :placeholder="selectedPlaceholder"
          :lazy="create"
          :rules="[rules.required]"
          :debounce="debounce"
          state-icon
          state-error-color="none"
          class="w-full flex-grow ml-4"
          control-class="text-field__control--no-shadow pl-0 pr-0"
          @focus="onFocus"
          @blur="onBlur"
          @update:model-value="emitChange"
        />
      </template>
      <template v-slot:item="{ item }">
        <div class="w-6 inline-flex justify-center mr-12">
          <img
            :src="require(`@/assets/img/contacts/${item.icon}.svg`).default"
            aria-hidden="true"
          >
        </div>
        <span class="text-gray-200">{{ item.text }}</span>
      </template>
    </Select>

    <button
      v-if="!create"
      class="flex-shrink-0 text-gray-200 focus:text-gray-100 hover:text-gray-100 focus:outline-none ml-1"
      @click="$emit('delete')"
    >
      <Icon>
        {{ icons.ziCloseDelete }}
      </Icon>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { ziCloseDelete } from '../../assets/icons'

import { ContactType } from '../../graphql/enums'

import Icon from '../Base/Icon'
import Select from '../Base/Select'
import TextField from '../Base/TextField'

export default {
  name: 'ContactItem',
  components: {
    Icon,
    Select,
    TextField,
  },
  props: {
    create: Boolean,
    loading: Boolean,
    value: {
      type: Object,
      default: () => ({}),
    },
    debounce: {
      type: Number,
      default: 500,
    },
  },
  emits: ['update', 'delete'],
  setup () {
    const { t } = useI18n()

    const inputRef = ref(null)
    const selectRef = ref(null)

    const inputValue = ref(undefined)
    const selectValue = ref(undefined)

    const isInputFocused = ref(false)

    const items = [
      {
        text: 'QQ',
        value: ContactType.QQ,
        icon: 'qq',
      },
      {
        text: 'Telegram',
        value: ContactType.TELEGRAM,
        icon: 'telegram',
      },
      {
        text: 'WeChat',
        value: ContactType.WE_CHAT,
        icon: 'wechat',
      },
      {
        text: 'WhatsApp',
        value: ContactType.WHATSAPP,
        icon: 'whatsapp',
      },
      {
        text: 'Messenger',
        value: ContactType.MESSENGER,
        icon: 'messenger',
      },
      {
        text: 'KakaoTalk',
        value: ContactType.KAKAO_TALK,
        icon: 'kakao-talk',
      },
      {
        text: 'Viber',
        value: ContactType.VIBER,
        icon: 'viber',
      },
      {
        text: 'Skype',
        value: ContactType.SKYPE,
        icon: 'skype',
      },
      {
        text: 'Email',
        value: ContactType.EMAIL,
        icon: 'email',
      },
    ]

    const dependencies = computed(() => {
      return [inputRef.value && inputRef.value.rootElement]
    })

    const selectedItem = computed(() => items.find(item => item.value === selectValue.value) || {})

    const selectedIcon = computed(() => selectedItem.value.icon || 'qq')

    const selectedPlaceholder = computed(() => selectedItem.value.text || 'QQ')

    return {
      inputRef,
      selectRef,
      inputValue,
      selectValue,
      isInputFocused,
      dependencies,
      selectedItem,
      selectedIcon,
      selectedPlaceholder,
      items,
      rules: {
        required: v => !!v || t('rule.required'),
        contact: v => (v && v.contact) || t('rule.required'),
      },
      icons: {
        ziCloseDelete,
      },
    }
  },
  watch: {
    value: {
      handler (val) {
        if (!val) return
        this.setValue(val)
      },
      immediate: true,
    },
  },
  methods: {
    openMenu () {
      if (!this.selectRef.isMenuActive) {
        this.selectRef.openMenu()
      }
    },
    closeMenu () {
      if (this.selectRef.isMenuActive) {
        this.selectRef.closeMenu()
      }
    },
    setValue (val) {
      const item = val || {}
      this.selectValue = item.contactType
      this.inputValue = item.contact
    },
    onFocus () {
      this.closeMenu()
      this.isInputFocused = true
    },
    onBlur (e) {
      this.isInputFocused = false
    },
    emitChange () {
      const contact = this.inputValue
      const contactType = this.selectValue
      if (contactType === this.value.contactType && contact === this.value.contact) return
      this.$emit('update', { contact, contactType })
    },
    onContactTypeSelect (val) {
      this.selectValue = val
      this.emitChange()
      if (!this.create) {
        this.inputRef.focus()
      }
    },
  },
}
</script>
