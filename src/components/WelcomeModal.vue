<template>
  <div class="relative bg-gray-600">
    <div class="text-center pt-10 pb-12 px-12">
      <div class="flex justify-center pb-6">
        <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" class="stroke-current text-blue-500">
          <path d="M40.551 25.4536L28.442 38.1272C26.2638 40.3054 23.3097 41.5288 20.2299 41.5288H17.9435C12.0648 41.5288 7.29826 36.7628 7.29826 30.8835C7.29826 28.0504 6.55229 25.2681 5.13614 22.8149L1.51514 16.543C0.960776 15.583 1.09191 14.4075 1.77078 13.597C2.91023 12.2337 5.08147 12.3987 5.98535 13.9624C11.255 23.09 5.15276 12.5199 11.1419 22.8939C7.0156 7.49504 7.0335 7.94666 7.17891 7.11149C7.17891 7.02778 7.28415 6.61068 7.42972 6.31955C8.61812 3.87847 12.1601 4.26106 12.8491 6.83004C13.0642 7.63295 16.4458 20.2543 16.6532 21.0286C16.6532 3.44355 16.6405 4.33267 16.6766 4.06227C16.8777 2.55515 18.1926 1.5324 19.4073 1.5324C21.0893 1.4503 22.4597 2.78717 22.4597 4.43162V21.5286C27.3136 4.59776 26.9108 5.78495 27.2695 5.23808C28.0246 4.04146 29.7328 3.53928 31.0945 4.30259C32.1743 4.84469 32.8569 6.23664 32.4937 7.59456L28.2662 23.3705V26.8004C28.2662 27.9504 29.6558 28.5262 30.4687 27.7133C34.3716 23.1949 34.0229 23.5871 34.2099 23.4125C36.2295 21.5408 38.9758 21.2655 39.8841 21.7197C41.3194 22.3368 41.7551 24.2496 40.551 25.4536V25.4536Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.2983 37.5765C17.2983 32.9973 20.3353 29.0141 24.5906 27.7065" stroke="#7E99D0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="text-white text-lg text-center font-semibold pb-5">
        {{ $t('welcomeModal.head') }}
      </div>
      <div class="text-center text-sm text-gray-100 pb-8">
        <p>{{ $t('welcomeModal.title') }}</p>
        <br>
        <p>
          {{ $t('welcomeModal.content') }}
        </p>
        <br>
        <p>
          {{ $t('welcomeModal.footer') }}
          &nbsp;
          {{ $t('welcomeModal.myCompanies') }}
          &nbsp;
          {{ $t('welcomeModal.footerInMenu') }}
        </p>
      </div>
      <Btn
        class="mx-auto"
        @click="$emit('close')"
      >
        {{ $t('welcomeModal.fillRequisites') }}
      </Btn>
    </div>
    <span
      class="absolute top-0 right-0 mt-3 mr-4 text-gray-200 hover:text-gray-100 cursor-pointer"
      @click="$emit('close')"
    >
      <i class="zi-close text-2xl" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'WelcomeModal',
}
</script>
