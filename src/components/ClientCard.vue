<template>
  <div>
    <!-- <v-dialog
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
    </v-dialog> -->

    <v-dialog
      v-model="saveBeforeCloseDialog"
      max-width="463"
    >
      <SaveBeforeCloseModal
        :text="$t('label.saveChangesBeforeClose')"
        :postScriptum="$t('label.saveChangesHint')"
        @dontSave="$emit('confirm', 1)"
        @cancel="$emit('confirm', 0)"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div
      id="container"
      :class="['pt-8 pb-12', isComponent ? 'bg-gray-900 relative px-4 sm:px-5' : 'container container--sm']"
    >
      <h1 class="text-2xl text-white font-semibold leading-tight mb-5">
        Создать нового клиента
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch">
          <div
            v-for="(tab, i) in tabs"
            :aria-selected="clientType === tab.value"
            :key="tab.value"
            :class="[
              'w-full sm:w-auto flex items-center justify-center rounded-t bg-gray-600',
              'select-none whitespace-no-wrap cursor-pointer',
              'transition-colors duration-100 ease-out px-10',
              { 'mr-1': i + 1 < tabs.length },
              tab.disabled ? 'pointer-events-none opacity-40' : 'focus:outline-none focus:text-white hover:text-white',
              clientType === tab.value ? 'text-white' : 'bg-opacity-30 text-gray-200',
            ]"
            :role="tab.disabled ? null : 'tab'"
            :tabindex="tab.disabled ? null : 0"
            @click="switchClientType(tab.value)"
            @keydown.enter.exact="switchClientType(tab.value)"
          >
            {{ tab.text }}
          </div>
        </div>
        <div
          v-if="clientType === ClientType.LEGAL"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Legal info -->
          <EntityLegalInfo :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <EntityLegalDetail :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <EntityContactList :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- Shipping -->
              <EntityShipping :item="client" @update="updateValue" />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- Extra -->
              <EntityExtra :item="client" @update="updateValue" />
            </div>
          </div>
        </div>
        <div
          v-else-if="clientType === ClientType.NATURAL"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Natural info -->
          <EntityNaturalInfo :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <EntityNaturalDetail :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <EntityContactList :item="client" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- Shipping -->
              <EntityShipping :item="client" natural @update="updateValue" />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- Shipping -->
              <EntityExtra :item="client" natural @update="updateValue" />
            </div>
          </div>
        </div>
        <div
          v-else-if="clientType === ClientType.OTHER"
          class="bg-gray-600 rounded-b-md sm:rounded-tr-md p-5 pt-6"
        >
          <!-- Legal info -->
          <EntityLegalInfo />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <EntityLegalDetail />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <EntityContactList />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- Shipping -->
              <EntityShipping />
            </div>
            <div class="w-full lg:w-1/2 lg:pl-5">
              <!-- Shipping -->
              <EntityExtra />
            </div>
          </div>
        </div>
      </div>
      <Button
        :loading="updateLoading"
        outlined
        class="w-40"
        @click="update()"
      >
        Сохранить
      </Button>
    </div>

    <!-- <div id="container" :class="[ isComponent ? 'bg-gray-900 rounded-lg relative' : 'container' ]">
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
              <SwitchInput
                v-if="!create"
                :value="editMode"
                small
                class="mr-2"
                @input="toggleEditMode"
              >
                <span>{{ $t('client.edit') }}</span>
              </SwitchInput>
              <Button
                outlined
                borderless
                class="inline-block mt-3 md:text-left md:mt-0"
                @click="showModalList"
              >
                <span class="text-sm">{{ $t('client.clientCardPatterns') }}</span>
              </Button>
            </div>
          </header>
          <div class="card__radio-group lg:block">
            <RadioInput
              :value="clientType"
              :label="legalType"
              :disabled="!editMode"
              name="person-type"
              class="mr-6"
              @input="switchPersonType(legalType)"
            >
              <span>{{ $t('client.legalPersonAbr') }}</span>
            </RadioInput>
            <RadioInput
              :value="clientType"
              :label="naturalType"
              :disabled="!editMode"
              name="person-type"
              @input="switchPersonType(naturalType)"
            >
              <span>{{ $t('client.naturalPersonAbr') }}</span>
            </RadioInput>
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
                    :ref="`${legalType}-languageInput`"
                    :value="client.language"
                    :disabled="!editMode || !!updateLoading"
                    required
                    class="simple-select mx-1"
                    name="language-select"
                    @change="updateLanguageInput"
                  >
                    <option
                      v-if="create && !client.language"
                      value=""
                    >
                      {{ $t('placeholder.notChosen') }}
                    </option>
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
                  <div
                    v-if="languageInputError[clientType]"
                    class="text-xs text-red-500 leading-none mx-2"
                  >
                    {{ languageInputError[clientType] }}
                  </div>
                </div>
              </template>
              <template v-slot:prepend>
                <RadioInput
                  :value="clientType"
                  :label="legalType"
                  :disabled="!editMode"
                  center
                  name="client-type"
                  @input="switchPersonType(legalType)"
                >
                  <span>{{ $t('client.legalPerson') }}</span>
                </RadioInput>
              </template>
              <template v-slot:append>
                <div :class="['text-center', { 'card__section--faded': isNaturalPerson }]">
                  <Button
                    v-if="!editMode"
                    :disabled="isNaturalPerson"
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('client.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :disabled="isNaturalPerson"
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    :disabled="isNaturalPerson"
                    outlined
                    borderless
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
                    :ref="`${naturalType}-languageInput`"
                    :value="client.language"
                    :disabled="!editMode || !!updateLoading"
                    required
                    class="simple-select mx-1"
                    name="language-select"
                    @change="updateLanguageInput"
                  >
                    <option
                      v-if="create && !client.language"
                      value=""
                    >
                      {{ $t('placeholder.notChosen') }}
                    </option>
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
                  <div
                    v-if="languageInputError[clientType]"
                    class="text-xs text-red-500 leading-none mx-2"
                  >
                    {{ languageInputError[clientType] }}
                  </div>
                </div>
              </template>
              <template v-slot:prepend>
                <RadioInput
                  :value="clientType"
                  :label="naturalType"
                  :disabled="!editMode"
                  center
                  name="client-type"
                  @input="switchPersonType(naturalType)"
                >
                  <span>{{ $t('client.naturalPerson') }}</span>
                </RadioInput>
              </template>
              <template v-slot:append>
                <div :class="['text-center', { 'card__section--faded': !isNaturalPerson }]">
                  <Button
                    v-if="!editMode"
                    :disabled="!isNaturalPerson"
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('client.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :disabled="!isNaturalPerson"
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    :disabled="!isNaturalPerson"
                    outlined
                    borderless
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('client.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
// TODO install in dependencies
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { ClientType } from '@/graphql/enums'
import { GET_CLIENT, GET_ORG_NEXT_CLIENT_UID, LIST_CLIENT_TEMPLATES } from '@/graphql/queries'
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
  CREATE_CLIENT_TEMPLATE,
  DELETE_CLIENT_TEMPLATE,
} from '@/graphql/mutations'

import EntityLegalInfo from './EntityLegalInfo.vue'
import EntityLegalDetail from './EntityLegalDetail.vue'
import EntityContactList from './EntityContactList.vue'
import EntityShipping from './EntityShipping.vue'
import EntityExtra from './EntityExtra.vue'
import EntityNaturalInfo from './EntityNaturalInfo.vue'
import EntityNaturalDetail from './EntityNaturalDetail.vue'
import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'
// import TemplateSaveModal from '@/components/TemplateSaveModal.vue'
// import TemplateListModal from '@/components/TemplateListModal.vue'
// import TemplateCard from '@/components/TemplateCard.vue'

export default {
  name: 'ClientCard',
  components: {
    EntityLegalInfo,
    EntityLegalDetail,
    EntityContactList,
    EntityShipping,
    EntityExtra,
    EntityNaturalInfo,
    EntityNaturalDetail,
    SaveBeforeCloseModal,
    // TemplateSaveModal,
    // TemplateListModal,
    // TemplateCard,
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
    getOrgNextClientUid: {
      query: GET_ORG_NEXT_CLIENT_UID,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        if (data) {
          this.client.uid = data.getOrgNextClientUid
          this.clientClone.uid = data.getOrgNextClientUid
        }
      },
      skip () {
        return !this.create
      },
      fetchPolicy: 'network-only',
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
      ClientType,
      activeClientType: null,
      languageInputError: {},
      wasValidate: false,
      saveBeforeCloseDialog: false,
      templateChanged: false,
      createTemplateLoading: false,
      deleteTemplateLoading: null,
      loading: false,
      updateLoading: false,
      templateListDialog: false,
      templateSaveDialog: false,
      clientType: null,
      isExpanded: false,
      editMode: false,
      expanded: [],
      legalFieldsSettings: {
        customUid: {
          disabled: true,
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
          disabled: true,
          defaultValueKey: 'uid',
          label: 'uid',
          placeholder: 'uid',
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
        language: '',
        template: {},
      },
      clientClone: {},
    }
  },
  computed: {
    tabs () {
      return [
        {
          value: ClientType.LEGAL,
          text: this.$t('client.legalPersonAbr'),
        },
        {
          value: ClientType.NATURAL,
          text: this.$t('client.naturalPersonAbr'),
        },
        {
          value: ClientType.OTHER,
          text: 'Другое',
          disabled: true,
        },
      ]
    },
    langs () {
      return [
        { value: 'en', text: 'English' },
        { value: 'zh-Hans', text: '简体' },
        { value: 'zh-Hant', text: '繁体' },
        { value: 'fr', text: 'Français' },
        { value: 'ru', text: 'Русский' },
        { value: 'uk', text: 'Український' },
      ]
    },
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
        this.templateFieldsKeys.filter(el => el !== 'templateName').every(k => !template[k])
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
      if (!val) {
        this.$emit('confirm', 0)
        this.$off('confirm')
      }
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
      if (this.editMode && this.hasDeepChange) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            const isValid = this.validate(true)
            if (!isValid) {
              this.saveBeforeCloseDialog = false
              this.$vuetify.goTo('#container')
              this.editMode = false
              this.$nextTick(() => {
                this.editMode = true
              })
              return
            }
            try {
              await this.update(this.clientType, false)
              this.saveBeforeCloseDialog = false
            } catch (error) {
              this.$logger.warn('Error: ', error)
            }
          } else {
            this.setData(this.clientClone)
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
            // const isValid = this.validate(true)
            // if (!isValid) {
            //   this.saveBeforeCloseDialog = false
            //   this.$vuetify.goTo('#container')
            //   return next(false)
            // }
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
          this.saveBeforeCloseDialog = false
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
      this.clientType = ClientType.LEGAL
      this.client = {
        id: null,
        uid: null,
        clientType: null,
        language: '',
        template: {},
      }
      this.languageInputError = {}
      this.clientClone = cloneDeep(this.client)
      this.$apollo.queries.getOrgNextClientUid.refetch()
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
      // validate language input separately
      const languageInputValidity = this.validateLanguageInput()
      if (!languageInputValidity.valid) {
        errorsCount += 1
        if (!firstNotValidInput) {
          firstNotValidInput = languageInputValidity.el
        }
      }
      if (focus && errorsCount && firstNotValidInput) {
        this.$vuetify.goTo(firstNotValidInput)
        const delay = this.isComponent ? 0 : 200
        setTimeout(() => {
          firstNotValidInput.focus()
        }, delay)
      }
      return !errorsCount
    },
    validateLanguageInput () {
      const type = this.clientType
      const el = this.$refs[`${type}-languageInput`]
      if (!el.validity.valid) {
        const message = this.$t('rule.requiredSelect')
        this.$set(this.languageInputError, type, message)
        return { message, el, valid: false }
      } else {
        this.$set(this.languageInputError, type, '')
        return { valid: true }
      }
    },
    resetValidation () {
      const type = this.clientType
      const validateFields = []
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
      validateFields.forEach(el => {
        el.resetValidation()
      })
    },
    updateLanguageInput (e) {
      const v = e.target.value
      const validity = this.validateLanguageInput()
      if (validity.valid) {
        this.updateValue('language', v)
      }
    },
    async update (type, redirectAfterCreate = true) {
      // this.wasValidate = true
      // // TODO: validate input Uniq number
      // const isValid = this.validate(true)
      // if (!isValid) {
      //   return
      // }
      try {
        let input = {
          clientType: this.clientType,
          template: {},
        }
        this.fieldsKeys.forEach(key => {
          input[key] = this.client[key] || null
        })
        // const template = this.client.template || {}
        // this.templateFieldsKeys.forEach(key => {
        //   input.template[key] = template[key] || null
        // })

        const query = this.create ? CREATE_CLIENT : UPDATE_CLIENT

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.client.id, input }

        this.updateLoading = true
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          const data = this.create
            ? response.data.createClient
            : response.data.updateClient
          this.setData(data)
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            this.editMode = false
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
        this.$notify({
          color: 'red',
          text: error.message,
        })
        throw new Error(error)
      } finally {
        this.updateLoading = false
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
    switchClientType (type) {
      this.clientType = type
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
      // this.validate()
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
      this.templateListDialog = false
    },
  },
}
</script>
