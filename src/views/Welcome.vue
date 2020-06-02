<template>
  <div class="content">
    <Header />
    <section class="flex-grow container relative welcome--top">
      <h2 class="text-32 text-gray-75 font-semibold leading-none pb-6">
        {{ $t('welcome.title') }}
      </h2>
      <div class="w-full md:w-1/2">
        <p v-html="$t('welcome.subtitle')" class="pb-6" />
        <p class="text-2xl text-white pb-10">{{ username }}</p>
        <div class="pb-6">
          <Button
            :loading="loading"
            style="min-width: 120px;"
            @click.prevent="resendSignUp"
          >
            <span>{{ $t('welcome.resend') }}</span>
          </Button>
        </div>
        <p v-html="$t('welcome.hint')" class="text-gray-200 leading-tight pb-6" />
      </div>
      <div class="hidden md:block absolute container right-0 bottom-0 pb-16">
        <img class="ml-auto pb-2" src="@/assets/img/person-sitting.svg">
      </div>
    </section>
    <footer class="container">
      <Copyright class="pb-6" />
    </footer>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import Copyright from '../components/Copyright.vue'

export default {
  name: 'Welcome',
  components: {
    Header,
    Copyright,
  },
  data () {
    return {
      hasRegisteredUsername: false,
      loading: false,
      username: null,
    }
  },
  mounted () {
    // check registered user username from session storage
    // show resend button if exist
    this.username = sessionStorage.getItem('Cognito-registered-username')
  },
  methods: {
    async resendSignUp () {
      try {
        if (!this.username) throw new Error('User name not setted on "resendSignUp".')
        this.loading = true
        await this.$Auth.resendSignUp(this.username)
        this.$notify({ color: 'success', text: this.$t('message.emailResent') })
      } catch (error) {
        this.$notify({ color: 'warn', text: this.$t('message.failedToSent') })
        this.$logger.warn('Error: ', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.welcome--top {
  padding-top: 5vh;
}
@screen sm {
 .welcome--top {
    padding-top: 15vh;
  }
}
</style>
