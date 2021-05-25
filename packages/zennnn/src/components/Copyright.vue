<template>
  <div class="my-auto text-sm text-gray-200 leading-snug">
    <div>
      ©2019 ZENNNN.
      <router-link
        v-if="!hideUserAgreement"
        v-html="$t('app.userAgreement')"
        to="/agreenemt"
        class="
          text-blue-500
          hover:text-blue-400
          focus:outline-none
          focus:text-blue-400
        "
      />
    </div>
    <div>{{ version }}</div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuery, useResult } from '@vue/apollo-composable'

import { GET_BACKEND_VERSION } from '../graphql/queries'

export default {
  name: 'Copyright',
  props: {
    hideUserAgreement: Boolean,
  },
  setup() {
    const { result } = useQuery(GET_BACKEND_VERSION)
    const backendVersion = useResult(result)

    const frontendVersion = ref(process.env.FRONTEND_VERSION || '')

    const version = computed(() => {
      return backendVersion.value
        ? `front/${frontendVersion.value} | backend/${backendVersion.value}`
        : `front/${frontendVersion.value}`
    })

    return {
      version,
      backendVersion,
      frontendVersion,
    }
  },
}
</script>
