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
            <span class="header__title">{{ $t('supplier.supplierCard') }}</span>
            <div class="header__actions">
              <ToggleButton
                v-if="!create"
                :value="editMode"
                small
                class="mr-2"
                @input="toggleEditMode"
              >
                <span>{{ $t('supplier.edit') }}</span>
              </ToggleButton>
              <Button
                text
                class="inline-block mt-3 md:mt-0"
                @click="showModalList"
              >
                <span>{{ $t('supplier.supplierCardPatterns') }}</span>
              </Button>
            </div>
          </header>
          <div class="card__radio-group">
            <RadioButton
              :value="editCard"
              :label="editCardTypes.SUPPLIER"
              :disabled="!editMode"
              name="card-type"
              class="mr-6"
              @input="editCard = editCardTypes.SUPPLIER"
            >
              <span>{{ $t('supplier.legalPersonAbr') }}</span>
            </RadioButton>
            <RadioButton
              :value="editCard"
              :label="editCardTypes.SHOPS"
              :disabled="!editMode"
              name="card-type"
              @input="editCard = editCardTypes.SHOPS"
            >
              <span>{{ $t('supplier.shops') }}</span>
            </RadioButton>
          </div>
          <div class="flex justify-between relative">
            <!-- <div class="partner-card__triangle"></div> -->
            <TemplateCard
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
                    :value="supplier.language || $i18n.fallbackLocale"
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
              <template v-slot:append>
                <div class="text-center">
                  <Button
                    v-if="!editMode"
                    :disabled="!!updateLoading"
                    large
                    class="mb-4 mx-auto"
                    @click="edit"
                  >
                    <span>{{ $t('client.edit') }}</span>
                  </Button>
                  <Button
                    v-else
                    :disabled="!editMode"
                    large
                    class="mb-4 mx-auto"
                    @click="update"
                  >
                    <span>{{ $t('client.save') }}</span>
                  </Button>
                  <Button
                    text
                    class="mx-auto"
                    @click="saveAsTemplate"
                  >
                    <span class="text-sm">{{ $t('supplier.saveAsPattern') }}</span>
                  </Button>
                </div>
              </template>
            </TemplateCard>
            <!-- TODO TemplateCard for each shop -->
            <TemplateCard
              template-name="supplier"
              :title="$t('supplier.shops')"
              :class="{ 'template-card': !isShops }"
            >
              <template v-slot:items>
                <div v-for="(shop, index) in supplier.shops" :key="index">
                  <div class="flex flex-col justify-between pb-8 relative lg:flex-row lg:flex-wrap lg:pb-0 lg:pt-5">
                    <div class="card__col-left card__col-left--shops">
                      <div
                        class="card__expand-btn"
                        @click="expandShop(index)"
                      >
                        {{ index + 1 }}
                        <Icon v-if="expanded.includes(index)">{{ icons.mdiChevronUp }}</Icon>
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
                        :placeholder="(shop.template && shop.template['name']) || `${$t('placeholder.supplier.shopName')}`"
                        :disabled="!expanded.includes(index)"
                        squared
                        hide-details
                        class="pt-0 template-card__label"
                        @input="updateShopTemplate(index, 'name', $event)"
                      />
                    </div>
                    <div class="card__col-right">
                      <TextArea
                        :value="shop.name"
                        :disabled="!expanded.includes(index)"
                        squared
                        rows="2"
                        hide-details
                        class="template-card__input"
                        @input="updateShopValue(index, 'name', $event)"
                      />
                    </div>
                  </div>
                  <div
                    v-if="expanded.includes(index)"
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
                          <label>{{ $t(`label.supplier.${f.label || key}`) }}</label>
                          <TextField
                            :value="shop.template && shop.template[key]"
                            :placeholder="(shop.template && shop.template[key]) || $t(`placeholder.supplier.${f.label || key}`)"
                            squared
                            hide-details
                            class="pt-0 template-card__label"
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
                            squared
                            rows="1"
                            hide-details
                            @input="updateShopValue(index, key, $event)"
                          />
                        </div>
                      </template>
                    </div>
                    <div class="text-center mt-16">
                      <Button
                        v-if="!create"
                        large
                        :disabled="!!updateLoading"
                        class="mb-4 mx-auto"
                        @click="updateShop(shop.id, index)"
                      >
                        <span>{{ $t('supplier.save') }}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:append>
                <Button
                  outline
                  white
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
          <button
            v-if="!isComponent"
            class="back-to-list-btn"
            @click="$router.push({
              name: 'suppliers',
              params: {
                orgId,
              }
            })"
          >
            <Icon class="mr-2">
              {{ icons.mdiArrowLeft }}
            </Icon>
            {{ $t('supplier.backToSuppliersList') }}
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

import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'
import TemplateSaveModal from '@/components/TemplateSaveModal.vue'
import TemplateListModal from '@/components/TemplateListModal.vue'
import TemplateCard from '@/components/TemplateCard.vue'
import { CREATE_SUPPLIER_SHOP, UPDATE_SUPPLIER_SHOP, DELETE_SUPPLIER_SHOP } from '../graphql/mutations'

export default {
  name: 'SupplierCard',
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
      editCard: 'SUPPLIER',
      editMode: false,
      expanded: [],
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
          rows: 2,
          label: 'sl',
        },
        companyNameCl: {
          rows: 2,
        },
        website: {},
        companyType: {},
        fieldOfActivity: {},
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
        },
      },
      supplier: {
        id: null,
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
      return !deepEqual(this.supplier, this.supplierClone)
    },
    currentTemplate () {
      let result = null
      const shopCheckFields = this.shopFieldsKeys
      if (
        (
          this.supplier.template.templateName === null ||
          this.supplier.template.templateName === 'default'
        ) &&
        this.fieldsKeys.every(el => this.supplier.template[el] === null)
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
      !val && this.$off('confirm')
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
      this.editMode = !this.editMode
    },
    async checkChangesBeforeLeave (next) {
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
        template: { id },
        shops: [],
      }
      this.addShop()
      // clone supplier for detect changes
      this.supplierClone = cloneDeep(this.supplier)
    },
    async update () {
      try {
        let input = {
          template: {},
        }
        this.fieldsKeys.forEach(key => {
          input[key] = this.supplier[key] || null
        })
        const template = this.supplier.template || {}
        this.templateFieldsKeys.forEach(key => {
          input.template[key] = template[key] || null
        })
        if (this.create) {
          const supplierShops = this.supplier.shops || []
          input.shops = supplierShops.map(s => {
            let shop = {}
            this.shopFieldsKeys.forEach(key => {
              shop[key] = s[key] || null
            })
            let sTemplate = s.template || {}
            let template = {}
            this.shopFieldsKeys.forEach(key => {
              template[key] = sTemplate[key] || null
            })
            shop.template = template
            return shop
          })
        }

        const query = this.create ? CREATE_SUPPLIER : UPDATE_SUPPLIER

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.supplier.id, input }

        this.updateLoading = 'supplier'
        const response = await this.$apollo.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data) {
          const data = this.create
            ? response.data.createSupplier
            : response.data.updateSupplier
          this.setData(data)
          this.expanded = []
          if (this.isComponent) {
            const action = this.create ? 'create' : 'update'
            this.$emit(action, data)
          } else {
            this.editMode = false
            if (this.create) {
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
        throw new Error(error)
      } finally {
        this.updateLoading = null
      }
    },
    setData (item) {
      if (!item) return
      this.supplier = cloneDeep(item)
      this.supplierClone = cloneDeep(item)
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
      if (!this.supplier.hasOwnProperty(key)) {
        this.$set(this.supplier, key, value)
      } else {
        this.supplier[key] = value
      }
    },
    updateShopTemplate (index, key, value) {
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
          }
          const index = this.supplier.shops.push(shop)
          this.expanded.push(index - 1)
        } else {
          const response = await this.$apollo.mutate({
            mutation: CREATE_SUPPLIER_SHOP,
            variables: { supplierId: this.supplierId, input: {} },
          })
          if (response && response.data && response.data.createSupplierShop) {
            const index = this.supplier.shops.push(response.data.createSupplierShop)
            this.expanded.push(index - 1)
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateShop (shopId, index) {
      try {
        const shop = this.supplier.shops[index] || {}
        let input = {}
        this.shopFieldsKeys.forEach(key => {
          input[key] = shop[key]
        })
        const response = await this.$apollo.mutate({
          mutation: UPDATE_SUPPLIER_SHOP,
          variables: { id: shopId, input },
        })
        if (response && response.data && response.data.updateSupplierShop) {
          this.supplier.shops.splice(index, 1, response.data.updateSupplierShop)
          this.expandShop(index)
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
          const index = this.supplier.shops.findIndex(el => el.id === id)
          this.supplier.shops.splice(index, 1)
          // TODO remove from cache
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    expandShop (val) {
      const index = this.expanded.indexOf(val)
      if (index !== -1) {
        this.expanded.splice(index, 1)
      } else {
        this.expanded.push(val)
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
    .card__expand-btn {
      left: -28px;
      font-size: 16px;
    }
    .card__add-address-btn {
      margin-top: 52px;
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
    .card__expand-btn {
      left: -10px;
    }
     .header__actions {
      width: 35%;
    }
  }
</style>
