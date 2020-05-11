<template>
  <div class="my-auto text-sm text-gray-200">
    <div>
      ©2019 ZENNNN. <a href="#" class="text-blue-500 hover:text-blue-600" @click.prevent>Пользовательское соглашение</a>
    </div>
    <div>{{ version }}</div>
  </div>
</template>

<script>
import { GET_BACKEND_VERSION } from '../graphql/queries'

export default {
  name: 'Copyright',
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
