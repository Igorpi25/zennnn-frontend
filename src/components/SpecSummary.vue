<template>
  <div>

    <Modal
      v-model="paperList"
      max-width="443"
    >
      <ContractListModal
        :items="papers"
        @close="paperList = false"
        @openPaper="openContract"
        @createPaper="createContract"
      />
    </Modal>

    <Modal
      v-model="paperConfigurator"
      :fullscreen="$breakpoint.xs || $breakpoint.sm"
      content-class="dialog-full-height rounded-none paper-configurator-dialog"
      max-width="906"
      scrollable
      persistent
    >
      <!-- <ContractConfiguratorModal
        :blank="blank"
        :create="create"
        @update="contractCreated"
        @close="paperConfigurator = false"
      /> -->
      TODO
    </Modal>

    <Modal
      v-model="printDialog"
      :fullscreen="$breakpoint.smAndDown"
      content-class="dialog-full-height scrolling-touch"
      max-width="1130"
      scrollable
      persistent
    >
      <PrintSettings
        :ready-to-print="spec.readyToPrint"
        :org-id="orgId"
        :spec-id="spec.id"
        :requisite-id="spec.requisite"
        :client="spec.client || {}"
        :shipment="spec.shipment"
        :customs="spec.customs"
        :amount="spec.total"
        :amount-in-words="spec.amountInWords"
        :amount-in-words-client-lang="spec.amountInWordsClientLang"
        :loading="printLoading"
        @update="v => updateSpec(v)"
        @close="printDialog = false"
        @print="doPrint"
      />
    </Modal>

    <div v-if="isOwnerOrManager">
      <div class="flex flex-wrap lg:flex-nowrap pb-8">
        <!-- Delivery -->
        <SpecShipment
          :item="spec.shipment"
          @update="v => updateSpec(v)"
        />
        <!-- Customs -->
        <SpecCustoms
          :shipment-type="(spec.shipment && spec.shipment.activeType) || ''"
          :item="spec.customs"
          :amount="spec.total"
          :amount-in-words="spec.amountInWords"
          :amount-in-words-client-lang="spec.amountInWordsClientLang"
          @update="v => updateSpec(v)"
        />
      </div>
    </div>

    <div class="pb-12" v-if="isOwnerOrManager">
      <h4 class="text-white text-xl font-semibold leading-6 mb-4">
        {{ $t('shipping.actions') }}
      </h4>
      <div class="bg-gray-700 rounded-md p-3 select-none">
        <div class="flex flex-wrap lg:justify-between">
          <div class="w-full md:w-auto p-2">
            <Btn
              :href="`/paper/${$route.params.specId}`"
              target="_blank"
              outlined
              class="w-full"
              content-class="w-full flex items-center"
              @click="onOverview"
            >
              <template v-slot:icon>
                <i class="zi-eye text-gray-100 text-2xl" />
              </template>
              {{ $t('shipping.previewAsCustomer') }}
            </Btn>
          </div>
          <div class="w-full md:w-auto p-2">
            <Btn
              outlined
              borderless
              class="w-full"
              content-class="w-full flex items-center"
              @click="openPaperList"
            >
              <template v-slot:icon>
                <i class="zi-setting text-gray-100 text-2xl" />
              </template>
              {{ $t('shipping.paperConfigurator') }}
            </Btn>
          </div>
          <div class="w-full md:w-auto p-2">
            <Btn
              outlined
              borderless
              class="w-full"
              content-class="w-full flex items-center"
              @click="printDialog = true"
            >
              <template v-slot:icon>
                <i class="zi-print text-gray-100 text-2xl" />
              </template>
              {{ $t('shipping.print') }}
            </Btn>
          </div>
          <div class="w-full md:w-auto p-2">
            <Btn
              outlined
              borderless
              class="w-full"
              content-class="w-full flex items-center"
              @click="accessControlDialog = true"
            >
              <template v-slot:icon>
                <i class="zi-user-plus text-gray-100 text-2xl" />
              </template>
              {{ $t('shipping.inviteCustomer') }}
            </Btn>
          </div>
          <div class="w-full md:w-auto p-2">
            <Btn
              outlined
              borderless
              disabled
              class="w-full"
              content-class="w-full flex items-center"
            >
              <template v-slot:icon>
                <i class="zi-email text-2xl" />
              </template>
              {{ $t('shipping.notifyCustomer') }}
            </Btn>
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model="accessControlDialog"
      max-width="320px"
    >
      <div class="p-4 bg-gray-400 text-gray-100">
        <h3 class="pb-3 font-semibold">{{ $t('shipping.access') }}</h3>
        <LoadingSpinner v-if="linkAccessLoading" />
        <template v-else>
          <!-- <Switch
            :value="linkAccess"
            class="mb-2"
            @input="updateLinkAccess"
          >
            <span>{{ $t('shipping.linkAccess') }}</span>
          </Switch> -->
          <TextField
            ref="linkInput"
            :value="link"
            readonly
            solo
            class="pb-3"
          />
          <Btn
            @click="copyLink"
          >
            {{ $t('shipping.copyLink') }}
          </Btn>
        </template>
        <template>
          <h4 class="pt-5">
            {{ $t('shipping.sendAccessLink') }}
          </h4>
          <TextField
            ref="emailAccessInput"
            v-model="emailAccessInput"
            :disabled="sendAccessLinkLoading"
            label="Email"
            type="email"
            required
            class="pb-3"
          />
          <Btn
            :loading="sendAccessLinkLoading"
            @click="sendLinkAccessToEmail(emailAccessInput)"
          >
            {{ $t('shipping.sendEmail') }}
          </Btn>
        </template>
        <LoadingSpinner v-if="emailAccessLoading" />
        <div v-else class="py-4">
          <h4 v-if="emailAccess.length > 0" class="font-semibold">
            {{ $t('shipping.hasAccess') }}
          </h4>
          <div
            v-for="a in emailAccess"
            :key="a.email"
            class="flex py-2"
          >
            <div class="flex-grow">
              {{ a.email }}
            </div>
            <transition name="slide-x-transition" mode="out-in">
              <div v-if="removeEmailAccessLoading === a.email">
                <LoadingSpinner />
              </div>
              <div
                v-else
                class="cursor-pointer"
                @click="removeEmailAccess(a.email)"
              >
                <i class="zi-close text-lg" />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import { useRoute } from 'vue-router'
import { useApolloClient, useQuery, useResult } from '@vue/apollo-composable'

import Btn from './Base/Btn'
import Modal from './Base/Modal'
import TextField from './Base/TextField'
import LoadingSpinner from './Base/LoadingSpinner'
import ContractListModal from '@/components/ContractListModal.vue'
// import ContractConfiguratorModal from '@/components/ContractConfiguratorModal.vue'
import PrintSettings from '../components/PrintSettings.vue'
import SpecShipment from '../components/SpecShipment.vue'
import SpecCustoms from '../components/SpecCustoms.vue'

import { SpecCurrency, Role } from '../graphql/enums'
import { LIST_ORG_CONTRACTS, GET_SPEC_LINK_ACCESS, GET_SPEC_EMAIL_ACCESS } from '../graphql/queries'
import {
  UPDATE_SPEC,
  OPEN_LINK_ACCESS,
  CLOSE_LINK_ACCESS,
  ADD_EMAIL_ACCESS_TO_SPEC,
  REMOVE_EMAIL_ACCESS_TO_SPEC,
  SEND_LINK_ACCESS_TO_EMAIL,
  SET_SPEC_CONTAINER_SIZE,
  SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
} from '../graphql/mutations'
import { DEFAULT_CURRENCY, PAPER_ORG_ID_STORE_KEY } from '../config/globals'

import printInvoice from '../components/printInvoice'

export default {
  name: 'SpecSummary',
  components: {
    Btn,
    Modal,
    TextField,
    LoadingSpinner,
    ContractListModal,
    // ContractConfiguratorModal,
    PrintSettings,
    SpecShipment,
    SpecCustoms,
  },
  props: {
    spec: {
      type: Object,
      default: () => ({}),
    },
    role: {
      type: String,
      required: true,
    },
  },
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result, refetch: listOrgContractsRefetch } = useQuery(LIST_ORG_CONTRACTS, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listOrgContracts = useResult(result)

    return {
      orgId,
      apolloClient,
      listOrgContracts,
      listOrgContractsRefetch,
    }
  },
  data () {
    return {
      printLoading: false,
      printDialog: false,
      setContainerSizeLoading: false,
      setContainerCustomCapacityLoading: false,
      sendAccessLinkLoading: false,
      addEmailAccessLoading: false,
      removeEmailAccessLoading: null,
      emailAccessLoading: false,
      emailAccess: [],
      emailAccessInput: '',
      accessControlDialog: false,
      linkAccessLoading: false,
      linkAccess: false,
      blank: {},
      papers: [],
      paperList: false,
      paperConfigurator: false,
      create: false,
    }
  },
  computed: {
    isOwnerOrManager () {
      return this.role === Role.OWNER || this.role === Role.MANAGER
    },
    isAccountant () {
      return this.role === Role.ACCOUNTANT
    },
    isWarehouseman () {
      return this.role === Role.WAREHOUSEMAN
    },
    isCurrencyDisabled () {
      return this.currency === SpecCurrency.USD
    },
    currencies () {
      return Object.values(SpecCurrency).map(el => {
        return {
          text: el,
          value: el,
        }
      })
    },
    currency () {
      return this.spec.currency || DEFAULT_CURRENCY
    },
    link () {
      return `${window.location.protocol}//${window.location.host}/paper/${this.specId}`
    },
    specId () {
      return this.$route.params.specId
    },
    containers () {
      return this.spec.containers || []
    },
  },
  watch: {
    accessControlDialog (val) {
      if (val) {
        // this.getEmailAccess()
      } else {
        setTimeout(() => {
          this.emailAccessInput = ''
        }, 250)
      }
    },
    paperConfigurator (val) {
      if (!val) {
        setTimeout(() => {
          const dialog = document.querySelector('.paper-configurator-dialog .modal-body')
          if (dialog) dialog.scrollTop = 0
        }, 200)
      }
    },
  },
  mounted () {
    if (process.env.NODE_ENV === 'development' && this.$route.hash === '#print') {
      this.printDialog = true
    }
  },
  methods: {
    onOverview () {
      sessionStorage.setItem(PAPER_ORG_ID_STORE_KEY, this.orgId)
    },
    async doPrint (requisite, client, shipment, customs) {
      try {
        this.printLoading = true
        const method = 'print'
        await printInvoice(this.spec, requisite, client, shipment, customs, method, false)
      } catch (error) {
        this.$notify({
          color: 'error',
          text: `Error creating PDF: ${error.message}`,
        })
        throw new Error(error)
      } finally {
        this.printLoading = false
      }
    },
    async setContainerSize (containerId, e) {
      try {
        const val = e.target.value || ''
        const split = val.split('_')
        const inputSize = `_${split[1]}`
        const inputMode = `_${split[2]}`
        if (!containerId) return
        this.setContainerSizeLoading = true
        await this.apolloClient.mutate({
          mutation: SET_SPEC_CONTAINER_SIZE,
          variables: {
            specId: this.specId,
            containerId,
            inputSize,
            inputMode,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.setContainerSizeLoading = false
      }
    },
    async setContainerCustomCapacity (containerId, inputCapacity, inputShrink) {
      try {
        if (!containerId) return
        this.setContainerCustomCapacityLoading = true
        await this.apolloClient.mutate({
          mutation: SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
          variables: {
            specId: this.specId,
            containerId,
            inputCapacity,
            inputShrink,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.setContainerCustomCapacityLoading = false
      }
    },
    async getEmailAccess () {
      try {
        this.emailAccessLoading = true
        const { data } = await this.apolloClient.query({
          query: GET_SPEC_EMAIL_ACCESS,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
        this.emailAccess = data.getSpecEmailAccess || []
      } catch (error) {
        throw new Error(error)
      } finally {
        this.emailAccessLoading = false
      }
    },
    async addEmailAccess (email) {
      try {
        const errors = this.$refs.emailAccessInput.validate()
        if (errors) return
        this.addEmailAccessLoading = true
        const result = await this.apolloClient.mutate({
          mutation: ADD_EMAIL_ACCESS_TO_SPEC,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.getEmailAccess()
        this.emailAccessInput = ''
        return result
      } catch (error) {
        throw new Error(error)
      } finally {
        this.addEmailAccessLoading = false
      }
    },
    async removeEmailAccess (email) {
      try {
        this.removeEmailAccessLoading = email
        const result = await this.apolloClient.mutate({
          mutation: REMOVE_EMAIL_ACCESS_TO_SPEC,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.getEmailAccess()
        return result
      } catch (error) {
        throw new Error(error)
      } finally {
        this.removeEmailAccessLoading = false
      }
    },
    async sendLinkAccessToEmail (email) {
      try {
        const errors = this.$refs.emailAccessInput.validate()
        if (errors) return
        this.sendAccessLinkLoading = true
        const result = await this.apolloClient.mutate({
          mutation: SEND_LINK_ACCESS_TO_EMAIL,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.emailAccessInput = ''
        this.$notify({
          color: 'success',
          text: this.$t('message.emailSent', { email }),
        })
        return result
      } catch (error) {
        this.$notify({
          color: 'error',
          text: this.$t('message.failedToSent'),
        })
        throw new Error(error)
      } finally {
        this.sendAccessLinkLoading = false
      }
    },
    copyLink () {
      let selection = null
      try {
        const input = this.$refs.linkInput
        if (!input) {
          throw new Error('Input not find.')
        }
        selection = document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false
        input.$el.querySelector('input').select()
        const successful = document.execCommand('copy')
        if (successful) {
          this.$notify({
            color: 'success',
            text: this.$t('message.linkCopied'),
          })
        } else {
          throw new Error('Unsuccessful.')
        }
      } catch (error) {
        this.$logger.info('Copy link error: ', error)
        this.$notify({
          color: 'warn',
          text: this.$t('message.linkNotCopied'),
        })
      }
      document.getSelection().removeAllRanges()
      if (selection) {
        document.getSelection().addRange(selection)
      }
    },
    async getLinkAccess () {
      try {
        this.linkAccessLoading = true
        const { data } = await this.apolloClient.query({
          query: GET_SPEC_LINK_ACCESS,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
        this.linkAccess = data.getSpecLinkAccess || null
      } catch (error) {
        throw new Error(error)
      } finally {
        this.linkAccessLoading = false
      }
    },
    async updateLinkAccess (value) {
      try {
        if (value) {
          await this.openLinkAccess()
        } else {
          await this.closeLinkAccess()
        }
        this.$notify({
          color: 'primary',
          text: this.$t('shipping.linkAccessUpdated'),
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    async openLinkAccess () {
      try {
        const result = await this.apolloClient.mutate({
          mutation: OPEN_LINK_ACCESS,
          variables: {
            specId: this.specId,
          },
        })
        return result
      } catch (error) {
        throw new Error(error)
      }
    },
    async closeLinkAccess () {
      try {
        const result = await this.apolloClient.mutate({
          mutation: CLOSE_LINK_ACCESS,
          variables: {
            specId: this.specId,
          },
        })
        return result
      } catch (error) {
        throw new Error(error)
      }
    },
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.apolloClient.mutate({
          mutation: UPDATE_SPEC,
          variables: {
            id: this.spec.id,
            input,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    openPaperList () {
      this.papers = this.listOrgContracts
      this.paperList = true
    },
    openContract (id) {
      if (id) {
        this.create = false
        this.blank = cloneDeep(this.papers.find(paper => paper.id === id))
      }
      this.paperList = false
      this.paperConfigurator = true
    },
    createContract () {
      this.blank = {
        name: '',
        title: '',
        country: '',
        docHeader: '',
        useDefaultDocHeader: false,
        requisiteId: '',
        items: [{
          title: '',
          paragraphs: [],
        }],
        specItems: [{
          title: '',
          paragraphs: [],
        }],
      }
      this.create = true
      this.paperList = false
      this.paperConfigurator = true
    },
    contractCreated () {
      this.listOrgContractsRefetch.refetch()
    },
  },
}
</script>
