<template>
  <div class="my-auto text-sm text-gray-200 leading-snug">
    <div>
      ©2019 ZENNNN. <router-link v-if="!hideUserAgreement" v-html="$t('app.userAgreement')" to="/agreenemt" class="text-blue-500 hover:text-blue-600 focus:outline-none focus:text-blue-600"/>
    </div>
    <div>{{ version }}</div>
  </div>
</template>

<script>
import { GET_BACKEND_VERSION } from '../graphql/queries'

export default {
  name: 'Copyright',
  props: {
    hideUserAgreement: Boolean,
  },
  apollo: {
    backendVersion: {
      query: GET_BACKEND_VERSION,
    },
  },
  data () {
    return {
      frontendVersion: process.env.FRONTEND_VERSION || '',
    }
  },
  computed: {
    version () {
      return this.backendVersion
        ? `front/${this.frontendVersion} | backend/${this.backendVersion}`
        : `front/${this.frontendVersion}`
    },
  },
}
</script>
