import { defineComponent } from 'vue'
import { emitter, useNotify } from '@/plugins'
// import PhotoSwipeWrapper from './components/PhotoSwipeTemplate.vue'

export default defineComponent({
  name: 'App',

  setup() {
    // metaInfo () {
    //   return {
    //     htmlAttrs: {
    //       lang: this.$i18n.locale,
    //     },
    //   }
    // },

    const notify = useNotify()

    emitter.on('show-notify', (payload) => {
      notify(payload)
    })

    return () => (
      <router-view />
      // Root element of PhotoSwipe. Must have class pswp.
      // <PhotoSwipeWrapper />
    )
  },
})
