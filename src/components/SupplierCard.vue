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
        @delete="deleteSupplierTemplate"
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
        @save="createSupplierTemplate"
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

    <div id="container" class="container container--sm pt-8 pb-12">
      <h1 class="text-2xl text-white font-semibold leading-tight mb-5">
        Создать нового поставщика
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch" />
        <div
          class="bg-gray-600 rounded-md p-5 pt-6"
        >
          <!-- Legal info -->
          <EntityLegalInfo supplier :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <EntitySupplierDetail :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <EntityContactList :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Branches -->
          <EntityBranchList :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- Extra -->
              <EntityExtra supplier :item="supplier" @update="updateValue" />
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
            <span class="header__title">{{ $t('supplier.supplierCard') }}</span>
            <div class="header__actions">
              <SwitchInput
                v-if="!create"
                :value="editMode"
                small
                class="mr-2"
                @input="toggleEditMode"
              >
                <span>{{ $t('supplier.edit') }}</span>
              </SwitchInput>
              <Button
                outlined
                borderless
                class="inline-block mt-3 md:mt-0"
                @click="showModalList"
              >
                <span>{{ $t('supplier.supplierCardPatterns') }}</span>
              </Button>
            </div>
          </header>
          <div class="card__radio-group">
            <RadioInput
              :value="editCard"
              :label="editCardTypes.SUPPLIER"
              name="card-type"
              class="mr-6"
              @input="editCard = editCardTypes.SUPPLIER"
            >
              <span>{{ $t('supplier.legalPersonAbr') }}</span>
            </RadioInput>
            <RadioInput
              :value="editCard"
              :label="editCardTypes.SHOPS"
              name="card-type"
              @input="editCard = editCardTypes.SHOPS"
            >
              <span>{{ $t('supplier.shops') }}</span>
            </RadioInput>
          </div>
          <div class="flex justify-between relative">
            <TemplateCard
              ref="supplier"
              template-name="supplier"
              :fields="fieldsSettings"
              :item="supplier"
              :is-disabled="!editMode"
              :title="$t('supplier.legalPerson')"
              :class="{ 'template-card': isShops }"
              @update-template="updateTemplate"
              @update-value="updateValue"
            >
              <template v-slot:language>
                <div class="card__col-right">
                  <select
                    ref="languageInput"
                    :value="supplier.language"
                    :disabled="!editMode || !!updateLoading"
                    required
                    class="simple-select mx-1"
                    name="language-select"
                    @change="updateLanguageInput"
                  >
                    <option
                      v-if="create && !supplier.language"
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
                    v-if="languageInputError"
                    class="text-xs text-red-500 leading-none mx-2"
                  >
                    {{ languageInputError }}
                  </div>
                </div>
              </template>
              <template v-slot:append>
                <div class="text-center">
                  <Button
                    v-if="!editMode"
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('supplier.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :loading="!!updateLoading"
                    class="mb-4 mx-auto"
                    @click="update()"
                  >
                    <span>{{ $t('supplier.save') }}</span>
                  </Button>
                  <Button
                    outlined
                    borderless
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('supplier.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
            <TemplateCard
              template-name="supplier"
              :title="$t('supplier.shops')"
              :class="{ 'template-card': !isShops }"
            >
              <template v-slot:items>
                <div v-for="(shop, index) in supplier.shops" :key="index">
                  <div class="flex flex-col justify-between relative pb-4 lg:flex-row lg:flex-wrap lg:pt-5">
                    <div class="card__col-left card__col-left--shops">
                      <div
                        class="card__expand-btn"
                        @click="expandShop(shop.id)"
                      >
                        {{ index + 1 }}
                        <Icon v-if="shop.expanded">{{ icons.mdiChevronUp }}</Icon>
                        <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                      </div>
                      <div
                        class="absolute"
                        style="right: -18px;"
                        @click="deleteShop(shop.id)"
                      >
                        <Icon
                          class="cursor-pointer"
                        >
                          {{ icons.mdiClose }}
                        </Icon>
                      </div>
                      <TextField
                        :value="shop.template && shop.template['name']"
                        :placeholder="(shop.template && shop.template['name']) || `${$t('supplier.placeholder.shopName')}`"
                        :disabled="!shop.editMode"
                        class="pt-0 template-card__label"
                        input-class="text-gray-300 focus:text-white placeholder-gray-300"
                        @input="updateShopTemplate(index, 'name', $event)"
                      />
                    </div>
                    <div class="card__col-right">
                      <TextArea
                        :value="shop.name"
                        :disabled="!shop.editMode"
                        :placeholder="!shop.editMode ? '-' : null"
                        squared
                        rows="2"
                        hide-details
                        class="template-card__input"
                        @input="updateShopValue(index, 'name', $event)"
                      />
                    </div>
                  </div>
                  <div
                    v-if="shop.expanded"
                    class="pb-16"
                  >
                    <div class="flex flex-col justify-between pb-8 lg:flex-row lg:flex-wrap lg:pb-0">
                      <template
                        v-for="([key, f]) in Object.entries(shopFieldsSettings).slice(1)"
                      >
                        <div
                          class="card__col-left card__col-left--shops"
                          :key="key"
                        >
                          <label>{{ $t(`supplier.label.${f.label || key}`) }}</label>
                          <TextField
                            :value="shop.template && shop.template[key]"
                            :placeholder="(shop.template && shop.template[key]) || $t(`supplier.placeholder.${f.label || key}`)"
                            :disabled="!shop.editMode"
                            class="pt-0 template-card__label"
                            input-class="text-gray-300 focus:text-white placeholder-gray-300"
                            @input="updateShopTemplate(index, key, $event)"
                          />
                        </div>
                        <div
                          class="card__col-right"
                          :key="`shop-${key}`"
                        >
                          <label></label>
                          <TextArea
                            :value="shop[key]"
                            :disabled="!shop.editMode"
                            :placeholder="!shop.editMode ? '-' : null"
                            squared
                            rows="1"
                            hide-details
                            class="template-card__input pb-4"
                            @input="updateShopValue(index, key, $event)"
                          />
                        </div>
                      </template>
                    </div>
                    <div class="text-center mt-16">
                      <template v-if="!create">
                        <Button
                          v-if="shop.editMode"
                          :loading="!!updateLoading"
                          class="mb-4 mx-auto"
                          @click="updateShop(shop.id)"
                        >
                          <span>{{ $t('supplier.save') }}</span>
                        </Button>
                        <Button
                          v-else
                          :loading="!!updateLoading"
                          class="mb-4 mx-auto"
                          @click="editShop(shop)"
                        >
                          <span>{{ $t('supplier.edit') }}</span>
                        </Button>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:append>
                <Button
                  outlined
                  @click="addShop"
                >
                  <template v-slot:icon>
                    <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
                  </template>
                  <span>{{ $t('supplier.addAddress') }}</span>
                </Button>
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

import {
  mdiPlusCircleOutline,
  mdiArrowLeft,
  mdiChevronUp,
  mdiChevronDown,
  mdiClose,
} from '@mdi/js'

import { uuid } from '@/util/helpers'
import { GET_SUPPLIER, LIST_SUPPLIER_TEMPLATES } from '@/graphql/queries'
import {
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  CREATE_SUPPLIER_TEMPLATE,
  DELETE_SUPPLIER_TEMPLATE,
} from '@/graphql/mutations'

import EntityLegalInfo from './EntityLegalInfo.vue'
import EntitySupplierDetail from './EntitySupplierDetail.vue'
import EntityContactList from './EntityContactList.vue'
import EntityExtra from './EntityExtra.vue'
import EntityBranchList from './EntityBranchList.vue'

import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'
// import TemplateSaveModal from '@/components/TemplateSaveModal.vue'
// import TemplateListModal from '@/components/TemplateListModal.vue'
// import TemplateCard from '@/components/TemplateCard.vue'
import { CREATE_SUPPLIER_SHOP, UPDATE_SUPPLIER_SHOP, DELETE_SUPPLIER_SHOP } from '../graphql/mutations'

export default {
  name: 'SupplierCard',
  components: {
    EntityLegalInfo,
    EntitySupplierDetail,
    EntityContactList,
    EntityExtra,
    EntityBranchList,
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
    listSupplierTemplates: {
      query: LIST_SUPPLIER_TEMPLATES,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
    getSupplier: {
      query: GET_SUPPLIER,
      variables () {
        return {
          id: this.supplierId,
        }
      },
      result ({ data, loading }) {
        if (loading) return
        this.setData(data.getSupplier)
      },
      skip () {
        return this.create
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  data () {
    return {
      languageInputError: '',
      wasValidate: false,
      saveBeforeCloseDialog: false,
      templateChanged: false,
      createTemplateLoading: false,
      deleteTemplateLoading: null,
      loading: false,
      updateLoading: false,
      templateListDialog: false,
      templateSaveDialog: false,
      editCard: 'SUPPLIER',
      editMode: false,
      shopFieldsSettings: {
        name: {
          label: 'shopName',
          placeholder: 'shopName',
        },
        address: {
          label: 'shopAddress',
          placeholder: 'shopAddress',
        },
        seller: {},
        workPhone: {},
        mobilePhone: {},
        wechat: {},
        email: {},
        qq: {},
        skype: {},
      },
      fieldsSettings: {
        companyNameSl: {
          ref: 'companyNameSlInput',
          rules: [v => !!v || this.$t('rule.required')],
          rows: 2,
          label: 'companyNameSl',
          inputLabel: 'selectedLanguage',
        },
        companyNameCl: {
          rows: 2,
        },
        website: {},
        companyType: {},
        fieldOfActivity: {},
        legalAddress: {},
        legalAddressPostcode: {},
        fax: {},
        ownerFullName: {},
        manufacturersAddress: {
          section: true,
          rows: 2,
        },
        manager: {},
        workPhone: {},
        mobilePhone: {},
        email: {},
        skype: {},
        qq: {},
        bankName: {
          section: true,
        },
        bankAddress: {
          rows: 2,
        },
        accountNumber: {},
        swift: {},
        responsiblePerson: {
          section: true,
          subtitle: 'storage',
        },
        deliveryAddress: {
          rows: 3,
        },
        contactNumber: {},
        note: {
          rows: 5,
          section: true,
          subtitle: 'note',
        },
        language: {
          labelReadonly: true,
          section: true,
          subtitle: 'language',
          labelHint: 'languageDescription',
        },
      },
      supplier: {
        id: null,
        language: '',
        template: {},
        shops: [],
      },
      supplierClone: {},
      icons: {
        mdiPlusCircleOutline,
        mdiArrowLeft,
        mdiChevronDown,
        mdiChevronUp,
        mdiClose,
      },
    }
  },
  computed: {
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
    supplierId () {
      return this.$route.params.supplierId
    },
    shopFieldsKeys () {
      return Object.keys(this.shopFieldsSettings)
    },
    templateFieldsKeys () {
      const fields = this.fieldsKeys.filter(k => k !== 'language')
      return [
        ...fields,
        'templateName',
      ]
    },
    fieldsKeys () {
      return Object.keys(this.fieldsSettings)
    },
    hasDeepChange () {
      const supplierWithoutShops = { id: this.supplier.id }
      const supplierCloneWithoutShops = { id: this.supplierClone.id }
      this.fieldsKeys.forEach(k => {
        supplierWithoutShops[k] = this.supplier[k]
        supplierCloneWithoutShops[k] = this.supplierClone[k]
      })
      return !deepEqual(supplierWithoutShops, supplierCloneWithoutShops)
    },
    hasShopsInEditMode () {
      const shops = this.supplier.shops || []
      return shops.some(el => el.editMode)
    },
    currentTemplate () {
      let result = null
      const shopCheckFields = this.shopFieldsKeys
      if (
        (
          this.supplier.template.templateName === null ||
          this.supplier.template.templateName === 'default'
        ) &&
        this.templateFieldsKeys.filter(el => el !== 'templateName').every(el => !this.supplier.template[el])
      ) {
        const shops = this.supplier.shops || []
        if (shops.every(s => {
          let template = s.template || {}
          return shopCheckFields.every(k => {
            return template[k] === null
          })
        })) {
          return 'default'
        }
      }
      let template = {}
      this.templateFieldsKeys.forEach(k => {
        template[k] = this.supplier.template[k] || null
      })
      for (const t of this.templates) {
        let c = {}
        this.templateFieldsKeys.forEach(k => {
          c[k] = t[k] || null
        })
        if (deepEqual(template, c)) {
          // TODO check shop fields
          result = t.id
          break
        }
      }
      return result
    },
    templates () {
      return (this.listSupplierTemplates && this.listSupplierTemplates.items) || []
    },
    editCardTypes () {
      return {
        SUPPLIER: 'SUPPLIER',
        SHOPS: 'SHOPS',
      }
    },
    isShops () {
      return this.editCard === this.editCardTypes.SHOPS
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
        this.update()
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
              this.editCard = this.editCardTypes.SUPPLIER
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
            this.setData(this.supplierClone)
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
      if (this.hasDeepChange || this.hasShopsInEditMode) {
        const r = await this.openConfirmDialog()
        if (r) {
          if (r === 2) {
            this.wasValidate = true
            // const isValid = this.validate(true)
            // if (!isValid) {
            //   this.editCard = this.editCardTypes.SUPPLIER
            //   this.saveBeforeCloseDialog = false
            //   this.$vuetify.goTo('#container')
            //   return next(false)
            // }
            try {
              await this.update(false, true)
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
      const id = uuid()
      this.supplier = {
        id,
        language: '',
        // template: { id },
        shops: [],
      }
      // this.addShop()
      // clone supplier for detect changes
      this.supplierClone = cloneDeep(this.supplier)
    },
    validate (focus) {
      if (!this.wasValidate) return
      const validateFields = []
      let errorsCount = 0
      const fields = this.fieldsSettings
      const refs = this.$refs['supplier'].$refs
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
      const el = this.$refs.languageInput
      if (!el.validity.valid) {
        const message = this.$t('rule.requiredSelect')
        this.languageInputError = message
        return { message, el, valid: false }
      } else {
        this.languageInputError = ''
        return { valid: true }
      }
    },
    resetValidation () {
      const validateFields = []
      const fields = this.fieldsSettings
      const refs = this.$refs['supplier'].$refs
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
    async update (redirectAfterCreate = true, fullUpdate) {
      // this.wasValidate = true
      // // TODO: validate input Uniq number
      // const isValid = this.validate(true)
      // if (!isValid) {
      //   return
      // }
      try {
        let input = {
          // template: {},
        }
        this.fieldsKeys.forEach(key => {
          input[key] = this.supplier[key] || null
        })
        // const template = this.supplier.template || {}
        // this.templateFieldsKeys.forEach(key => {
        //   input.template[key] = template[key] || null
        // })
        if (this.create || fullUpdate) {
          const supplierShops = this.supplier.shops || []
          input.shops = supplierShops.map(s => {
            let shop = {}
            this.shopFieldsKeys.forEach(key => {
              shop[key] = s[key] || null
            })
            // let sTemplate = s.template || {}
            // let template = {}
            // this.shopFieldsKeys.forEach(key => {
            //   template[key] = sTemplate[key] || null
            // })
            // shop.template = template
            return shop
          })
        }

        const query = this.create ? CREATE_SUPPLIER : UPDATE_SUPPLIER

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.supplier.id, input }

        this.updateLoading = true
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          const data = this.create
            ? response.data.createSupplier
            : response.data.updateSupplier
          this.setData(data)
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            this.editMode = false
            if (this.create && redirectAfterCreate) {
              this.$router.push({
                name: 'supplier',
                params: {
                  orgId: this.orgId,
                  supplierId: data.id,
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
      const shopsOld = this.supplier.shops || []
      const shops = (item.shops || []).slice().map(shop => {
        const old = shopsOld.find(el => el.id === shop.id) || {}
        const oldValues = old.editMode ? old : {}
        return {
          ...shop,
          ...oldValues,
          expanded: !!old.expanded,
          editMode: !!old.editMode,
        }
      })
      this.supplier = cloneDeep(Object.assign({}, item, { shops }))
      this.supplierClone = cloneDeep(this.supplier)
    },
    async createSupplierTemplate (templateName) {
      try {
        this.createTemplateLoading = true
        let input = {}
        const template = this.supplier.template || {}
        this.templateFieldsKeys.forEach(key => {
          input[key] = template[key] || null
        })
        input.templateName = templateName
        const fromSupplier = !this.create
          ? this.supplier.id
          : null

        await this.$apollo.mutate({
          mutation: CREATE_SUPPLIER_TEMPLATE,
          variables: {
            orgId: this.orgId,
            fromSupplier,
            input,
          },
        })
        this.$apollo.queries.listSupplierTemplates.refetch()
        this.supplier.template.templateName = templateName
        this.templateSaveDialog = false
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createTemplateLoading = false
      }
    },
    async deleteSupplierTemplate (id) {
      try {
        this.deleteTemplateLoading = id
        await this.$apollo.mutate({
          mutation: DELETE_SUPPLIER_TEMPLATE,
          variables: { id },
        })
        this.$apollo.queries.listSupplierTemplates.refetch()
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
    updateTemplate (key, value) {
      if (!this.supplier.template.hasOwnProperty(key)) {
        this.$set(this.supplier.template, key, value)
      } else {
        this.supplier.template[key] = value
      }
    },
    updateValue (key, value) {
      // this.validate()
      if (!this.supplier.hasOwnProperty(key)) {
        this.$set(this.supplier, key, value)
      } else {
        this.supplier[key] = value
      }
    },
    updateShopTemplate (index, key, value) {
      if (!this.supplier.shops[index].template) {
        this.$set(this.supplier.shops[index], 'template', {})
      }
      if (!this.supplier.shops[index].template.hasOwnProperty(key)) {
        this.$set(this.supplier.shops[index].template, key, value)
      } else {
        this.supplier.shops[index].template[key] = value
      }
    },
    updateShopValue (index, key, value) {
      if (!this.supplier.shops[index].hasOwnProperty(key)) {
        this.$set(this.supplier.shops[index], key, value)
      } else {
        this.supplier.shops[index][key] = value
      }
    },
    async addShop () {
      try {
        if (this.create) {
          const id = uuid()
          const shop = {
            id,
            template: {
              id,
            },
            expanded: true,
            editMode: true,
          }
          this.supplier.shops.push(shop)
        } else {
          const response = await this.$apollo.mutate({
            mutation: CREATE_SUPPLIER_SHOP,
            variables: { supplierId: this.supplierId, input: {} },
          })
          if (response && response.data && response.data.createSupplierShop) {
            this.supplier.shops
              .push(Object.assign(response.data.createSupplierShop, {
                editMode: true,
                expanded: true,
              }))
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    editShop (shop) {
      this.$set(shop, 'editMode', true)
    },
    async updateShop (shopId) {
      try {
        const shops = this.supplier.shops || []
        const shop = shops.find(el => el.id === shopId) || {}
        const expanded = shop.expanded
        const shopTemplate = shop.template || {}
        const input = {}
        const template = {}
        this.shopFieldsKeys.forEach(key => {
          input[key] = shop[key]
          template[key] = shopTemplate[key]
        })
        input.template = template
        const response = await this.$apollo.mutate({
          mutation: UPDATE_SUPPLIER_SHOP,
          variables: { id: shopId, input },
        })
        if (response && response.data && response.data.updateSupplierShop) {
          const index = this.supplier.shops.findIndex(el => el.id === shopId)
          const updatedItem = Object.assign(response.data.updateSupplierShop, {
            editMode: false,
            expanded,
          })
          this.supplier.shops.splice(index, 1, updatedItem)
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async deleteShop (id) {
      try {
        const response = await this.$apollo.mutate({
          mutation: DELETE_SUPPLIER_SHOP,
          variables: { id },
        })
        if (response && response.data && response.data.deleteSupplierShop) {
          this.supplier.shops = this.supplier.shops.filter(el => el.id !== id)
          // TODO remove from cache
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    expandShop (shopId) {
      const shops = this.supplier.shops || []
      const shop = shops.find(el => el.id === shopId)
      if (shop) {
        this.$set(shop, 'expanded', !shop.expanded)
      }
    },
    saveAsTemplate () {
      this.templateSaveDialog = true
    },
    showModalList () {
      this.templateListDialog = true
    },
    restoreTemplate () {
      this.supplier.template = this.templateCopy || { id: this.supplier.id }
      this.templateCopy = null
      this.templateListDialog = false
      this.templateChanged = false
    },
    setTemplate (id) {
      this.templateCopy = Object.assign({}, this.supplier.template)
      const template = this.templates.find(t => t.id === id)
      if (template) {
        let temp = Object.assign({}, template, { id: this.supplier.template.id })
        delete temp.__typename
        this.supplier.template = temp
      } else if (id === 'default') {
        this.supplier.template = { id: this.supplier.id }
      }
      this.templateChanged = true
      this.templateListDialog = false
    },
  },
}
</script>

<style lang="postcss" scoped>
  #container {
    color: #aaaaaa;
  }
  .header {
    @apply mb-3 text-sm items-center;
  }
  .header__title {
    font-size: 24px;
    @apply mb-6 block font-bold text-center text-gray-150;
  }
  .header__actions {
    @apply flex flex-col justify-around items-center;
  }
  .card__radio-group {
    display: flex;
    margin-top: 60px;
    margin-left: 30px;
  }
  .card__expand-btn {
    display: flex;
    align-items: center;
    position: absolute;
    left: -23px;
    font-size: 12px;
    transition: .5s;
    transform: rotate(0);
    user-select: none;
    cursor: pointer;
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
    .card__expand-btn {
      left: -28px;
      font-size: 16px;
    }
    .card__add-address-btn {
      margin-top: 52px;
      margin-left: 0;
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
    .card__expand-btn {
      left: -10px;
    }
     .header__actions {
      width: 35%;
    }
  }
</style>
