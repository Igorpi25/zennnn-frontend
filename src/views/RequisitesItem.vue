<template>
  <div class="container">

    <v-dialog
      v-model="welcomeDialog"
      max-width="590"
      overlay-color="#0f0f0f"
      overlay-opacity="0.6"
    >
      <WelcomeModal
        @close="welcomeDialog = false"
      />
    </v-dialog>

    <div class="py-12">
      <header class="requisites-header">
        <span class="requisites-header__title">{{ $t('requisites.requisites') }}</span>
        <span class="requisites-header__action">
          <Button large>
            <span>{{ $t('action.fillLater') }}</span>
          </Button>
        </span>
      </header>
      <div class="requisites-card__radio-group">
        <RadioButton
          :value="editCardTypes.BANK"
          :input-value="editCard"
          hide-details
          name="card-type"
          class="w-1/2 mr-2 text-sm"
          @input="editCard = editCardTypes.BANK"
        >
          <span>{{ $t('requisites.about') }}</span>
        </RadioButton>
        <RadioButton
          :value="editCardTypes.ABOUT"
          :input-value="editCard"
          hide-details
          name="card-type"
          class="w-4/5 text-sm"
          @input="editCard = editCardTypes.ABOUT"
        >
          <span>{{ $t('requisites.bankDetails') }}</span>
        </RadioButton>
      </div>
      <div class="flex justify-between">
        <TemplateCard
          template-name="requisites"
          :title="$t('requisites.about')"
          :class="{ 'requisites-template-card': isAbout }"
        >
          <template v-slot:items>
            <div v-for="(item, key) in about" :key="key">
              <div class="card__row relative lg:pt-5">
                <div class="card__col-left card__col-left--full-width">
                  <label
                    class="truncate text-left"
                    :title="$t(`label.requisites.${key}`)"
                  >
                    {{ $t(`label.requisites.${key}`) }}
                  </label>
                  <TextField
                    :placeholder="$t('placeholder.requisites.fillFields')"
                    squared
                    colored
                    hide-details
                    class="pt-0 text-left"
                  />
                </div>
              </div>
            </div>
          </template>
        </TemplateCard>
        <TemplateCard
          template-name="requisites"
          :title="$t('requisites.bankDetails')"
          :class="{ 'requisites-template-card': !isAbout }"
        >
          <template v-slot:items>
            <div v-for="(item, key) in bank" :key="key">
              <div class="card__row relative lg:pt-5">
                <div
                  :class="[
                    'card__col-left',
                    'card__col-left--full-width',
                    {'card__col-left--section': item.section}
                  ]"
                >
                  <span class="requisites-card__subtitle">
                    {{ item.subtitle ? $t(`requisites.${item.subtitle}`) : '' }}
                  </span>
                  <label
                    class="truncate text-left"
                    :title="$t(`label.requisites.${key}`)"
                  >
                    {{ $t(`label.requisites.${key}`) }}
                  </label>
                  <TextField
                    :placeholder="$t('placeholder.requisites.fillFields')"
                    squared
                    colored
                    hide-details
                    class="pt-0"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-slot:apend>
            <div class="text-center mt-32">
              <Button
                large
                class="mb-4 mx-auto"
              >
                <span>{{ $t('client.save') }}</span>
              </Button>
              <Button
                text
                class="mx-auto"
              >
                <span class="text-sm">{{ $t('supplier.saveAsPattern') }}</span>
              </Button>
            </div>
          </template>
        </TemplateCard>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomeModal from '../components/WelcomeModal.vue'
import TemplateCard from '../components/TemplateCard.vue'

export default {
  name: 'RequisitesItem',
  components: {
    WelcomeModal,
    TemplateCard,
  },
  data () {
    return {
      welcomeDialog: true,
      editCard: 'ABOUT',
      about: {
        companyName: {},
        companyNameEng: {},
        legalAddress: {},
        legalAddressPostCode: {},
        mailingAddress: {},
        mailingAddressPostCode: {},
        phone: {},
        fax: {},
        email: {},
        itn: {},
        iec: {},
        psrn: {},
      },
      bank: {
        bankName: {},
        bankAddress: {},
        bankAccountNumber: {},
        correspondentAccountNumber: {},
        bic: {},
        okpo: {},
        swift: {},
        fullName: {
          section: true,
          subtitle: 'directorOfCompany',
        },
        position: {},
      },
    }
  },
  computed: {
    editCardTypes () {
      return {
        ABOUT: 'ABOUT',
        BANK: 'BANK',
      }
    },
    isAbout () {
      return this.editCard === this.editCardTypes.ABOUT
    },
  },
}
</script>

<style scoped lang="postcss">
  .requisites-template-card {
    display: none;
  }
  .requisites-header {
    @apply mb-3 text-sm flex flex-col;
  }
  .requisites-header__title {
    font-size: 18px;
    @apply mb-4 block text-gray-lighter;
  }
  .requisites-card__radio-group {
    display: flex;
    margin-top: 40px;
  }
  .requisites-card__subtitle {
    position: absolute;
    top: 35px;
    left: 50%;
    transform: translateX(-50%);
    color: #9F9F9F;
    letter-spacing: 0.03em;
    font-size: 16px;
    line-height: 135%;
    font-weight: 600;
  }
   @screen sm {
    .requisites-card__radio-group {
      margin-left: 30px;
    }
  }
  @screen md {
    .requisites-template-card {
      display: block;
    }
    .requisites-header {
      @apply flex-row justify-between items-center;
    }
    .requisites-header__title {
      font-size: 24px;
      @apply m-0;
    }
    .requisites-card__radio-group {
      display: none;
    }
  }
</style>
