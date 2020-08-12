<template>
  <div class="flex">
    <div class="w-full">
      <TextField
        ref="input"
        v-model="internalValue"
        :loading="loading"
        :placeholder="currentPlaceholder"
        :class="['combo-input', { 'combo-input--menu-active': isMenuActive }]"
        :lazy="create"
        :rules="[rules.required]"
        state-icon
        state-color="none"
        prepend-slot-class="w-20 mr-1"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
      >
        <template v-slot:prepend>
          <Select
            :value="contactType"
            :activator="$refs.input"
            :items="contactTypeItems"
            item-value="value"
            item-text="no-text"
            prepend-slot-class="w-auto pl-3"
            append-slot-class="w-auto pr-2"
            not-focus-on-select
            @menu="v => isMenuActive = v"
            @input="onContactTypeSelect"
          >
            <template v-slot:prepend>
              <div class="w-6 inline-flex justify-center mr-2">
                <img :src="require(`@/assets/img/contacts/${currentIcon}.svg`)">
              </div>
            </template>
            <template v-slot:item="{ item }">
              <div class="w-6 inline-flex justify-center ml-1 mr-12">
                <img :src="require(`@/assets/img/contacts/${item.icon}.svg`)">
              </div>
              <span class="text-gray-200">{{ item.text }}</span>
            </template>
          </Select>
        </template>
      </TextField>
    </div>

    <button
      v-if="!create"
      class="flex flex-shrink-0 justify-center items-center text-2xl text-gray-200 cursor-pointer focus:text-gray-100 hover:text-gray-100 focus:outline-none select-none mx-1"
      @click="$emit('delete')"
    >
      <i class="zi-close" />
    </button>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { ContactType } from '../../graphql/enums'

export default {
  name: 'ContactItem',
  props: {
    create: Boolean,
    loading: Boolean,
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      debounce: 500,
      lazyValue: undefined,
      lazyContactType: undefined,
      blurWithoutUpdate: false,
      isMenuActive: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
        contact: v => (v && v.contact) || this.$t('rule.required'),
      },
    }
  },
  computed: {
    contactType: {
      get () {
        return this.lazyContactType
      },
      set (val) {
        this.lazyContactType = val
      },
    },
    internalValue: {
      get () {
        return this.lazyValue
      },
      set (val) {
        this.lazyValue = val || ''
        this.debounceInput()
      },
    },
    currentIcon () {
      return this.currentContactType.icon || 'qq'
    },
    currentPlaceholder () {
      return this.currentContactType.text || 'QQ'
    },
    currentContactType () {
      const item = this.contactTypeItems.find(el => el.value === this.contactType)
      return item || {}
    },
    contactTypeItems () {
      return [
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
    },
  },
  watch: {
    item: {
      handler (val) {
        this.$nextTick(() => {
          this.setItem(val)
        })
      },
      deep: true,
      immediate: true,
    },
  },
  created () {
    this.debounceInput = debounce(this.emitChange, this.debounce)
  },
  methods: {
    setItem (val) {
      const item = val || {}
      this.lazyContactType = item.contactType
      this.lazyValue = item.contact
    },
    onInput () {
      if (this.debounce) {
        this.debounceInput()
      } else {
        this.emitChange()
      }
    },
    onKeyDown (e) {
      this.$emit('keydown', e)
      if (this.debounce) {
        // on esc set value from store
        if (e.key === 'Esc' || e.key === 'Escape') {
          this.setValue(this.value)
          this.blurWithoutUpdate = true
          this.$refs.input.blur()
          e.preventDefault()
        } else if (e.key === 'Enter') {
          // on enter blur normally
          this.$refs.input.blur()
          e.preventDefault()
        }
      }
    },
    onBlur (e) {
      // cancel debounced
      if (this.debounce) {
        this.debounceInput.cancel()
      }
      // on esc blur without update
      if (this.blurWithoutUpdate) {
        this.blurWithoutUpdate = false
        return
      }
      this.emitChange()
      this.$emit('blur', e)
    },
    emitChange () {
      const contact = this.internalValue
      const contactType = this.contactType
      if (contactType === this.item.contactType && contact === this.item.contact) return
      this.$emit('update', { contact, contactType })
    },
    onContactTypeSelect (val) {
      this.contactType = val
      this.emitChange()
      if (!this.create) {
        this.$refs.input.focus()
      }
    },
  },
}
</script>
