import { defineComponent, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useReactiveVar } from 'shared/composables/reactiveVar'
import { emitter, useNotify } from '@/plugins'
import { isLoggedInVar } from '@/plugins/apollo'
import { GET_ORGS, GET_PROFILE } from '@/graphql/queries'
// import PhotoSwipeWrapper from './components/PhotoSwipeTemplate.vue'

import type { GetOrgs, GetProfile } from '@/graphql/types'

export default defineComponent({
  name: 'App',

  setup() {
    const { locale } = useI18n()

    const isLoggedIn = useReactiveVar(isLoggedInVar)
    useQuery<GetProfile>(GET_PROFILE, null, () => ({
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-first',
    }))
    useQuery<GetOrgs>(GET_ORGS, null, () => ({
      enabled: isLoggedIn.value,
      fetchPolicy: 'cache-first',
    }))

    watch(
      () => locale.value,
      (val) => {
        if (val) {
          document.querySelector('html')?.setAttribute('lang', val)
        }
      },
      { immediate: true }
    )

    const notify = useNotify()

    emitter.on('show-notify', (payload) => {
      notify(payload)
    })

    return () => (
      <div class="flex-grow flex flex-col">
        <RouterView />
      </div>
      // Root element of PhotoSwipe. Must have class pswp.
      // <PhotoSwipeWrapper />
    )
  },
})
