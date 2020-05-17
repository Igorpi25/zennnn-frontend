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
          Накладные и товары
        </h1>
        <div class="flex items-center text-white">
          <v-tooltip top max-width="320" nudge-bottom="8" nudge-right="110">
            <template v-slot:activator="{ on }">
              <SwitchInput v-on="on" class="inline-flex items-center">
                <span class="mr-2">Уростить интерфейс</span>
                <i class="zi-help text-blue-500 cursor-pointer" />
              </SwitchInput>
            </template>
            <span>
              Чтобы не пугаться количества данных используемых для международной торговли, рекомендуем включить «Упростить интерфей» и работать над сделкой поэтапно. Интерфейс будет усложняться по мере работы с ним.
            </span>
          </v-tooltip>
        </div>
        <div class="flex items-center text-gray-300">
          <span>{{ `Клиент: ` }}</span>
          <span v-if="spec.client">
            {{ `${spec.client.uid} ${spec.client.fullName}` }}
          </span>
          <Select
            v-else
            :value="spec.client"
            :placeholder="$t('placeholder.emptyText')"
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
                <i class="zi-plus mr-1" />
                <span>{{ $t('deals.createSpecDialogAddClient') }}</span>
              </span>
            </template>
          </Select>
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
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-sm">
            <i class="zi-copy text-2xl sm:mr-sm" />
            <span class="hidden sm:inline">Копировать</span>
          </button>
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-sm">
            <i class="zi-delete text-2xl sm:mr-sm" />
            <span class="hidden sm:inline">Удалить</span>
          </button>
          <div class="w-px h-5 bg-gray-400 mx-sm" />
          <button disabled class="opacity-40 flex items-center text-gray-200 focus:outline-none select-none cursor-not-allowed px-sm">
            <i class="zi-filter text-2xl" />
          </button>
          <div class="flex-grow" />
          <div class="flex text-gray-200 text-lg overflow-hidden">
            <span v-html="specTitleHtml" :title="specTitleText" class="truncate" />
            <div class="inline-block text-2xl pl-sm">
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
          :key="item.id"
          :class="{ 'mb-1': i + 1 < items.length }"
          style="box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);"
        >
          <InvoiceHeader
            :item="item"
            :is-expanded="expanded.includes(item.id)"
            :role="Role.OWNER"
            @update="updateInvoice"
            @click="expand"
          />
          <Invoice
            v-if="expanded.includes(item.id)"
            :currency="spec.currency"
            :invoice="item"
            :active-tab="invoiceActiveTab"
            :scroll-left="invoiceScrollLeft"
            :scroll-invoice-id="invoiceScrollId"
            :role="Role.OWNER"
            @change:tab="setInvoiceActiveTab"
            @change:scrollLeft="setScrollLeft"
            @update:currency="updateSpec({ currency: $event })"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap lg:flex-no-wrap pb-8">
      <SpecDelivery :spec="spec">
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
                  20{{ $t('shipping.containerMeasure') }}DC
                </span>
              </option>
              <option value="_40_HC">
                <span class="leaders__num cursor-pointer" style="padding-right:0">
                  40{{ $t('shipping.containerMeasure') }}HC
                </span>
              </option>
              <option value="_45_HC">
                <span class="leaders__num cursor-pointer" style="padding-right:0">
                  45{{ $t('shipping.containerMeasure') }}HC
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
      </SpecDelivery>
      <SpecCostInfo
        :role="Role.OWNER"
        :spec="spec"
        @update-spec="updateSpec"
      />
    </div>

    <div class="pb-8">
      <h4 class="text-white text-xl font-semibold leading-6 mb-4">
        <span class="mr-1">Дополнительно</span>
        <v-tooltip top max-width="240">
          <template v-slot:activator="{ on }">
            <i class="zi-help align-middle text-blue-500 text-xl cursor-pointer" v-on="on" />
          </template>
          <span>
            Например, груз может быть скоропортящимся или хрупким или отдельно нужно указать перечень HS кодов (кодов ТН ВЭД)
          </span>
        </v-tooltip>
      </h4>
      <div class="flex">
        <div class="w-full flex-grow lg:w-auto lg:pr-3">
          <div class="rounded-md bg-gray-700 pt-2 px-sm pb-5">
            <TextArea placeholder="Особые заметки" />
          </div>
        </div>
        <div class="hidden lg:block w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3" />
      </div>
    </div>

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
      <div class="flex-grow" />
      <Comments
        :items="spec.comments"
        :spec-id="specId"
        left
      />
    </div> -->

    <SpecSummary
      :spec="spec"
      :role="Role.MANAGER"
    />

    <v-dialog
      ref="clientDialog"
      v-model="clientDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      max-width="1024"
      content-class="text-gray-100"
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
import InvoiceHeader from './InvoiceHeader.vue'
import Invoice from './Invoice.vue'
import SpecSummary from './SpecSummary.vue'
import ClientCard from './ClientCard.vue'
// import Comments from './Comments.vue'
import SpecDelivery from './SpecDelivery.vue'
import SpecCostInfo from './SpecCostInfo.vue'

import spec from '../mixins/spec'

import {
  SET_SPEC_CONTAINER_SIZE,
  SET_SPEC_CONTAINER_CUSTOM_CAPACITY,
} from '../graphql/mutations'

export default {
  name: 'SpecManager',
  components: {
    InvoiceHeader,
    Invoice,
    SpecSummary,
    ClientCard,
    // Comments,
    SpecDelivery,
    SpecCostInfo,
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
