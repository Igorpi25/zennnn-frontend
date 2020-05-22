<template>
  <div>

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
      <span
        v-if="isComponent"
        class="absolute top-0 right-0 z-10 pt-3 pr-3"
      >
        <i
          class="zi-close text-2xl text-gray-100 hover:text-white cursor-pointer"
          @click="$emit('close')"
        />
      </span>
      <h1 class="text-2xl text-white font-semibold leading-tight mb-5">
        {{ create ? $t('supplier.createTitle') : $t('supplier.editTitle') }}
      </h1>
      <div class="bg-gray-800 rounded-md p-sm mb-12">
        <div class="h-11 flex overflow-x-auto overflow-scroll-touch" />
        <div
          class="bg-gray-600 rounded-md p-5 pt-6"
        >
          <!-- Legal info -->
          <LegalInfo supplier :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Detail -->
          <SupplierDetail :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Contacts -->
          <ContactList :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <!-- Branches -->
          <BranchList :item="supplier" @update="updateValue" />
          <!-- Divider -->
          <div class="mt-10 border-t border-gray-400" />
          <div class="flex flex-wrap pb-5">
            <div class="w-full lg:w-1/2 lg:pr-5">
              <!-- ExtraInfo -->
              <ExtraInfo supplier :item="supplier" @update="updateValue" />
            </div>
          </div>
        </div>
      </div>
      <Button
        :loading="updateLoading"
        outlined
        merge-class="w-40"
        @click="update()"
      >
        {{ $t('client.save') }}
      </Button>
    </div>

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

import { GET_SUPPLIER, LIST_SUPPLIER_TEMPLATES } from '../graphql/queries'
import {
  CREATE_SUPPLIER,
  UPDATE_SUPPLIER,
  CREATE_SUPPLIER_TEMPLATE,
  DELETE_SUPPLIER_TEMPLATE,
  CREATE_SUPPLIER_SHOP,
  UPDATE_SUPPLIER_SHOP,
  DELETE_SUPPLIER_SHOP,
} from '../graphql/mutations'
import { uuid } from '../util/helpers'

import LegalInfo from './CompanyDetail/LegalInfo.vue'
import SupplierDetail from './CompanyDetail/SupplierDetail.vue'
import ContactList from './CompanyDetail/ContactList.vue'
import ExtraInfo from './CompanyDetail/ExtraInfo.vue'
import BranchList from './CompanyDetail/BranchList.vue'
import SaveBeforeCloseModal from './SaveBeforeCloseModal.vue'

export default {
  name: 'SupplierCard',
  components: {
    LegalInfo,
    SupplierDetail,
    ContactList,
    ExtraInfo,
    BranchList,
    SaveBeforeCloseModal,
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
          color: 'error',
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
