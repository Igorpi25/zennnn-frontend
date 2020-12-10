<template>
  <div v-if="noDialog">
    <Form
      ref="form"
      v-model="formValidity"
      @submit="onSubmit"
    >
      <TextField
        ref="name"
        v-model="name"
        :label="$t('pricing.nameLabel')"
        :placeholder="$t('pricing.namePlaceholder')"
        :rules="[rules.required]"
        type="text"
        class="pb-4"
        name="full-name"
        validate-on-blur
        content-class="bg-white shadow-light-gray-400"
        input-class="placeholder-gray-100 text-gray-900"
        label-class="text-black"
      />
      <TextField
        v-model="email"
        :label="$t('pricing.emailLabel')"
        placeholder="example@mail.com"
        :rules="[rules.required, rules.email]"
        class="pb-6"
        type="email"
        autocomplete="on"
        name="email"
        validate-on-blur
        content-class="bg-white shadow-light-gray-400"
        input-class="placeholder-gray-100 text-gray-900"
        label-class="text-black"
      />
    </Form>
    <div>
      <Button
        :loading="loading"
        :disabled="formValidity"
        :merge-class="formValidity ? 'bg-gray-100 text-white cursor-not-allowed' : ''"
        min-width="185"
        @click="onSubmit"
      >
      {{ $t('pricing.send') }}
      </Button>
    </div>
  </div>
  <v-dialog
    v-else
    v-model="dialog"
    max-width="458"
    content-class="relative text-gray-900 bg-white"
  >
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on" />
    </template>
    <span class="absolute w-10 text-right top-0 right-0 pt-3 pr-3">
      <i
        class="zi-close text-2xl hover:text-gray-300 cursor-pointer"
        @click="dialog = false"
      />
    </span>
    <div class="bg-light-gray-100 flex px-8 py-5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M24.9558 13.1606V11.3978C24.9558 10.6436 24.5422 9.95064 23.872 9.58907L22.2167 8.70526V6.01087C22.2167 4.6267 21.0909 3.5 19.7059 3.5H8.2928C6.90771 3.5 5.78193 4.6267 5.78193 6.01087V8.70385L4.12286 9.58999C3.45633 9.95064 3.04272 10.6436 3.04272 11.3978V22.4457C3.04272 23.5787 3.96399 24.5 5.09707 24.5H22.9014C24.0345 24.5 24.9558 23.5787 24.9558 22.4457V13.2487C24.9577 13.2195 24.9577 13.1901 24.9558 13.1606ZM21.7953 15.2714L15.167 18.7332C14.7991 18.9232 14.3992 19.0181 13.9983 19.0181C13.5984 19.0181 13.1994 18.9241 12.836 18.736L6.20777 15.2732C6.16835 15.2571 6.13076 15.2374 6.09542 15.2145L4.41229 14.3352V22.4457C4.41229 22.8237 4.71907 23.1304 5.09707 23.1304H22.9014C23.2794 23.1304 23.5862 22.8237 23.5862 22.4457V14.336L21.8991 15.2172C21.8663 15.2381 21.8316 15.2563 21.7953 15.2714ZM5.78193 13.5056V10.2564L4.77112 10.7961C4.55473 10.9139 4.41229 11.1504 4.41229 11.3978V12.7902L5.78193 13.5056ZM22.2167 13.5063L23.5862 12.7911V11.3978C23.5862 11.1504 23.4438 10.9139 23.2237 10.7952L22.2167 10.2577V13.5063ZM10.1189 14H17.8798C18.2578 14 18.5646 13.6933 18.5646 13.3153C18.5646 12.9373 18.2578 12.6305 17.8798 12.6305H10.1189C9.7409 12.6305 9.43412 12.9373 9.43412 13.3153C9.43412 13.6933 9.7409 14 10.1189 14ZM17.8798 11.261H10.1189C9.7409 11.261 9.43412 10.9542 9.43412 10.5762C9.43412 10.1982 9.7409 9.8914 10.1189 9.8914H17.8798C18.2578 9.8914 18.5646 10.1982 18.5646 10.5762C18.5646 10.9542 18.2578 11.261 17.8798 11.261ZM10.1189 8.52176H14.2276C14.6056 8.52176 14.9124 8.21497 14.9124 7.83697C14.9124 7.45897 14.6056 7.15219 14.2276 7.15219H10.1189C9.7409 7.15219 9.43412 7.45897 9.43412 7.83697C9.43412 8.21497 9.7409 8.52176 10.1189 8.52176Z" fill="#7E99D0"/>
      </svg>
      <div class="text-lg font-semibold text-gray-900 pl-4">
        {{ $t('pricing.contact') }}
      </div>
    </div>
    <div class="p-8 pt-6">
      <Form
        ref="form"
        v-model="formValidity"
        @submit="onSubmit"
      >
        <TextField
          ref="name"
          v-model="name"
          :label="$t('pricing.nameLabel')"
          :placeholder="$t('pricing.namePlaceholder')"
          :rules="[rules.required]"
          type="text"
          class="pb-4"
          name="full-name"
          validate-on-blur
          content-class="bg-white shadow-light-gray-400"
          input-class="placeholder-gray-100 text-gray-900"
          label-class="text-black"
        />
        <TextField
          v-model="email"
          :label="$t('pricing.emailLabel')"
          placeholder="example@mail.com"
          :rules="[rules.required, rules.email]"
          class="pb-6"
          type="email"
          autocomplete="on"
          name="email"
          validate-on-blur
          content-class="bg-white shadow-light-gray-400"
          input-class="placeholder-gray-100 text-gray-900"
          label-class="text-black"
        />
      </Form>
      <div class="flex flex-wrap sm:flex-nowrap sm:justify-between">
        <Button
          block
          outlined
          class="mb-3 sm:mb-0 sm:mr-3"
          merge-class="border-gray-100"
          @click="dialog = false"
        >
          {{ $t('pricing.cancel') }}
        </Button>
        <Button
          :loading="loading"
          :disabled="formValidity"
          :merge-class="formValidity ? 'bg-gray-100 text-white cursor-not-allowed' : ''"
          block
          class="sm:ml-3"
          @click="onSubmit"
        >
        {{ $t('pricing.send') }}
        </Button>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { PREMIUM_CONTACT } from '../graphql/mutations'

export default {
  name: 'PriceContactForm',
  props: {
    noDialog: Boolean,
  },
  data () {
    return {
      dialog: false,
      name: '',
      email: '',
      loading: false,
      formValidity: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
      },
    }
  },
  watch: {
    dialog (val) {
      if (val) {
        setTimeout(() => {
          if (this.$refs.name) this.$refs.name.focus()
        }, 200)
      } else {
        setTimeout(() => {
          if (this.$refs.form) this.$refs.form.reset()
        }, 200)
      }
    },
  },
  methods: {
    async onSubmit () {
      try {
        this.loading = true
        await this.$apollo.mutate({
          mutation: PREMIUM_CONTACT,
          variables: {
            name: this.name,
            email: this.email,
          },
          fetchPolicy: 'no-cache',
        })
        this.dialog = false
        setTimeout(() => {
          if (this.$refs.form) this.$refs.form.reset()
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
