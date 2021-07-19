<template>
  <div class="modal">
    <Modal v-model="requisiteList" max-width="400">
      <!-- <ContractCompanyListModal
        ref="requisiteList"
        @openRequisiteDialog="openRequisiteDialog"
        @chooseRequisite="chooseRequisite"
      /> -->
      TODO
    </Modal>

    <Modal v-model="saveBeforeClose" max-width="520">
      <SaveBeforeCloseModal
        :text="`${$t('label.saveDocChangesBeforeClose', {
          doc: $t('contract.supplyContract'),
        })}`"
        :postScriptum="$t('label.saveChangesHint')"
        @dontSave="doNotSaveContractChanges"
        @cancel="cancel"
        @save="saveContractChanges"
      />
    </Modal>

    <Modal
      ref="requisiteDialog"
      v-model="requisiteDialog"
      scrollable
      max-width="1024"
      :fullscreen="$breakpoint.xs.value"
    >
      <RequisiteCard
        ref="requisiteCard"
        :org-id="$route.params.orgId"
        create
        is-component
        @close="requisiteDialog = false"
        @create="setCreatedRequisite"
      />
    </Modal>

    <div class="modal-header">
      <Icon>
        {{ icons.ziEdit }}
      </Icon>
      <TextField
        v-model="contract.name"
        :placeholder="$t('contract.name')"
        class="w-5/6 ml-6"
      />
    </div>
    <div class="modal-body">
      <div class="modal-paper">
        <div class="paper-title">
          <div class="flex flex-col md:flex-row justify-between">
            <span class="paper-title__title mb-8 md:mt-0">
              <Editable
                v-model="contract.title"
                :placeholder="$t('contract.heading')"
                type="editable"
                single-line
                text-dark
                hide-details
              />
            </span>
            <Tooltip top max-width="600">
              <template v-slot:activator>
                <span class="paper-title__number">A0000-26082020-1</span>
              </template>
              <span class="text-sm">
                {{ $t('contract.specNumber') }}
              </span>
            </Tooltip>
          </div>
          <div class="paper-title__info">
            <span>
              <TextField
                v-model="contract.country"
                solo
                :placeholder="$t('contract.location')"
              />
            </span>
            <Tooltip top max-width="340">
              <template v-slot:activator>
                <span class="mt-8 sm:mt-0">{{ $t('contract.date') }}</span>
              </template>
              <span class="text-sm">
                {{ $t('contract.paperDate') }}
              </span>
            </Tooltip>
          </div>
          <div class="paper-title__textfield mt-8">
            <TextArea
              v-model="contract.docHeader"
              :disabled="contract.useDefaultDocHeader"
              :placeholder="$t('contract.textField')"
              hide-details
              single-line
              rows="1"
            />
          </div>
          <Checkbox
            :model-value="contract.useDefaultDocHeader"
            class="-ml-6 text-blue-500"
            @update:model-value="useDefaultHeader"
          >
            <span class="ml-2 mb-2 text-sm text-black">{{
              $t('contract.contractHeader')
            }}</span>
          </Checkbox>
        </div>

        <div
          v-for="(item, index) in contract.items"
          :key="index"
          class="paper-custom-paragraph mt-10"
        >
          <div class="paper-custom-paragraph__title heading">
            <span
              class="heading__number flex items-center cursor-pointer"
              @click="changePos(index, contract.items)"
            >
              <i v-if="index > 0" class="text-blue-500">
                <Icon class="icon-move-up--heading">
                  {{ icons.ziChevronUp }}
                </Icon>
              </i>
              <span>{{ index + 1 }}.</span>
            </span>
            <TextField
              v-model="item.title"
              :placeholder="$t('contract.paragraphHeading')"
              solo
            />
            <span
              class="remove-item"
              @click="removeItem(contract.items, index)"
            >
              <Icon title="Remove">
                {{ icons.ziCloseDelete }}
              </Icon>
            </span>
          </div>
          <div>
            <div
              v-for="(paragraph, idx) in item.paragraphs"
              :key="idx"
              class="paragraph relative"
            >
              <span
                class="paragraph__number flex cursor-pointer"
                @click="changePos(idx, item.paragraphs)"
              >
                <i v-if="idx > 0" class="text-blue-500">
                  <Icon class="icon-move-up--paragraph">
                    {{ icons.ziChevronUp }}
                  </Icon>
                </i>
                <span>{{ index + 1 }}.{{ idx + 1 }}.</span>
              </span>
              <TextArea
                v-model="item.paragraphs[idx]"
                :placeholder="$t('contract.paragraph')"
                hide-details
                single-line
                text-dark
                transparent
                rows="1"
                auto-grow
              />
              <span
                class="remove-item"
                @click="removeParagraph(contract.items, index, idx)"
              >
                <Icon title="Remove">
                  {{ icons.ziCloseDelete }}
                </Icon>
              </span>
            </div>
          </div>
          <Btn
            outlined
            class="mt-4"
            @click="addParagraph(contract.items, index)"
          >
            <Icon class="mr-2.5">{{ icons.ziPlusOutline }}</Icon>
            <span class="text-sm">{{ $t('contract.addParagraph') }}</span>
          </Btn>
        </div>

        <Btn outlined class="mt-10" @click="addHeading(contract.items)">
          <Icon class="mr-2.5">{{ icons.ziPlusOutline }}</Icon>
          <span>{{ $t('contract.addHeading') }}</span>
        </Btn>

        <div class="paper-requisites mt-10">
          <div class="paper-requsites__title heading">
            <span class="heading__number flex items-center">
              <span>{{ contract.items.length + 1 }}.</span>
            </span>
            <span>{{ $t('contract.details') }}</span>
          </div>

          <div
            class="
              paper-details
              mt-16
              flex flex-col
              md:flex-row
              justify-around
              text-sm
            "
          >
            <div class="w-full md:w-1/2 pl-4 md:pr-10 leading-none relative">
              <ul>
                <li class="flex">
                  <span class="-ml-4 mr-2">{{
                    $t('contract.requisites.supplier')
                  }}</span>
                  <div
                    class="paper-details__requisite"
                    @click="openRequisiteList"
                  >
                    <Icon>
                      {{ icons.ziCogfigurations }}
                    </Icon>
                    <span class="requisite__company-name">{{
                      requisite.name || '_ _ _ _ _ _'
                    }}</span>
                  </div>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.address')
                  }}</span>
                  <span class="w-2/3">{{ requisite.legalAddress }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.postcode')
                  }}</span>
                  <span class="w-2/3">{{
                    requisite.leagalAddressPostcode || '_ _ _ _ _ _'
                  }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.phone')
                  }}</span>
                  <span class="w-2/3">{{ requisite.phone }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.fax')
                  }}</span>
                  <span class="w-2/3">{{ requisite.fax }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.email')
                  }}</span>
                  <span class="w-2/3">{{ requisite.email }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.bank')
                  }}</span>
                  <span class="w-2/3">{{ requisite.bankName }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.bankAddress')
                  }}</span>
                  <span class="w-2/3">{{ requisite.bankAddress }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.accountNumber')
                  }}</span>
                  <span class="w-2/3">{{ requisite.bankAccountNumber }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.swift')
                  }}</span>
                  <span class="w-2/3">{{ requisite.swift }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.fullName')
                  }}</span>
                  <span class="w-2/3">{{ requisite.ownerFullName }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.position')
                  }}</span>
                  <span class="w-2/3">{{ requisite.ownerJobPosition }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{
                    $t('contract.requisites.signatureStamp')
                  }}</span>
                  <span class="w-2/3">_____________________</span>
                </li>
              </ul>
            </div>
            <div
              class="
                w-full
                md:w-1/2
                mt-8
                -ml-5
                md:ml-0 md:mt-0
                paper-buyer-details
              "
            >
              {{ $t('contract.buyerDetails') }}
            </div>
          </div>
        </div>
      </div>

      <div class="modal-paper mt-4">
        <div class="paper-title">
          <div class="paper-title__title">
            <span>{{ $t('contract.specification') }} №A0000-26082020-1</span>
            <span class="block">
              {{ $t('contract.to') }}
              <span class="text-light-gray-800">{{ contract.title }}</span>
            </span>
          </div>
          <div class="paper-title__info">
            <span>
              <TextField
                v-model="contract.country"
                :placeholder="$t('contract.location')"
                solo
              />
            </span>
            <Tooltip top max-width="340">
              <template v-slot:activator>
                <span>{{ $t('contract.date') }}</span>
              </template>
              <span class="text-sm">
                {{ $t('contract.paperDate') }}
              </span>
            </Tooltip>
          </div>
        </div>
        <div class="paper-delivery-item mt-10">
          <div class="paper-delivery-item__title heading">
            <span class="heading__number heading__nubmer--first">
              <span>1.</span>
            </span>
            <!-- SET VALUE {contract.deliveryItem} BY DEFAULT -->
            <TextField
              v-model="contract.specItems[0].title"
              :placeholder="$t('contract.deliveryItem')"
              solo
            />
          </div>
          <div class="paper-table">
            {{ $t('contract.table') }}
          </div>
        </div>
        <div
          v-for="(item, index) in contract.specItems.slice(1)"
          :key="index"
          class="paper-custom-paragraph mt-10"
        >
          <div class="paper-custom-paragraph__title heading">
            <span
              class="heading__number flex items-center cursor-pointer"
              @click="changePos(index + 1, contract.specItems)"
            >
              <i v-if="index > 0" class="text-blue-500">
                <Icon class="icon-move-up--heading">
                  {{ icons.ziChevronUp }}
                </Icon>
              </i>
              <span>{{ index + 2 }}.</span>
            </span>
            <TextField
              v-model="item.title"
              :placeholder="$t('contract.paragraphHeading')"
              solo
            />
            <span
              class="remove-item"
              @click="removeItem(contract.specItems, index + 1)"
            >
              <Icon title="Remove">
                {{ icons.ziCloseDelete }}
              </Icon>
            </span>
          </div>
          <div
            v-for="(paragraph, idx) in item.paragraphs"
            :key="idx"
            class="paragraph relative"
          >
            <span
              class="paragraph__number flex cursor-pointer"
              @click="changePos(idx, item.paragraphs)"
            >
              <i v-if="idx > 0" class="text-blue-500">
                <Icon class="icon-move-up--paragraph">
                  {{ icons.ziChevronUp }}
                </Icon>
              </i>
              <span>{{ index + 2 }}.{{ idx + 1 }}.</span>
            </span>
            <TextArea
              v-model="item.paragraphs[idx]"
              :placeholder="$t('contract.paragraph')"
              hide-details
              single-line
              text-dark
              transparent
              rows="1"
            />
            <span
              class="remove-item"
              @click="removeParagraph(contract.specItems, index + 1, idx)"
            >
              <Icon title="Remove">
                {{ icons.ziCloseDelete }}
              </Icon>
            </span>
          </div>
          <Btn
            outlined
            class="mt-4"
            @click="addParagraph(contract.specItems, index + 1)"
          >
            <Icon class="mr-2.5">{{ icons.ziPlusOutline }}</Icon>
            <span class="text-sm">{{ $t('contract.addParagraph') }}</span>
          </Btn>
        </div>

        <Btn outlined class="mt-10" @click="addHeading(contract.specItems)">
          <Icon class="mr-2.5">{{ icons.ziPlusOutline }}</Icon>
          <span>{{ $t('contract.addHeading') }}</span>
        </Btn>
      </div>
    </div>
    <div class="modal-footer">
      <Btn class="mr-8" @click="update">
        <span>{{ $t('action.save') }}</span>
      </Btn>
    </div>
    <span class="close-btn" @click="beforeClose">
      <Icon>{{ icons.ziCloseDelete }}</Icon>
    </span>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { useApolloClient } from '@vue/apollo-composable'

import {
  ziCogfigurations,
  ziEdit,
  ziChevronUp,
  ziPlusOutline,
  ziCloseDelete,
} from '@zennnn/icons'

import { GET_ORG_REQUISITE } from '../graphql/queries'
import { CREATE_CONTRACT, UPDATE_CONTRACT } from '../graphql/mutations'

// import ContractCompanyListModal from '@/components/ContractCompanyListModal.vue'
import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'
import RequisiteCard from '@/components/RequisiteCard.vue'

export default {
  name: 'ContractConfiguratorModal',
  components: {
    // ContractCompanyListModal,
    SaveBeforeCloseModal,
    RequisiteCard,
  },
  props: {
    blank: {
      type: Object,
      default: () => ({}),
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { resolveClient } = useApolloClient()

    return {
      resolveClient,
    }
  },
  data() {
    return {
      icons: {
        ziCogfigurations,
        ziEdit,
        ziChevronUp,
        ziPlusOutline,
        ziCloseDelete,
      },
      contractMetaData: {
        name: '',
        title: '',
        country: '',
        docHeader: '',
        useDefaultDocHeader: false,
      },
      contract: {},
      contractClone: {},
      isStandardHeader: false,
      saveBeforeClose: false,
      requisiteList: false,
      requisiteDialog: false,
      requisite: {},
    }
  },
  computed: {
    orgId() {
      return this.$route.params.orgId
    },
    companyId() {
      return this.contract.companyId || ''
    },
  },
  watch: {
    blank(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setData(newVal)
        if (newVal.requisiteId) {
          this.setCurrentRequisite(newVal.requisiteId)
        } else {
          this.requisite = {}
        }
      }
    },
  },
  created() {
    this.setData(this.blank)
    if (this.contract.requisiteId) {
      this.setCurrentRequisite(this.contract.requisiteId)
    }
  },
  methods: {
    addHeading(contract) {
      contract.push({
        title: '',
        paragraphs: [''],
      })
    },
    addParagraph(contract, index) {
      contract[index].paragraphs.push('')
    },
    removeItem(contract, index) {
      contract.splice(index, 1)
    },
    removeParagraph(contract, index, idx) {
      contract[index].paragraphs.splice(idx, 1)
    },
    useDefaultHeader() {
      this.contract.useDefaultDocHeader = !this.contract.useDefaultDocHeader
      if (this.contract.useDefaultDocHeader) {
        this.contract.docHeader = ''
      }
    },
    changePos(index, arr) {
      const curr = arr[index]
      const prev = arr[index - 1]

      arr.splice(index - 1, 1, curr)
      arr.splice(index, 1, prev)
    },
    async update() {
      try {
        const client = this.resolveClient()
        const input = {}

        if (!this.create) input.id = this.contract.id

        for (const key in this.contractMetaData) {
          if (Object.prototype.hasOwnProperty.call(this.contract, key)) {
            this.$set(input, key, this.contract[key])
          }
        }

        const items = []
        const specItems = []
        this.contract.items.forEach((item) => {
          items.push({
            title: item.title,
            paragraphs: item.paragraphs,
          })
        })
        this.contract.specItems.forEach((specItem) => {
          specItems.push({
            title: specItem.title,
            paragraphs: specItem.paragraphs,
          })
        })

        input.requisiteId = this.companyId

        this.$set(input, 'items', items)
        this.$set(input, 'specItems', specItems)

        const query = this.create ? CREATE_CONTRACT : UPDATE_CONTRACT

        const variables = this.create
          ? { orgId: this.orgId, input }
          : { id: this.contract.id, input }

        const response = await client.mutate({
          mutation: query,
          variables,
        })
        if (response && response.data && response.data.createContract) {
          this.setData(response.data.createContract)
        }
        if (response && response.data && response.data.updateContract) {
          this.setData(response.data.updateContract)
        }
        this.$emit('update')
      } catch (error) {
        this.$logger.warn('Error: ', error)
        throw new Error(error)
      }
      this.$emit('close')
    },
    openRequisiteList() {
      this.requisiteList = true
      setTimeout(() => {
        this.$refs.requisiteList.update()
      }, 200)
    },
    async setCurrentRequisite(id) {
      const client = this.resolveClient()
      const {
        data: { getOrgRequisite },
      } = await client.query({
        query: GET_ORG_REQUISITE,
        variables: { id },
        fetchPolicy: 'network-only',
      })
      this.requisite = getOrgRequisite || {}
    },
    chooseRequisite(id) {
      this.setCurrentRequisite(id)
      this.contract.requisiteId = id
      this.requisiteList = false
    },
    setCreatedRequisite(requisite) {
      this.contract.requisiteId = requisite.id
      this.setCurrentRequisite(this.contract.requisiteId)
      this.requisiteDialog = false
      this.requisiteList = false
      setTimeout(() => {
        this.$refs.requisiteCard.reset()
        if (this.$refs.requisiteDialog.$refs.dialog) {
          this.$refs.requisiteDialog.$refs.dialog.scrollTop = 0
        }
      }, 200)
    },
    beforeClose() {
      if (!deepEqual(this.contract, this.contractClone, true)) {
        this.saveBeforeClose = true
      } else {
        this.$emit('close')
      }
    },
    doNotSaveContractChanges() {
      this.saveBeforeClose = false
      this.$emit('close')
    },
    cancel() {
      this.saveBeforeClose = false
    },
    saveContractChanges() {
      this.update()
      this.saveBeforeClose = false
      this.$emit('close')
    },
    openRequisiteDialog() {
      this.requisiteDialog = true
    },
    setData(item) {
      if (!item) return
      this.contract = item
      this.contractClone = cloneDeep(this.contract)
    },
  },
}
</script>

<style scoped lang="postcss">
.modal {
  display: flex;
  flex-direction: column;
  position: relative;
  @apply bg-gray-400;
}
.modal-header {
  max-width: 906px;
  height: 70px;
  padding: 25px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  z-index: 999;
  color: #aaaaaa;
  background-color: #666666;
}
.modal-header > input {
  @apply w-3/4 h-8 ml-4 pl-4;
  font-size: 18px;
  background-color: #565656;
  outline: none;
}
.modal-header > input::placeholder {
  font-size: 18px;
  color: #7e7e7e;
}
.modal-body {
  height: 100%;
  flex-grow: 1;
  overflow-y: auto;
  color: #cdcdcd;
  background-color: #131313;
}
.modal-paper {
  width: 100%;
  height: auto;
  padding: 50px 10px 60px 50px;
  color: #131313;
  background-color: #d0d0d0;
}
.paper-title input {
  min-width: 250px;
  width: auto;
  background-color: #d0d0d0;
  border-bottom: 1px solid #888888;
  outline: none;
}
.paper-title input::placeholder {
  color: #888888;
}
.paper-title__title,
.paper-title__number {
  font-size: 24px;
}
.paper-title__info {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #888888;
}
.paragraph {
  margin-top: 25px;
}
.modal-footer {
  width: 100%;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #666666;
}
.heading {
  position: relative;
  font-size: 21px;
  font-weight: 700 !important;
}
.heading .text-field--single-line input {
  width: 100%;
  font-weight: 700 !important;
  outline: none;
}
.heading > input::placeholder {
  color: #888888;
}
.heading__number,
.paragraph__number {
  position: absolute;
  top: 0;
  left: -24px;
  color: #888888;
}
.paragraph__number {
  left: -28px;
}
.icon-move-up--heading,
.icon-move-up--paragraph {
  width: 20px;
  position: absolute;
  top: 2px;
  left: -26px;
}
.icon-move-up--paragraph {
  top: -1px;
  left: -21px;
}
.remove-item {
  position: absolute;
  top: 0;
  right: 0;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.paper-details__requisite {
  @apply flex items-center text-blue-500 cursor-pointer;
  position: absolute;
  top: -5px;
  left: 25%;
}
.requisite__company-name {
  @apply ml-2;
}
.requisite__company-name:hover {
  color: #6996b2;
}
.paper-buyer-details {
  padding: 96px 30px;
  font-size: 14px;
  text-align: center;
  color: #888888;
  background-color: #cbcbcb;
}
.paper-table {
  margin-top: 15px;
  margin-left: -30px;
  padding: 50px 20px;
  font-size: 14px;
  text-align: center;
  color: #888888;
  background-color: #cbcbcb;
}
.close-btn {
  position: absolute;
  top: 5px;
  right: 15px;
  z-index: 1000;
  color: #fff;
  cursor: pointer;
}
.access {
  margin: 0;
}

@screen md {
  .modal-header > input {
    @apply ml-10;
  }
  .modal-paper {
    padding: 50px 60px 60px 110px;
  }
  /* .paper-details__requisite {
      right: 80px;
    } */
  .paper-table {
    margin-left: -60px;
    padding: 50px 145px;
  }
}
@screen sm {
  .paper-title__info {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .modal-paper {
    padding: 50px 30px 60px 90px;
  }
  .heading__number,
  .paragraph__number {
    left: -37px;
  }
  .icon-move-up--heading,
  .icon-move-up--paragraph {
    width: 25px;
    position: absolute;
    top: 0;
    left: -37px;
  }
  .icon-move-up--heading,
  .paragraph__number {
    left: -42px;
  }
  .icon-move-up--heading {
    top: 2px;
  }
  .remove-item {
    right: -25px;
  }
}
</style>
