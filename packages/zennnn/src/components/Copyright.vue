<template>
  <div class="my-auto text-sm text-gray-200 leading-snug">
    <div>
      ©2021 ZENNNN.
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
import { useQuery } from '@vue/apollo-composable'

import { GET_BACKEND_VERSION } from '@/graphql/queries'

export default {
  name: 'Copyright',
  props: {
    hideUserAgreement: Boolean,
  },
  setup() {
    const { result: backendVersionResult } = useQuery(GET_BACKEND_VERSION)

    const frontendVersion = ref(process.env.FRONTEND_VERSION || '')

    const version = computed(() => {
      const backendVersion = backendVersionResult.value.backendVersion
      return backendVersion
        ? `front/${frontendVersion.value} | backend/${backendVersion}`
        : `front/${frontendVersion.value}`
    })

    return {
      version,
    }
  },
}
</script>
