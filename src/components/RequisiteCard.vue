<template>
  <div>
    <v-dialog
      :value="isWelcome"
      max-width="500"
      overlay-color="#0f0f0f"
      overlay-opacity="0.6"
    >
      <WelcomeModal
        @close="$emit('update:isWelcome', false)"
      />
    </v-dialog>

    <v-dialog
      v-model="saveBeforeCloseDialog"
      max-width="520"
    >
      <SaveBeforeCloseModal
        :text="$t('label.saveChangesBeforeClose')"
        :postScriptum="$t('label.saveChangesHint')"
        @dontSave="$emit('confirm', 1)"
        @cancel="$emit('confirm', 0)"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div id="container" :class="[ isComponent ? 'view bg-gray-900 rounded-lg relative' : 'container' ]">
      <span
        v-if="isComponent"
        class="absolute cursor-pointer"
        :style="{ top: '12px', right: '12px', zIndex: '10' }"
        @click="$emit('close')"
      >
        <Icon>{{ icons.mdiClose }}</Icon>
      </span>
      <div :class="[ isComponent ? 'pt-5 px-4' : 'py-12' ]">
      <Button
        v-if="!isComponent && showFillLaterButton"
        class="mb-6 mx-auto md:mr-0 md:ml-auto"
        @click="$router.push({ name: 'home' })"
      >
        <span>{{ $t('requisite.fillLater') }}</span>
      </Button>
      <div class="md:flex md:items-center text-sm mb-3">
        <span class="block md:inline-block font-bold md:font-normal text-2xl md:text-base mb-6 md:mb-0 md:mr-2 text-center text-gray-150">
          {{ $t('requisite.requisitesOfMyCompany') }}
        </span>
        <div class="flex flex-col md:flex-row items-center">
          <SwitchToggle
            v-if="!create"
            :value="editMode"
            small
            @input="toggleEditMode"
          >
            <span>{{ $t('requisite.edit') }}</span>
          </SwitchToggle>
        </div>
      </div>
      <div class="requisite-card__radio-group">
        <RadioButton
          :value="cardType"
          :label="requisiteType.ABOUT"
          hide-details
          name="card-type"
          class="w-1/2 mr-2 text-sm"
          @input="cardType = requisiteType.ABOUT"
        >
          <span>{{ $t('requisite.about') }}</span>
        </RadioButton>
        <RadioButton
          :value="cardType"
          :label="requisiteType.BANK"
          hide-details
          name="card-type"
          class="w-4/5 text-sm"
          @input="cardType = requisiteType.BANK"
        >
          <span>{{ $t('requisite.bankDetails') }}</span>
        </RadioButton>
      </div>
      <div class="flex justify-between">
        <TemplateCard
          template-name="requisite"
          :title="$t('requisite.about')"
          :class="{ 'requisite-template-card': isBank }"
        >
          <template v-slot:items>
            <template v-for="(item, key) in about">
              <div
                v-if="item.section"
                class="flex justify-center pt-16"
                :key="`section-${key}`"
              >
                <div
                  v-if="item.subtitle"
                  class="text-gray-150 px-2 pb-4 text-center text-base font-semibold leading-snug tracking-wide"
                >
                  {{ $t(`requisite.${item.subtitle}`) }}
                </div>
              </div>
              <div
                :key="key"
                class="flex flex-col justify-between pb-8 relative lg:flex-row lg:flex-wrap lg:pb-2"
              >
                <div class="card__col-left card__col-left--full-width">
                  <label
                    class="truncate text-left"
                    :title="$t(`requisite.label.${item.label || key}`)"
                  >
                    {{ $t(`requisite.label.${item.label || key}`) }}
                  </label>
                  <TextField
                    :ref="item.ref || null"
                    :value="requisite[key]"
                    :placeholder="editMode ? $t('requisite.placeholder.fillFields') : '-'"
                    :rules="item.rules"
                    :disabled="!editMode"
                    class="template-card__input pt-1"
                    input-class="text-gray-300 focus:text-white placeholder-gray-300"
                    @input="updateRequisite(key, $event)"
                  />
                </div>
              </div>
            </template>
          </template>
          <template v-slot:append>
            <div class="text-center mt-32">
              <Button
                class="mb-4 mx-auto md:hidden"
                @click="update()"
              >
                <span>
                  {{ create ? $t('action.create') : $t('action.save') }}
                </span>
              </Button>
            </div>
          </template>
        </TemplateCard>
        <TemplateCard
          template-name="requisite"
          :title="$t('requisite.bankDetails')"
          :class="{ 'requisite-template-card': !isBank }"
        >
          <template v-slot:items>
            <template v-for="(item, key) in bank">
              <div
                v-if="item.section"
                class="flex justify-center pt-16"
                :key="`section-${key}`"
              >
                <div
                  v-if="item.subtitle"
                  class="text-gray-150 px-2 pb-4 text-center text-base font-semibold leading-snug tracking-wide"
                >
                  {{ $t(`requisite.${item.subtitle}`) }}
                </div>
              </div>
              <div
                :key="key"
                class="flex flex-col justify-between pb-8 relative lg:flex-row lg:flex-wrap lg:pb-2"
              >
                <div
                  :class="[
                    'card__col-left',
                    'card__col-left--full-width',
                  ]"
                >
                  <label
                    class="truncate text-left"
                    :title="$t(`requisite.label.${item.label || key}`)"
                  >
                    {{ $t(`requisite.label.${item.label || key}`) }}
                  </label>
                  <TextField
                    :value="requisite[key]"
                    :placeholder="editMode ? $t('requisite.placeholder.fillFields') : '-'"
                    :disabled="!editMode"
                    class="template-card__input pt-1"
                    input-class="text-gray-300 focus:text-white placeholder-gray-300"
                    @input="updateRequisite(key, $event)"
                  />
                </div>
              </div>
            </template>
          </template>
          <template v-slot:append>
            <div class="text-center mt-32">
              <Button
                v-if="!editMode"
                :loading="updateLoading"
                class="mb-4 mx-auto"
                @click="edit"
              >
                <span>
                  {{ $t('requisite.edit') }}
                </span>
              </Button>
              <Button
                v-else
                :loading="updateLoading"
                class="mb-4 mx-auto"
                @click="update()"
              >
                <span>
                  {{ create ? $t('action.create') : $t('action.save') }}
                </span>
              </Button>
            </div>
          </template>
        </TemplateCard>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { mdiClose } from '@mdi/js'

import WelcomeModal from '../components/WelcomeModal.vue'
import SaveBeforeCloseModal from '../components/SaveBeforeCloseModal.vue'

import TemplateCard from '../components/TemplateCard.vue'

import { GET_ORG_REQUISITE, GET_ORGS } from '../graphql/queries'
import { CREATE_REQUISITE, UPDATE_REQUISITE } from '../graphql/mutations'

export default {
  name: 'RequisiteCard',
  components: {
    WelcomeModal,
    SaveBeforeCloseModal,
    TemplateCard,
  },
  props: {
    orgId: {
      type: String,
      required: true,
    },
    create: {
      type: Boolean,
      default: false,
    },
    isComponent: {
      type: Boolean,
      default: false,
    },
    isWelcome: {
      type: Boolean,
      default: false,
    },
    showFillLaterButton: {
      type: Boolean,
      default: false,
    },
    isUserInitKeyStore: {
      type: String,
      default: '',
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
      updateLoading: false,
      editMode: false,
      wasValidate: false,
      saveBeforeCloseDialog: false,
      cardType: 'ABOUT',
      about: {
        name: {
          ref: 'companyNameInput',
          rules: [v => !!v || this.$t('rule.required')],
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
        website: {},
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
      icons: {
        mdiClose,
      },
    }
  },
  computed: {
    reqId () {
      return this.$route.params.reqId
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
      if (!val) {
        this.$emit('confirm', 0)
        this.$off('confirm')
      }
    },
  },
  created () {
    this.editMode = this.create
    if (this.create) {
      this.reset()
    }
  },
  methods: {
    edit () {
      this.editMode = true
    },
    async toggleEditMode () {
      if (this.editMode && this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            const isValid = this.validate(true)
            if (!isValid) {
              this.cardType = 'ABOUT'
              this.saveBeforeCloseDialog = false
              this.$vuetify.goTo('#container')
              this.editMode = false
              this.$nextTick(() => {
                this.editMode = true
              })
              return
            }
            try {
              await this.update(false)
              this.saveBeforeCloseDialog = false
            } catch (error) {
              this.$logger.warn('Error: ', error)
            }
          } else {
            this.setData(this.requisiteClone)
            this.resetValidation()
            this.editMode = false
            this.saveBeforeCloseDialog = false
          }
        } else {
          this.editMode = false
          this.$nextTick(() => {
            this.editMode = true
          })
          this.saveBeforeCloseDialog = false
        }
      } else {
        this.editMode = !this.editMode
      }
    },
    async checkChangesBeforeLeave (next) {
      if (this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            const isValid = this.validate(true)
            if (!isValid) {
              this.cardType = 'ABOUT'
              this.saveBeforeCloseDialog = false
              this.$vuetify.goTo('#container')
              return next(false)
            }
            try {
              await this.update(false)
              return next()
            } catch (error) {
              this.$logger.warn('Error: ', error)
              return next(false)
            }
          } else {
            return next()
          }
        } else {
          this.saveBeforeCloseDialog = false
          return next(false)
        }
      } else {
        localStorage.setItem(this.isUserInitKeyStore, 1)
        return next()
      }
    },
    async openConfirmDialog () {
      this.saveBeforeCloseDialog = true
      return new Promise((resolve) => {
        this.$on('confirm', result => {
          resolve(result)
        })
      })
    },
    validate () {
      if (!this.wasValidate) return
      const validateFields = []
      let errorsCount = 0
      const fields = this.about
      for (const [, v] of Object.entries(fields)) {
        if (v.rules) {
          const field = this.$refs[v.ref] && this.$refs[v.ref][0]
          if (field) {
            validateFields.push(field)
          }
        }
      }
      let firstNotValidInput = null
      validateFields.forEach(el => {
        const errCount = el.validate()
        if (errCount && !firstNotValidInput) {
          firstNotValidInput = el.$refs.input
        }
        errorsCount += errCount
      })
      if (focus && errorsCount && firstNotValidInput) {
        const delay = this.isComponent ? 0 : 200
        setTimeout(() => {
          firstNotValidInput.focus()
        }, delay)
      }
      return !errorsCount
    },
    resetValidation () {
      const validateFields = []
      const fields = this.about
      for (const [, v] of Object.entries(fields)) {
        if (v.rules) {
          const field = this.$refs[v.ref] && this.$refs[v.ref][0]
          if (field) {
            validateFields.push(field)
          }
        }
      }
      validateFields.forEach(el => {
        el.resetValidation()
      })
    },
    async update (redirectAfterCreate = true) {
      this.wasValidate = true
      // TODO: validate input Uniq number
      const isValid = this.validate(true)
      if (!isValid) {
        this.cardType = 'ABOUT'
        this.$vuetify.goTo('#container')
        return
      }
      this.updateLoading = true
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
        if (response && response.data) {
          const data = this.create
            ? response.data.createRequisite
            : response.data.updateRequisite
          this.setData(data)
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            this.editMode = false
            if (this.create && redirectAfterCreate) {
              this.$router.push({
                name: 'requisite',
                params: {
                  orgId: this.orgId,
                  reqId: data.id,
                },
              })
            } else {
              this.$vuetify.goTo('#container')
            }
          }
        }
        // update orgs query
        await this.$apollo.query({
          query: GET_ORGS,
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    setData (item) {
      if (!item) return
      this.requisite = cloneDeep(item)
      this.requisiteClone = cloneDeep(this.requisite)
    },
    updateRequisite (key, value) {
      this.validate()
      if (!this.requisite.hasOwnProperty(key)) {
        this.$set(this.requisite, key, value)
      } else {
        this.requisite[key] = value
      }
    },
    reset () {
      this.requisite = {}
      this.requisiteClone = cloneDeep(this.requisite)
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
    @apply block text-gray-150;
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
