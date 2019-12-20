<template>
  <!-- [data-app] for vuetify components -->
  <div data-app="true" id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  metaInfo () {
    return {
      htmlAttrs: {
        lang: this.$i18n.locale,
      },
    }
  },
  methods: {
    logout () {
      this.$apollo.provider.defaultClient.store.reset()
      this.$Auth.signOut()
      this.$router.push({ name: 'signin' })
    },
  },
}
</script>
