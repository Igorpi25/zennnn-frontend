<template>
  <!-- [data-app] for vuetify components -->
  <div data-app="true" id="app">
    <router-view/>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <!-- <PhotoSwipeWrapper /> -->
  </div>
</template>

<script>
// import PhotoSwipeWrapper from './components/PhotoSwipeTemplate.vue'

export default {
  name: 'app',
  // components: {
  //   PhotoSwipeWrapper,
  // },
  metaInfo () {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    }
  },
}
</script>
