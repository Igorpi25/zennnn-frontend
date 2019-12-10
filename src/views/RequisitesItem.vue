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
          :value="editCard"
          :label="requisitesType.ABOUT"
          hide-details
          name="card-type"
          class="w-1/2 mr-2 text-sm"
          @input="editCard = requisitesType.ABOUT"
        >
          <span>{{ $t('requisites.about') }}</span>
        </RadioButton>
        <RadioButton
          :value="editCard"
          :label="requisitesType.BANK"
          hide-details
          name="card-type"
          class="w-4/5 text-sm"
          @input="editCard = requisitesType.BANK"
        >
          <span>{{ $t('requisites.bankDetails') }}</span>
        </RadioButton>
      </div>
      <div class="flex justify-between">
        <TemplateCard
          template-name="requisites"
          :title="$t('requisites.about')"
          :class="{ 'requisites-template-card': isBank }"
        >
          <template v-slot:items>
            <div v-for="(item, key) in about" :key="key">
              <div class="card__row relative lg:pt-5">
                <div class="card__col-left card__col-left--full-width">
                  <label
                    class="truncate text-left"
                    :title="$t(`label.requisites.${item.label || key}`)"
                  >
                    {{ $t(`label.requisites.${item.label || key}`) }}
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
          :class="{ 'requisites-template-card': !isBank }"
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
                    :title="$t(`label.requisites.${item.label || key}`)"
                  >
                    {{ $t(`label.requisites.${item.label || key}`) }}
                  </label>
                  <TextField
                    :placeholder="$t('placeholder.requisites.fillFields')"
                    squared
                    colored
                    hide-details
                    class="pt-0"
                    @input="updateRequisites(key, $event)"
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
                @click="createReq()"
              >
                <span>{{ $t('action.save') }}</span>
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

import { GET_ORG_REQUISITE } from '../graphql/queries'
import { CREATE_REQUISITE } from '../graphql/mutations'

export default {
  name: 'RequisitesItem',
  components: {
    WelcomeModal,
    TemplateCard,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
  apollo: {
    getOrgRequisite: {
      query: GET_ORG_REQUISITE,
      variables () {
        return {
          id: this.reqId,
        }
      },
      skip () {
        return this.create
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      welcomeDialog: false,
      editMode: false,
      editCard: 'ABOUT',
      about: {
        name: {
          label: 'companyName',
        },
        nameEng: {
          label: 'companyNameEng',
        },
        legalAddress: {},
        legalAddressPostcode: {
          label: 'legalAddressPostCode',
        },
        mailingAddress: {},
        mailingAddressPostcode: {
          label: 'mailingAddressPostCode',
        },
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
        ownerFullName: {
          label: 'fullName',
          section: true,
          subtitle: 'directorOfCompany',
        },
        ownerJobPosition: {
          label: 'position',
        },
      },
      requisites: {},
    }
  },
  computed: {
    reqId () {
      return this.$route.params.reqId
    },
    orgId () {
      return this.$route.params.orgId
    },
    requisitesType () {
      return {
        ABOUT: 'ABOUT',
        BANK: 'BANK',
      }
    },
    isBank () {
      return this.editCard === this.requisitesType.BANK
    },
    fieldsKeys () {
      return [
        ...this.aboutFieldsKeys,
        ...this.bankFieldsKeys,
      ]
    },
    aboutFieldsKeys () {
      return Object.keys(this.about)
    },
    bankFieldsKeys () {
      return Object.keys(this.bank)
    },
  },
  methods: {
    async createReq () {
      try {
        let input = {}
        this.fieldsKeys.forEach(key => {
          input[key] = this.requisites[key] || null
        })
        const response = await this.$apollo.mutate({
          mutation: CREATE_REQUISITE,
          variables: { orgId: this.orgId, input },
        })
        if (response && response.data && response.data.createRequisite) {
          this.$router.push({
            name: 'requisites',
            params: {
              orgId: this.orgId,
              reqId: response.data.createRequisite.id,
            },
          })
        }
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.updateLoading = null
      }
    },
    updateRequisites (key, value) {
      if (!this.requisites.hasOwnProperty(key)) {
        this.$set(this.requisites, key, value)
      } else {
        this.requisites[key] = value
      }
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
