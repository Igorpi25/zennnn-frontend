<template>
  <div class="relative bg-gray-600">
    <div class="text-center pt-10 pb-12 px-12">
      <div class="flex justify-center pb-6">
        <img src="@/assets/icons/colorful/Hello48.svg" />
      </div>
      <div class="text-white text-lg text-center font-semibold pb-5">
        {{ $t('welcomeModal.head') }}
      </div>
      <div class="text-center text-sm text-gray-100 pb-8">
        <p>{{ $t('welcomeModal.title') }}</p>
        <br />
        <p>
          {{ $t('welcomeModal.content') }}
        </p>
        <br />
        <p>
          {{ $t('welcomeModal.footer') }}
          &nbsp;
          {{ $t('welcomeModal.myCompanies') }}
          &nbsp;
          {{ $t('welcomeModal.footerInMenu') }}
        </p>
      </div>
      <Btn class="mx-auto" @click="$emit('close')">
        {{ $t('welcomeModal.fillRequisites') }}
      </Btn>
    </div>
    <span
      class="
        absolute
        top-0
        right-0
        mt-3
        mr-4
        text-gray-200
        hover:text-gray-100
        cursor-pointer
      "
      @click="$emit('close')"
    >
      <Icon>
        {{ icons.ziCloseWindow }}
      </Icon>
    </span>
  </div>
</template>

<script>
import { ziCloseWindow } from '@zennnn/icons'
import { Btn, Icon } from '@zennnn/core'

export default {
  name: 'WelcomeModal',
  components: {
    Btn,
    Icon,
  },
  data() {
    return {
      icons: {
        ziCloseWindow,
      },
    }
  },
}
</script>
