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

    <v-dialog
      v-model="saveBeforeCloseDialog"
      max-width="520"
    >
      <SaveBeforeCloseModal
        :text=" `${$t('paper.saveChanges')}${$t('paper.beforeClosing')}`"
        :postScriptum="$t('paper.ifNotSave')"
        @dontSave="$emit('confirm', 1)"
        @cancel="saveBeforeCloseDialog = false"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div class="py-12">
      <Button large class="mb-6 mx-auto md:mr-0 md:ml-auto">
        <span>{{ $t('action.fillLater') }}</span>
      </Button>
      <header class="requisite-header">
        <span class="requisite-header__title">{{ $t('requisites.requisitesOfMyCompany') }}</span>
      </header>
      <div class="requisite-card__radio-group">
        <RadioButton
          :value="cardType"
          :label="requisiteType.ABOUT"
          hide-details
          name="card-type"
          class="w-1/2 mr-2 text-sm"
          @input="cardType = requisiteType.ABOUT"
        >
          <span>{{ $t('requisites.about') }}</span>
        </RadioButton>
        <RadioButton
          :value="cardType"
          :label="requisiteType.BANK"
          hide-details
          name="card-type"
          class="w-4/5 text-sm"
          @input="cardType = requisiteType.BANK"
        >
          <span>{{ $t('requisites.bankDetails') }}</span>
        </RadioButton>
      </div>
      <div class="flex justify-between">
        <TemplateCard
          template-name="requisite"
          :title="$t('requisites.about')"
          :class="{ 'requisite-template-card': isBank }"
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
                    :value="requisite[key]"
                    :placeholder="$t('placeholder.requisites.fillFields')"
                    squared
                    colored-faded
                    hide-details
                    class="pt-0 text-left"
                    @input="updateRequisite(key, $event)"
                  />
                </div>
              </div>
            </div>
          </template>
          <template v-slot:apend>
            <div class="text-center mt-32">
              <Button
                large
                class="mb-4 mx-auto md:hidden"
                @click="update()"
              >
                <span>{{ $t('action.save') }}</span>
              </Button>
            </div>
          </template>
        </TemplateCard>
        <TemplateCard
          template-name="requisite"
          :title="$t('requisites.bankDetails')"
          :class="{ 'requisite-template-card': !isBank }"
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
                  <span class="requisite-card__subtitle">
                    {{ item.subtitle ? $t(`requisites.${item.subtitle}`) : '' }}
                  </span>
                  <label
                    class="truncate text-left"
                    :title="$t(`label.requisites.${item.label || key}`)"
                  >
                    {{ $t(`label.requisites.${item.label || key}`) }}
                  </label>
                  <TextField
                    :value="requisite[key]"
                    :placeholder="$t('placeholder.requisites.fillFields')"
                    squared
                    colored-faded
                    hide-details
                    class="pt-0 "
                    @input="updateRequisite(key, $event)"
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
                @click="update()"
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
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import WelcomeModal from '../components/WelcomeModal.vue'
import SaveBeforeCloseModal from '../components/SaveBeforeCloseModal.vue'

import TemplateCard from '../components/TemplateCard.vue'

import { GET_ORG_REQUISITE } from '../graphql/queries'
import { CREATE_REQUISITE, UPDATE_REQUISITE } from '../graphql/mutations'

export default {
  name: 'RequisiteItem',
  components: {
    WelcomeModal,
    SaveBeforeCloseModal,
    TemplateCard,
  },
  props: {
    create: {
      type: Boolean,
      default: false,
    },
  },
  async beforeRouteLeave (to, from, next) {
    if (this.hasDeepChange) {
      const r = await this.openConfirmDialog()
      if (r) {
        if (r === 2) {
          try {
            await this.update()
            return next()
          } catch (error) {
            this.$logger.warn('Error: ', error)
            return next(false)
          }
        } else {
          return next()
        }
      } else {
        return next(false)
      }
    } else {
      return next()
    }
  },
  apollo: {
    getOrgRequisite: {
      query: GET_ORG_REQUISITE,
      variables () {
        return {
          id: this.reqId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        this.setData(data.getOrgRequisite)
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
      saveBeforeCloseDialog: false,
      cardType: 'ABOUT',
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
      requisite: {},
      requisiteClone: {},
    }
  },
  computed: {
    reqId () {
      return this.$route.params.reqId
    },
    orgId () {
      return this.$route.params.orgId
    },
    requisiteType () {
      return {
        ABOUT: 'ABOUT',
        BANK: 'BANK',
      }
    },
    isBank () {
      return this.cardType === this.requisiteType.BANK
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
    hasDeepChange () {
      return !deepEqual(this.requisite, this.requisiteClone)
    },
  },
  watch: {
    saveBeforeCloseDialog (val) {
      !val && this.$off('confirm')
    },
  },
  methods: {
    async openConfirmDialog () {
      this.saveBeforeCloseDialog = true
      return new Promise((resolve) => {
        this.$on('confirm', result => {
          resolve(result)
        })
      })
    },
    async update () {
      try {
        let input = {}
        this.fieldsKeys.forEach(key => {
          input[key] = this.requisite[key] || null
        })

        const query = this.create ? CREATE_REQUISITE : UPDATE_REQUISITE

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.reqId, input }

        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data && response.data.createRequisite) {
          this.setData(response.data.createRequisite)
          this.$router.push({
            name: 'requisite',
            params: {
              orgId: this.orgId,
              reqId: response.data.createRequisite.id,
            },
          })
        }
        this.requisiteClone = cloneDeep(this.requisite)
      } catch (error) {
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = null
      }
    },
    setData (item) {
      if (!item) return
      this.requisite = cloneDeep(item)
      this.requisiteClone = cloneDeep(this.requisite)
    },
    updateRequisite (key, value) {
      if (!this.requisite.hasOwnProperty(key)) {
        this.$set(this.requisite, key, value)
      } else {
        this.requisite[key] = value
      }
    },
  },
}
</script>

<style scoped lang="postcss">
  .requisite-template-card {
    display: none;
  }
  .requisite-header__title {
    font-size: 24px;
    @apply block text-gray-lighter;
  }
  .requisite-card__radio-group {
    display: flex;
    margin-top: 40px;
  }
  .requisite-card__subtitle {
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
  .text-field--colored input::placeholder {
    color: red;
  }
   @screen sm {
    .requisite-card__radio-group {
      margin-left: 30px;
    }
  }
  @screen md {
    .requisite-template-card {
      display: block;
    }
    .requisite-header__title {
      @apply mb-4 mr-2 text-base;
    }
    .requisite-card__radio-group {
      display: none;
    }
  }
</style>
