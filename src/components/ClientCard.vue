<template>
  <div>
    <v-dialog
      v-model="templateListDialog"
      max-width="480"
      overlay-color="#0f0f0f"
      overlay-opacity="0.6"
    >
      <TemplateListModal
        :templates="templates"
        :current-template="currentTemplate"
        :visibility="templateListDialog"
        @delete="deleteClientTemplate"
        @cancel="restoreTemplate"
        @close="templateListDialog = false"
        @set-template="setTemplate"
      />
    </v-dialog>
    <v-dialog
      v-model="templateSaveDialog"
      max-width="650"
      overlay-color="#0f0f0f"
      overlay-opacity="0.6"
    >
      <TemplateSaveModal
        ref="templateSave"
        :loading="createTemplateLoading"
        :visibility="templateSaveDialog"
        @save="createClientTemplate"
        @close="templateSaveDialog = false"
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
        @cancel="saveBeforeCloseDialog = false"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div id="container" :class="[ isComponent ? 'bg-chaos-black rounded-lg relative' : 'container' ]">
      <span
        v-if="isComponent"
        class="absolute cursor-pointer"
        :style="{ top: '12px', right: '12px', zIndex: '10' }"
        @click="$emit('close')"
      >
        <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.780869" y1="1.3753" x2="8.78087" y2="11.3753" stroke="#9F9F9F" stroke-width="2"/>
          <line x1="8.78087" y1="1.6247" x2="0.780869" y2="11.6247" stroke="#9F9F9F" stroke-width="2"/>
        </svg>
      </span>
      <div :class="[ isComponent ? 'pt-5 px-4' : 'py-12' ]">
        <div>
          <header class="header">
            <span class="header__title">{{ $t('client.clientCard') }}</span>
            <div
              v-if="!isComponent"
              class="header__actions"
            >
              <ToggleButton
                v-if="!create"
                :value="editMode"
                small
                class="mr-2"
                @input="toggleEditMode"
              >
                <span>{{ $t('client.edit') }}</span>
              </ToggleButton>
              <Button
                text
                class="inline-block mt-3 md:text-left md:mt-0"
                @click="showModalList"
              >
                <span class="text-sm">{{ $t('client.clientCardPatterns') }}</span>
              </Button>
            </div>
          </header>
          <div class="card__radio-group lg:block">
            <RadioButton
              :value="clientType"
              :label="legalType"
              :disabled="!editMode"
              name="person-type"
              class="mr-6"
              @input="switchPersonType(legalType)"
            >
              <span>{{ $t('client.legalPersonAbr') }}</span>
            </RadioButton>
            <RadioButton
              :value="clientType"
              :label="naturalType"
              :disabled="!editMode"
              name="person-type"
              @input="switchPersonType(naturalType)"
            >
              <span>{{ $t('client.naturalPersonAbr') }}</span>
            </RadioButton>
          </div>
          <div class="flex justify-between relative">
            <TemplateCard
              ref="LEGAL"
              template-name="client"
              :fields="legalFieldsSettings"
              :item="client"
              :is-disabled="!editMode"
              :is-not-active="isNaturalPerson"
              :class="{ 'template-card': isNaturalPerson }"
              @update-template="updateTemplate"
              @update-value="updateValue"
            >
              <template v-slot:language>
                <div class="card__col-right">
                  <select
                    :value="client.language || $i18n.fallbackLocale"
                    :disabled="!editMode || !!updateLoading"
                    :class="{ 'appearance-none mx-2': !editMode || !!updateLoading }"
                    name="language-select"
                    style="background:transparent;"
                    @change="updateValue('language', $event.target.value)"
                  >
                    <option
                      v-for="opt of langs"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      <span class="leaders__num cursor-pointer" style="padding-right:0">
                        {{ opt.text }}
                      </span>
                    </option>
                  </select>
                </div>
              </template>
              <template v-slot:prepend>
                <RadioButton
                  :value="clientType"
                  :label="legalType"
                  :disabled="!editMode"
                  center
                  name="client-type"
                  @input="switchPersonType(legalType)"
                >
                  <span>{{ $t('client.legalPerson') }}</span>
                </RadioButton>
              </template>
              <template v-slot:append>
                <div :class="['text-center', { 'card__section--faded': isNaturalPerson }]">
                  <Button
                    v-if="!editMode"
                    :disabled="isNaturalPerson || !!updateLoading"
                    large
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('client.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :disabled="isNaturalPerson || !!updateLoading"
                    large
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    :disabled="isNaturalPerson"
                    text
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('client.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
            <TemplateCard
              ref="NATURAL"
              template-name="client"
              :fields="naturalFieldsSettings"
              :item="client"
              :is-disabled="!editMode"
              :is-not-active="!isNaturalPerson"
              :class="{ 'template-card': !isNaturalPerson }"
              @update-template="updateTemplate"
              @update-value="updateValue"
            >
              <template v-slot:language>
                <div class="card__col-right">
                  <select
                    :value="client.language || $i18n.fallbackLocale"
                    :disabled="!editMode || !!updateLoading"
                    :class="{ 'appearance-none mx-2': !editMode || !!updateLoading }"
                    name="language-select"
                    style="background:transparent;"
                    @change="updateValue('language', $event.target.value)"
                  >
                    <option
                      v-for="opt of langs"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      <span class="leaders__num cursor-pointer" style="padding-right:0">
                        {{ opt.text }}
                      </span>
                    </option>
                  </select>
                </div>
              </template>
              <template v-slot:prepend>
                <RadioButton
                  :value="clientType"
                  :label="naturalType"
                  :disabled="!editMode"
                  center
                  name="client-type"
                  @input="switchPersonType(naturalType)"
                >
                  <span>{{ $t('client.naturalPerson') }}</span>
                </RadioButton>
              </template>
              <template v-slot:append>
                <div :class="['text-center', { 'card__section--faded': !isNaturalPerson }]">
                  <Button
                    v-if="!editMode"
                    :disabled="!isNaturalPerson || !!updateLoading"
                    large
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('client.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :disabled="!isNaturalPerson || !!updateLoading"
                    large
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    :disabled="!isNaturalPerson"
                    text
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('client.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
          </div>
          <button
            v-if="!isComponent"
            class="back-to-list-btn"
            @click="$router.push({
              name: 'clients',
              params: {
                orgId,
              }
            }).catch(err => {})"
          >
            <Icon class="mr-2">
              {{ icons.mdiArrowLeft }}
            </Icon>
            {{ $t('client.backToClientsList') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { mdiArrowLeft } from '@mdi/js'

import { ClientType } from '@/graphql/enums'
import { GET_CLIENT, LIST_CLIENT_TEMPLATES } from '@/graphql/queries'
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
  CREATE_CLIENT_TEMPLATE,
  DELETE_CLIENT_TEMPLATE,
} from '@/graphql/mutations'

import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'
import TemplateSaveModal from '@/components/TemplateSaveModal.vue'
import TemplateListModal from '@/components/TemplateListModal.vue'
import TemplateCard from '@/components/TemplateCard.vue'

export default {
  name: 'ClientCard',
  components: {
    SaveBeforeCloseModal,
    TemplateSaveModal,
    TemplateListModal,
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
  },
  apollo: {
    listClientTemplates: {
      query: LIST_CLIENT_TEMPLATES,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
    getClient: {
      query: GET_CLIENT,
      variables () {
        return {
          id: this.$route.params.clientId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        this.setData(data.getClient)
      },
      skip () {
        return this.create
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      wasValidate: false,
      langs: [
        { value: 'en', text: 'English' },
        { value: 'ru', text: 'Русский' },
      ],
      saveBeforeCloseDialog: false,
      templateChanged: false,
      createTemplateLoading: false,
      deleteTemplateLoading: null,
      loading: false,
      updateLoading: null,
      templateListDialog: false,
      templateSaveDialog: false,
      clientType: null,
      isExpanded: false,
      editMode: false,
      expanded: [],
      legalFieldsSettings: {
        customUid: {
          defaultValueKey: 'uid',
          label: 'uid',
          placeholder: 'uid',
        },
        companyName: {
          ref: 'legalCompanyNameInput',
          rules: [v => !!v || this.$t('rule.required')],
          rows: 2,
        },
        legalAddress: {
          rows: 2,
        },
        legalAddressPostcode: {
          placeholder: 'postcode',
        },
        mailingAddress: {
          rows: 2,
        },
        mailingAddressPostcode: {
          placeholder: 'postcode',
        },
        phone: {},
        fax: {},
        email: {},
        itn: {},
        iec: {},
        psrn: {
          section: true,
        },
        bankName: {},
        bankAddress: {},
        bankAccountNumber: {
          placeholder: 'bankAccountNumberAbr',
        },
        correspondentAccountNumber: {
          placeholder: 'correspondentAccountNumberAbr',
        },
        bic: {},
        okpo: {},
        swift: {},
        ownerFullName: {},
        ownerJobPosition: {},
        contactPerson: {},
        consignee: {
          section: true,
          subtitle: 'shippingInfo',
        },
        shippingAddress: {
          label: 'deliveryAddress',
          placeholder: 'deliveryAddress',
          rows: 2,
        },
        importerContactPerson: {
          label: 'contactPerson',
          placeholder: 'contactPerson',
        },
        contactMobilePhone: {
          label: 'mobilePhone',
          placeholder: 'mobilePhone',
        },
        importerFax: {
          label: 'fax',
          placeholder: 'fax',
        },
        importerEmail: {
          label: 'email',
          placeholder: 'email',
        },
        legalTypeNote: {
          label: 'note',
          placeholder: 'note',
          section: true,
          subtitle: 'note',
          rows: 3,
        },
        language: {
          labelReadonly: true,
          section: true,
          subtitle: 'language',
          labelHint: 'languageDescription',
        },
      },
      naturalFieldsSettings: {
        customUid: {
          defaultValueKey: 'uid',
          label: 'uid',
          placeholder: 'uidAbr',
        },
        firstName: {
          ref: 'naturalFirstNameInput',
          rules: [v => !!v || this.$t('rule.required')],
        },
        lastName: {
          ref: 'naturalLastNameInput',
          rules: [v => !!v || this.$t('rule.required')],
        },
        middleName: {},
        passportId: {},
        mobilePhone: {},
        additionalPhone: {},
        naturalEmail: {
          label: 'email',
          placeholder: 'email',
        },
        address: {
          rows: 2,
        },
        deliveryAddress: {
          rows: 2,
        },
        naturalTypeNote: {
          label: 'note',
          placeholder: 'note',
          section: true,
          subtitle: 'note',
          rows: 3,
        },
        language: {
          labelReadonly: true,
          section: true,
          subtitle: 'language',
          labelHint: 'languageDescription',
        },
      },
      client: {
        id: null,
        uid: null,
        clientType: null,
        language: this.$i18n.fallbackLocale,
        template: {},
      },
      clientClone: {},
      icons: {
        mdiArrowLeft,
      },
    }
  },
  computed: {
    fieldsKeys () {
      return [
        ...this.legalFieldsKeys,
        ...this.naturalFieldsKeys,
      ]
    },
    templateFieldsKeys () {
      const fields = this.fieldsKeys.filter(k => k !== 'language')
      return [
        ...fields,
        'templateName',
      ]
    },
    legalFieldsKeys () {
      return Object.keys(this.legalFieldsSettings)
    },
    naturalFieldsKeys () {
      return Object.keys(this.naturalFieldsSettings)
    },
    safeClientType () {
      return this.clientType || ClientType.NATURAL
    },
    hasDeepChange () {
      return !deepEqual(this.client, this.clientClone)
    },
    currentTemplate () {
      let result = null
      const template = (this.client && this.client.template) || {}
      if (
        (
          template.templateName === null ||
          template.templateName === 'default'
        ) &&
        this.fieldsKeys.every(k => template[k] === null)
      ) {
        return 'default'
      }
      let cTemplate = {}
      this.templateFieldsKeys.forEach(k => {
        cTemplate[k] = template[k] || null
      })
      for (const t of this.templates) {
        let c = {}
        this.templateFieldsKeys.forEach(k => {
          c[k] = t[k] || null
        })
        if (deepEqual(cTemplate, c)) {
          result = t.id
          break
        }
      }
      return result
    },
    templates () {
      return (this.listClientTemplates && this.listClientTemplates.items) || []
    },
    legalType () {
      return ClientType.LEGAL
    },
    naturalType () {
      return ClientType.NATURAL
    },
    isLegalPerson () {
      return this.clientType === this.legalType
    },
    isNaturalPerson () {
      return this.clientType === this.naturalType
    },
  },
  watch: {
    saveBeforeCloseDialog (val) {
      !val && this.$off('confirm')
    },
    templateListDialog (val) {
      if (!this.create && !val && this.templateChanged) {
        this.update(this.clientType)
        this.templateChanged = false
      }
    },
    templateSaveDialog (val) {
      if (val) {
        setTimeout(() => {
          this.$refs.templateSave.focusInput()
        }, 0)
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
    async toggleEditMode () {
      this.editMode = !this.editMode
    },
    async checkChangesBeforeLeave (next) {
      if (this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            const isValid = this.validate(true)
            if (!isValid) {
              this.saveBeforeCloseDialog = false
              this.$vuetify.goTo('#container')
              return next(false)
            }
            try {
              await this.update(this.clientType, false)
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
    async openConfirmDialog () {
      this.saveBeforeCloseDialog = true
      return new Promise((resolve) => {
        this.$on('confirm', result => {
          resolve(result)
        })
      })
    },
    reset () {
      this.clientType = this.naturalType
      this.client = {
        id: null,
        uid: null,
        clientType: null,
        language: this.$i18n.fallbackLocale,
        template: {},
      }
      this.clientClone = cloneDeep(this.client)
    },
    validate (focus) {
      if (!this.wasValidate) return
      const type = this.clientType
      const validateFields = []
      let errorsCount = 0
      let fields = []
      const refs = this.$refs[type].$refs
      if (type === this.naturalType) {
        fields = this.naturalFieldsSettings
      } else {
        fields = this.legalFieldsSettings
      }
      for (const [, v] of Object.entries(fields)) {
        if (v.rules) {
          const field = refs[v.ref][0]
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
    async update (type, redirectAfterCreate = true) {
      this.wasValidate = true
      // TODO: validate input Uniq number
      const isValid = this.validate(true)
      if (!isValid) {
        this.$vuetify.goTo('#container')
        return
      }
      try {
        let input = {
          clientType: this.clientType,
          template: {},
        }
        this.fieldsKeys.forEach(key => {
          input[key] = this.client[key] || null
        })
        const template = this.client.template || {}
        this.templateFieldsKeys.forEach(key => {
          input.template[key] = template[key] || null
        })

        const query = this.create ? CREATE_CLIENT : UPDATE_CLIENT

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.client.id, input }

        this.updateLoading = type
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          const data = this.create
            ? response.data.createClient
            : response.data.updateClient
          this.setData(data)
          this.editMode = false
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            if (this.create && redirectAfterCreate) {
              this.$router.push({
                name: 'client',
                params: {
                  orgId: this.orgId,
                  clientId: data.id,
                },
              })
            } else {
              this.$vuetify.goTo('#container')
            }
          }
        }
      } catch (error) {
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      } finally {
        this.updateLoading = null
      }
    },
    setData (item) {
      if (!item) return
      this.clientType = item.clientType
      this.client = cloneDeep(item)
      this.clientClone = cloneDeep(this.client)
    },
    async createClientTemplate (templateName) {
      try {
        this.createTemplateLoading = true
        let input = {}
        const template = this.client.template || {}
        this.templateFieldsKeys.forEach(key => {
          input[key] = template[key] || null
        })
        input.templateName = templateName
        const fromClient = !this.create
          ? this.client.id
          : null

        await this.$apollo.mutate({
          mutation: CREATE_CLIENT_TEMPLATE,
          variables: {
            orgId: this.orgId,
            fromClient,
            input,
          },
        })
        this.$apollo.queries.listClientTemplates.refetch()
        this.client.template.templateName = templateName
        this.templateSaveDialog = false
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createTemplateLoading = false
      }
    },
    async deleteClientTemplate (id) {
      try {
        this.deleteTemplateLoading = id
        await this.$apollo.mutate({
          mutation: DELETE_CLIENT_TEMPLATE,
          variables: { id },
        })
        this.$apollo.queries.listClientTemplates.refetch()
      } catch (error) {
        throw new Error(error)
      } finally {
        this.deleteTemplateLoading = null
      }
    },
    edit () {
      this.editMode = true
      // this.$vuetify.goTo('#container')
    },
    switchPersonType (type) {
      this.clientType = type
    },
    updateTemplate (key, value) {
      if (!this.client.template.hasOwnProperty(key)) {
        this.$set(this.client.template, key, value)
      } else {
        this.client.template[key] = value
      }
    },
    updateValue (key, value) {
      this.validate()
      if (!this.client.hasOwnProperty(key)) {
        this.$set(this.client, key, value)
      } else {
        this.client[key] = value
      }
    },
    saveAsTemplate () {
      this.templateSaveDialog = true
    },
    showModalList () {
      this.templateListDialog = true
    },
    restoreTemplate () {
      this.client.template = this.templateCopy || { id: this.client.id }
      this.templateCopy = null
      this.templateListDialog = false
      this.templateChanged = false
    },
    setTemplate (id) {
      this.templateCopy = Object.assign({}, this.client.template)
      const template = this.templates.find(t => t.id === id)
      if (template) {
        let temp = Object.assign({}, template, { id: this.client.template.id })
        delete temp.__typename
        this.client.template = temp
      } else if (id === 'default') {
        this.client.template = { id: this.client.id }
      }
      this.templateChanged = true
    },
  },
}
</script>

<style lang="postcss" scoped>
  .header {
    @apply mb-3 text-sm items-center;
  }
  .header__title {
    font-size: 24px;
    @apply mb-6 block font-bold text-center text-gray-lighter;
  }
  .header__actions {
    @apply flex flex-col justify-around items-center;
  }
  .card__radio-group {
    display: flex;
    margin-top: 60px;
    margin-left: 30px;
  }
  .card__add-address-btn {
    height: 26px;
    margin-left: -30px;
    @apply flex justify-start items-center;
    @apply pl-1 pr-6;
    @apply border rounded-full text-sm;
  }
  .back-to-list-btn {
    @apply flex items-center;
    @apply py-2 pl-3 pr-6 mx-auto mt-20;
    @apply border rounded-full text-sm;
  }
  .back-to-list-btn:focus {
    @apply outline-none;
  }
  .template-card {
    display: none;
  }
  .template-card__triangle {
    width: 0;
    height: 0;
  }

  @screen md {
    .header {
      @apply flex;
    }
    .header__title {
      @apply mr-2 mb-0 inline text-base font-normal;
    }
    .header__actions {
      @apply flex-row justify-start;
    }
    .card__radio-group {
      display: none;
    }
    .card__add-address-btn {
      margin-left: 0;
    }
    .back-to-list-btn {
      @apply flex items-center;
      @apply py-2 pl-3 pr-6 mx-0 mt-6;
      @apply border rounded-full text-sm;
    }
    .template-card {
      display: block;
    }
    .template-card__triangle {
      width: 14px;
      height: 14px;
      transform: rotate(45deg);
      background-color: #0F0F0F;
      position: absolute;
      top: -7px;
      left: 95px;
    }
  }

  @screen lg {
    .header__actions {
      width: 33%;
    }
  }
</style>
