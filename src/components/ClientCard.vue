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
        :text=" `${$t('paper.saveChanges')}${$t('paper.beforeClosing')}`"
        :postScriptum="$t('paper.ifNotSave')"
        @dontSave="$emit('confirm', 1)"
        @cancel="saveBeforeCloseDialog = false"
        @save="$emit('confirm', 2)"
      />
    </v-dialog>

    <div id="container" class="container">
      <div class="py-12">
        <div>
          <header class="header">
            <span class="header__title">{{ $t('client.clientCard') }}</span>
            <div class="header__actions">
              <ToggleButton
                v-if="!create"
                :value="editMode"
                small
                class="mr-2"
                @input="editMode=!editMode"
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
              :disables="!editMode"
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
              template-name="client"
              :fields="legalFieldsSettings"
              :item="client[legalType]"
              :is-disabled="!editMode"
              :class="{'template-card': isNaturalPerson}"
              @update-template="updateTemplate"
              @update-value="updateValue"
            >
              <template v-slot:prepand>
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
              <template v-slot:apend>
                <div :class="['text-center', {'card__section--faded': isNaturalPerson}]">
                  <Button
                    large
                    :disabled="isNaturalPerson || updateLoading"
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    text
                    :disabled="isNaturalPerson"
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('client.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
            <TemplateCard
              template-name="client"
              :fields="naturalFieldsSettings"
              :item="client[naturalType]"
              :is-disabled="!editMode"
              :class="{ 'template-card': !isNaturalPerson }"
              @update-template="updateTemplate"
              @update-value="updateValue"
            >
              <template v-slot:prepand>
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
              <template v-slot:apend>
                <div :class="['text-center', {'card__section--faded': !isNaturalPerson}]">
                  <Button
                    large
                    :disabled="!isNaturalPerson || updateLoading"
                    class="mb-4 mx-auto"
                    @click="update(naturalType)"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    text
                    :disabled="!isNaturalPerson"
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
            class="back-to-list-btn"
            @click="$router.push({
              name: 'clients',
              params: {
                specId
              }
            })"
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
    specId: {
      type: String,
      required: true,
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  async beforeRouteLeave (to, from, next) {
    if (this.hasDeepChange) {
      this.saveBeforeCloseDialog = true
      const r = await this.openConfirmDialog()
      if (r) {
        if (r === 2) await this.update()
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },
  apollo: {
    listClientTemplates: {
      query: LIST_CLIENT_TEMPLATES,
      variables () {
        return {
          specId: this.$route.params.specId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
    getClient: {
      query: GET_CLIENT,
      variables () {
        return {
          specId: this.specId,
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
      saveBeforeCloseDialog: false,
      templateChanged: false,
      createTemplateLoading: false,
      deleteTemplateLoading: null,
      hasChange: false,
      loading: false,
      updateLoading: null,
      templateListDialog: false,
      templateSaveDialog: false,
      clientType: null,
      isExpanded: false,
      editMode: false,
      expanded: [],
      legalFieldsSettings: {
        uid: {},
        companyName: {
          rows: 2,
        },
        legalAddress: {
          rows: 2,
        },
        legalAddressPostCode: {
          placeholder: 'postCode',
        },
        mailingAddress: {
          rows: 2,
        },
        mailingAddressPostCode: {
          placeholder: 'postCode',
        },
        phone: {},
        fax: {},
        email: {},
        itn: {},
        iec: {},
        psrn: {
          section: true,
        },
        payeesBank: {},
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
        jobPosition: {},
        consignee: {
          section: true,
          subtitle: 'shippingInfo',
        },
        deliveryAddress: {
          rows: 2,
        },
        contactPerson: {},
        mobilePhone: {},
        note: {
          section: true,
          subtitle: 'note',
          rows: 3,
        },
      },
      naturalFieldsSettings: {
        uid: {
          placeholder: 'uidAbr',
        },
        firstName: {},
        lastName: {},
        middleName: {},
        passportId: {},
        mobilePhone: {},
        additionalPhone: {},
        address: {
          rows: 2,
        },
        deliveryAddress: {
          rows: 2,
        },
        note: {
          section: true,
          subtitle: 'note',
          rows: 3,
        },
      },
      client: {
        [ClientType.LEGAL]: {
          id: null,
          clientType: null,
          template: {},
        },
        [ClientType.NATURAL]: {
          id: null,
          clientType: null,
          template: {},
        },
      },
      clientClone: {},
      icons: {
        mdiArrowLeft,
      },
    }
  },
  computed: {
    fieldsKeys () {
      return this.isLegalPerson
        ? this.legalFieldsKeys
        : this.naturalFieldsKeys
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
      return !deepEqual(this.client[this.clientType], this.clientClone[this.clientType])
    },
    currentTemplate () {
      let result = null
      const templateFieldsKeys = ['templateName', ...this.fieldsKeys]
      const template = (this.client[this.clientType] && this.client[this.clientType].template) || {}
      if (
        (
          template.templateName === null ||
          template.templateName === 'default'
        ) &&
        this.fieldsKeys.every(el => template[el] === null)
      ) {
        return 'default'
      }
      let cTemplate = {}
      templateFieldsKeys.forEach(k => {
        cTemplate[k] = template[k] || null
      })
      for (const t of this.templates) {
        let c = {}
        templateFieldsKeys.forEach(k => {
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
      return this.listClientTemplates || []
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
      this.clientType = this.naturalType
      this.clientClone = cloneDeep(this.client)
    }
  },
  methods: {
    async openConfirmDialog () {
      return new Promise((resolve) => {
        this.$on('confirm', result => {
          resolve(result)
        })
      })
    },
    async update (type) {
      try {
        const templateFieldsKeys = ['templateName', ...this.fieldsKeys]
        const specId = this.specId
        let input = {
          specId,
          clientType: this.clientType,
          template: {},
        }
        if (!this.create) {
          input.id = this.client[this.clientType].id
          input.template.id = this.client[this.clientType].id
        }
        this.fieldsKeys.forEach(key => {
          input[key] = this.client[this.clientType][key] || null
        })
        templateFieldsKeys.forEach(key => {
          input.template[key] = this.client[this.clientType].template[key] || null
        })

        this.$logger.info('udpate item', input)

        const query = this.create ? CREATE_CLIENT : UPDATE_CLIENT

        this.updateLoading = type
        const response = await this.$apollo.mutate({
          mutation: query,
          variables: { input },
        })
        if (response && response.data && response.data.createClient) {
          this.setData(response.data.createClient)
          this.$router.push({
            name: 'client',
            params: {
              specId,
              clientId: response.data.createClient.id,
            },
          })
        }
        this.clientClone = cloneDeep(this.client)
        this.editMode = false
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.updateLoading = null
      }
    },
    setData (item) {
      if (!item) return
      this.clientType = item.clientType
      this.client[this.clientType] = cloneDeep(item)
      this.clientClone = cloneDeep(this.client)
    },
    async createClientTemplate (templateName) {
      try {
        this.createTemplateLoading = true
        let input = {
          templateName,
          specId: this.specId,
        }
        for (let [key, val] of Object.entries(this.client[this.clientType].template)) {
          // id created on server
          // __typename should not be sent
          // templateName setted from input
          if (key !== 'id' && key !== '__typename' && key !== 'templateName' && val) {
            input[key] = val
          }
        }

        this.$logger.info('save as template', input)

        await this.$apollo.mutate({
          mutation: CREATE_CLIENT_TEMPLATE,
          variables: {
            input,
          },
        })
        this.$apollo.queries.listClientTemplates.refetch()
        this.client[this.clientType].template.templateName = templateName
        await this.$apollo.mutate({
          mutation: UPDATE_CLIENT,
          variables: {
            input: {
              id: this.client[this.clientType].id,
              template: {
                templateName: templateName,
              },
            },
          },
        })
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
      this.$vuetify.goTo('#container')
    },
    switchPersonType (type) {
      this.clientType = type
    },
    updateTemplate (key, value) {
      if (!this.client[this.clientType].template.hasOwnProperty(key)) {
        this.$set(this.client[this.clientType].template, key, value)
      } else {
        this.client[this.clientType].template[key] = value
      }
    },
    updateValue (key, value) {
      if (!this.client[this.clientType].hasOwnProperty(key)) {
        this.$set(this.client[this.clientType], key, value)
      } else {
        this.client[this.clientType][key] = value
      }
    },
    saveAsTemplate () {
      this.templateSaveDialog = true
    },
    showModalList () {
      this.templateListDialog = true
    },
    restoreTemplate () {
      this.client[this.clientType].template = this.templateCopy || { id: this.client[this.clientType].id }
      this.templateCopy = null
      this.templateListDialog = false
      this.templateChanged = false
    },
    setTemplate (id) {
      this.templateCopy = Object.assign({}, this.client[this.clientType].template)
      const template = this.templates.find(t => t.id === id)
      if (template) {
        let temp = Object.assign({}, template, { id: this.client[this.clientType].template.id })
        delete temp.__typename
        this.client[this.clientType].template = temp
      } else if (id === 'default') {
        this.client[this.clientType].template = { id: this.client[this.clientType].id }
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
