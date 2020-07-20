<template>
  <div class="container container--sm">
    <div
      v-if="isSpecSync"
      class="fixed opacity-50 simple-rotation-anim mr-4 mb-6"
    >
      <Icon>
        {{ icons.mdiSync }}
      </Icon>
    </div>
    <div class="py-10">
      <div class="flex flex-wrap items-center justify-between pb-4">
        <h1 class="text-2xl text-white font-semibold">
          {{ $t('shipping.title') }}
        </h1>
        <div class="flex items-center text-white">
          <SwitchInput
            :value="specSimpleUI"
            class="inline-flex"
            @input="toggleSpecSimpleUI"
          >
            <span class="mr-2">
              {{ $t('shipping.simpleInterface') }}
            </span>
          </SwitchInput>
          <v-tooltip top max-width="320" nudge-right="130">
            <template v-slot:activator="{ on }">
              <i class="zi-help text-blue-500 cursor-pointer" v-on="on" />
            </template>
            <span>
              {{ $t('shipping.simpleInterfaceHint') }}
            </span>
          </v-tooltip>
        </div>
        <div class="flex items-center text-gray-300">
          <Comments
            v-if="spec.client"
            :items="spec.comments"
            :spec-id="specId"
            left
            class="text-gray-300 focus:text-gray-100 hover:text-gray-100 transition-colors duration-100 ease-out mr-4"
          />
          <span v-if="spec.client">
            {{ `${$t('shipping.shippingClient')}: ${spec.client.uid} ${spec.client.fullName}` }}
          </span>
          <template v-else>
            <Select
              :value="spec.client"
              :placeholder="$t('shipping.shippingClientAdd')"
              :search.sync="clientSearch"
              :items="clients"
              :has-arrow-icon="false"
              flat
              no-filter
              searchable
              return-object
              item-value="id"
              item-text="name"
              solo
              hide-details
              class="inline-flex justify-end ml-2"
              @input="setSpecClient($event && $event.id)"
              @click:prepend-item="createClient"
            >
              <template v-slot:prepend-item>
                <span class="flex items-center jusitfy-center text-blue-500">
                  <i class="zi-plus-outline text-2xl mr-1" />
                  <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
                </span>
              </template>
            </Select>
          </template>
        </div>
      </div>

      <div class="bg-gray-800 bg-opacity-90 rounded-md px-sm pb-sm">
        <div class="h-12 flex items-center">
          <div class="flex items-center pl-5 sm:pr-sm">
            <Checkbox disabled hide-details class="pt-xs">
              <button disabled class="flex text-2xl text-blue-500 focus:outline-none cursor-not-allowed">
                <i class="zi-chevron-down" />
              </button>
            </Checkbox>
          </div>
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-sm">
            <i class="zi-copy text-2xl" />
          </button>
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-1 sm:px-sm">
            <i class="zi-delete text-2xl" />
          </button>
          <div class="w-px h-5 bg-gray-400 mx-sm" />
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-sm">
            <i class="zi-filter text-2xl" />
          </button>
          <div class="flex-grow" />
          <div class="flex text-gray-200 text-lg overflow-hidden">
            <span v-html="specTitleHtml" :title="specTitleText" class="truncate" />
            <div class="inline-block text-2xl pl-sm pr-3 md:pr-md">
              <button
                v-if="expanded.length === 0"
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="expandAll"
              >
                <i class="zi-expand" :title="$t('action.expandAll')" />
              </button>
              <button
                v-else
                class="flex items-center text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none select-none"
                @click="collapseAll"
              >
                <i class="zi-collapse" :title="$t('action.collapseAll')" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-for="(item, i) in items"
          :key="i"
          :class="{ 'mb-1': i + 1 < items.length }"
          :style="{
            boxShadow: item.id ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : '0px 0px 20px rgba(0, 0, 0, 0.1)',
          }"
        >
          <template v-if="item.id === emptyId">
            <InvoiceHeader
              :role="Role.MANAGER"
              :class="{ 'mt-1': !isEmpty }"
              :is-empty="isEmpty"
              create
              @update="createInvoice"
            />
            <v-expand-transition>
              <InvoiceContent
                v-if="isEmpty"
                :currency="spec.currency"
                :invoice="item"
                :active-tab="invoiceActiveTab"
                :scroll-left="invoiceScrollLeft"
                :scroll-invoice-id="invoiceScrollId"
                :role="Role.MANAGER"
                :hide-summary="!isInvoiceSummaryVisible"
                create
                @change:tab="setInvoiceActiveTab"
                @change:scrollLeft="setScrollLeft"
                @update:currency="updateSpec({ currency: $event })"
              />
            </v-expand-transition>
          </template>
          <template v-else>
            <InvoiceHeader
              :item="item"
              :is-expanded="expanded.includes(item.id)"
              :role="Role.MANAGER"
              @update="updateInvoice"
              @click="expand"
            />
            <v-expand-transition>
              <InvoiceContent
                v-if="expanded.includes(item.id)"
                :currency="spec.currency"
                :invoice="item"
                :active-tab="invoiceActiveTab"
                :scroll-left="invoiceScrollLeft"
                :scroll-invoice-id="invoiceScrollId"
                :role="Role.MANAGER"
                :hide-summary="!isInvoiceSummaryVisible"
                @change:tab="setInvoiceActiveTab"
                @change:scrollLeft="setScrollLeft"
                @update:currency="updateSpec({ currency: $event })"
              />
            </v-expand-transition>
          </template>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap lg:flex-no-wrap pb-8">
      <div class="w-full flex-grow lg:w-auto pb-8 lg:pb-0 lg:pr-3" style="max-width: 746px">
        <v-slide-y-transition hide-on-leave>
          <SpecShipping
            v-if="isInfoVisible"
            :spec="spec"
            :hide-containers="!isCostVisible"
          >
            <template v-slot:actions>
              <div class="flex items-center justify-between pt-6">
                <select
                  :value="`${container.size}${container.mode}`"
                  :disabled="setContainerSizeLoading"
                  name="container-size"
                  class="simple-select"
                  @change="setContainerSize(container.id, $event)"
                >
                  <option value="_20_DC">
                    <span class="leaders__num cursor-pointer" style="padding-right:0">
                      20'DC
                    </span>
                  </option>
                  <option value="_40_HC">
                    <span class="leaders__num cursor-pointer" style="padding-right:0">
                      40'HC
                    </span>
                  </option>
                  <option value="_45_HC">
                    <span class="leaders__num cursor-pointer" style="padding-right:0">
                      45'HC
                    </span>
                  </option>
                </select>
                <SwitchInput
                  :value="spec.shipped"
                  hide-details
                  @input="updateSpec({ shipped: $event })"
                >
                  {{ $t('shipping.setShipped') }}
                </SwitchInput>
              </div>
            </template>
          </SpecShipping>
        </v-slide-y-transition>
      </div>
      <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
        <v-slide-y-transition hide-on-leave>
          <SpecCost
            v-if="isCostVisible"
            :role="Role.MANAGER"
            :spec="spec"
            @update-spec="updateSpec"
          />
        </v-slide-y-transition>
      </div>
    </div>

    <v-slide-y-transition hide-on-leave>
      <div
        v-if="isSummaryVisible"
        class="pb-8"
      >
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          <span class="mr-1">{{ $t('shipping.extraTitle') }}</span>
          <v-tooltip top max-width="240" nudge-right="90">
            <template v-slot:activator="{ on }">
              <i class="zi-help align-middle text-blue-500 text-xl cursor-pointer" v-on="on" />
            </template>
            <span>
              {{ $t('shipping.extraHint') }}
            </span>
          </v-tooltip>
        </h4>
        <div class="flex">
          <div class="w-full flex-grow lg:w-auto lg:pr-3">
            <div class="rounded-md bg-gray-700 pt-2 px-sm pb-5">
              <TextArea
                :placeholder="$t('shipping.extraPlaceholder')"
              />
            </div>
          </div>
          <div class="hidden lg:block w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3" />
        </div>
      </div>
    </v-slide-y-transition>

    <!-- <div class="flex pt-5">
      <Button
        outlined
        @click="createInvoice"
      >
        <template v-slot:icon>
          <i class="zi-plus text-lg block align-middle" />
        </template>
        <span>{{ $t('shipping.addInvoice') }}</span>
      </Button>
    </div> -->

    <v-slide-y-transition hide-on-leave>
      <SpecSummary
        v-if="isSummaryVisible"
        :spec="spec"
        :role="Role.MANAGER"
      />
    </v-slide-y-transition>

    <v-dialog
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      max-width="1110"
      content-class="dialog-full-height overflow-scroll-touch"
    >
      <ClientCard
        ref="clientCard"
        :org-id="orgId"
        create
        is-component
        @close="clientDialog = false"
        @create="setCreateSpecClient"
      />
    </v-dialog>

  </div>
</template>

<script>
import InvoiceHeader from '../InvoiceHeader.vue'
import InvoiceContent from '../InvoiceContent.vue'
import SpecSummary from '../SpecSummary.vue'
import ClientCard from '../ClientCard.vue'
import Comments from '../Comments.vue'
import SpecShipping from '../SpecShipping.vue'
import SpecCost from '../SpecCost.vue'

import spec from '../../mixins/spec'

import {
  SET_SPEC_CONTAINER_SIZE,
  SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
} from '../../graphql/mutations'

export default {
  name: 'Manager',
  components: {
    InvoiceHeader,
    InvoiceContent,
    SpecSummary,
    ClientCard,
    Comments,
    SpecShipping,
    SpecCost,
  },
  mixins: [spec],
  data () {
    return {
      defaultTab: 1,
      setContainerSizeLoading: false,
      setContainerCustomCapacityLoading: false,
    }
  },
  computed: {
    // TODO: need work with containers
    container () {
      const containers = this.spec.containers || []
      return containers[0] || {}
    },
  },
  methods: {
    async setContainerSize (containerId, e) {
      try {
        const val = e.target.value || ''
        const split = val.split('_')
        const inputSize = `_${split[1]}`
        const inputMode = `_${split[2]}`
        if (!containerId) return
        this.setContainerSizeLoading = true
        await this.$apollo.mutate({
          mutation: SET_SPEC_CONTAINER_SIZE,
          variables: {
            specId: this.spec.id,
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
        await this.$apollo.mutate({
          mutation: SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
          variables: {
            specId: this.spec.id,
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
  },
}
</script>
