<template>
  <div class="container">
    <div class="py-12">
      <header class="header">
        <span class="header__title">{{ $t('requisites.requisites') }}</span>
      </header>
      <div class="flex justify-between">
        <TemplateCard
          :fields="requisites"
          template-name="requisites"
          :title="$t('requisites.about')"
        >
        </TemplateCard>
        <TemplateCard
          template-name="requisites"
          :title="$t('requisites.bankDetails')"
        >
        </TemplateCard>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateCard from '../components/TemplateCard.vue'

export default {
  name: 'RequisitesItem',
  components: {
    TemplateCard,
  },
  data () {
    return {
      requisites: {
        companyName: {},
        legalAddress: {},
        legalAddressPostcode: {},
        mailingAddress: {},
        mailingAddressPostCode: {},
        phone: {},
        fax: {},
        email: {},
        itn: {},
        iec: {},
        psrn: {},
        bankName: {},
        bankAddress: {},
        bankAccountNumber: {},
        correspondentAccountNumber: {},
        bic: {},
        okpo: {},
        swift: {},
        fullName: {},
        position: {},
      },
    }
  },
}
</script>

<style scoped lang="postcss">
  .header {
    @apply mb-3 text-sm items-center;
  }
  .header__title {
    font-size: 24px;
    @apply mb-6 block text-gray-lighter;
  }
    .card {
    width: calc(50% - 2px);
    padding-top: 60px;
  }
  .card__subtitle {
    top: -30px;
  }
  .card__row {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .card__col-left  label, .card__col-right  label {
    display: block;
    height: 20px;
    color: #2E2E2E;
    @apply px-2 text-sm;
  }
  .card__col-left {
    width: calc(45% - 2px);
    margin-bottom: 0;
  }
</style>
