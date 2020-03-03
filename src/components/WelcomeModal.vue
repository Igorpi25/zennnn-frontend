<template>
  <div class="modal">
    <div class="modal-header">
      <!-- <Icon size="28">{{ icons.ziAlert }}</Icon> -->
      <div style="width:28px; height:28px; background-color:#aaa; color:#000"></div>
      <span class="ml-3">
        {{ $t('welcomeModal.head') }}
      </span>
    </div>
    <div class="modal-body text-center text-sm sm:text-left sm:text-base">
        <p>{{ $t('welcomeModal.title') }}</p>
        <br>
        <p>
          {{ $t('welcomeModal.content') }}
        </p>
        <br>
        <p>
          {{ $t('welcomeModal.footer') }}
          &nbsp;
          <router-link
            :to="{ name: 'home' }"
            class="text-primary"
          >
            {{ $t('welcomeModal.myCompanies') }}
          </router-link>
          &nbsp;
          {{ $t('welcomeModal.footerInMenu') }}
        </p>
        <Button
          large
          class="mt-10 mb-4 mx-auto"
          @click="$emit('close')"
        >
          <span>{{ $t('welcomeModal.fillRequisites') }}</span>
        </Button>
      </div>
      <span class="close-btn" @click="$emit('close')">
      <Icon>{{ icons.mdiClose }}</Icon>
    </span>
  </div>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  name: 'WelcomeModal',
  data () {
    return {
      icons: {
        mdiClose,
      },
    }
  },
}
</script>

<style lang="postcss" scoped>
  .modal {
    position: relative;
    @apply bg-gray text-lg;
  }
  .modal-header {
    padding: 15px;
    display: flex;
    align-items: center;
    color: #aaaaaa;
    @apply bg-gray-darkest;
  }
  .modal-body {
    padding: 20px;
    color: #aaaaaa;
  }
  @screen sm {
    .modal-header {padding: 25px;}
    .modal-body {padding: 30px 40px;}
  }
  .close-btn {
    position: absolute;
    top: 20px;
    right: 25px;
    color: #fff;
    cursor: pointer;
  }
</style>
