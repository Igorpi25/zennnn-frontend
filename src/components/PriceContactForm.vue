<template>
  <div class="p-6">
    <Form
      ref="form"
      v-model="formValidity"
      @submit="onSubmit"
    >
      <TextField
        ref="nameInput"
        v-model="name"
        :label="$t('pricing.nameLabel')"
        :placeholder="$t('pricing.namePlaceholder')"
        :rules="[rules.required]"
        autofocus
        type="text"
        name="full-name"
        class="pb-4"
      />
      <TextField
        v-model="email"
        :label="$t('pricing.emailLabel')"
        :rules="[rules.required, rules.email]"
        placeholder="example@mail.com"
        type="email"
        autocomplete="on"
        name="email"
        class="pb-6"
      />
    </Form>
    <div :class="hasCancel ? 'flex flex-wrap sm:flex-nowrap sm:justify-between' : undefined">
      <Btn
        v-if="hasCancel"
        block
        outlined
        class="border-gray-100 mb-3 sm:mb-0 sm:mr-3"
        @click="onCancel"
      >
        {{ $t('pricing.cancel') }}
      </Btn>
      <Btn
        :loading="loading"
        :disabled="formValidity"
        :class="[
          formValidity ? 'bg-gray-100 text-white cursor-not-allowed' : '',
          { 'sm:ml-3': hasCancel },
        ]"
        :min-width="!hasCancel ? 185 : undefined"
        :block="hasCancel"
        @click="onSubmit"
      >
      {{ $t('pricing.send') }}
      </Btn>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApolloClient, useMutation } from '@vue/apollo-composable'

import { ziCloseWindow } from '../assets/icons'

import { PREMIUM_CONTACT } from '../graphql/mutations'

import Btn from './Base/Btn'
import Form from './Base/Form'
import TextField from './Base/TextField'

export default {
  name: 'PriceContactForm',

  components: {
    Btn,
    Form,
    TextField,
  },

  props: {
    hasCancel: Boolean,
  },

  emits: ['submit', 'cancel'],

  setup () {
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const name = ref(undefined)
    const email = ref(undefined)
    const loading = ref(false)
    const formValidity = ref(false)

    const premiumContactMutate = useMutation(PREMIUM_CONTACT, {
      variables: {
        name: name.value,
        email: email.value,
      },
      fetchPolicy: 'no-cache',
    })

    return {
      icons: {
        ziCloseWindow,
      },
      apolloClient,
      name,
      email,
      loading,
      formValidity,
      rules: {
        required: v => !!v || t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || t('rule.email'),
      },
      premiumContactMutate,
    }
  },

  methods: {
    focus () {
      this.$refs.nameInput && this.$refs.nameInput.focus()
    },
    reset () {
      this.$refs.form && this.$refs.form.reset()
    },
    onCancel () {
      this.$emit('cancel')
      setTimeout(() => {
        this.reset()
      }, 200)
    },
    async onSubmit () {
      try {
        this.loading = true

        await this.premiumContactMutate()

        this.$emit('success')

        setTimeout(() => {
          this.reset()
        }, 200)
      } catch (error) {
        const message = error.message
        this.$notify({ color: 'error', text: message })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
