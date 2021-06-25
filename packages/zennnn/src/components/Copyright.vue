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

import { useReactiveVar } from 'shared/composables/reactiveVar'
import { backendVersionVar } from '@/plugins/apollo'

export default {
  name: 'Copyright',
  props: {
    hideUserAgreement: Boolean,
  },
  setup() {
    const backendVersion = useReactiveVar(backendVersionVar)

    const frontendVersion = ref(process.env.FRONTEND_VERSION || '')

    const version = computed(() => {
      return backendVersion.value
        ? `front/${frontendVersion.value} | backend/${backendVersion.value}`
        : `front/${frontendVersion.value}`
    })

    return {
      version,
    }
  },
}
</script>
