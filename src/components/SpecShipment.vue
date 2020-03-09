<template>
  <div class="w-full pb-4 md:w-1/2 lg:w-4/6 md:pr-3">
    <h4 class="text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.forDeliver') }}
    </h4>
    <div class="bg-gray-700 rounded-t-md mb-1 py-1 px-2 flex flex-wrap items-center">
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          :value="item.sentFrom"
          :debounce="250"
          :placeholder="$t('shipping.sentFrom')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { sentFrom: $event } })"
        />
      </div>
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          :value="item.sentThrough"
          :debounce="250"
          :placeholder="$t('shipping.sentThrough')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { sentThrough: $event } })"
        />
      </div>
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          :value="item.sentDestination"
          :debounce="250"
          :placeholder="$t('shipping.destination')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { sentDestination: $event } })"
        />
      </div>
    </div>
    <div class="bg-gray-700 rounded-b-md py-1 px-2 flex flex-wrap">
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <Select
          :value="item.activeType"
          :placeholder="$t('shipping.shipmentType')"
          :nudge-bottom="32"
          :search.sync="shipmentTypeSearch"
          :items="shipmentTypes"
          searchable
          solo
          squared
          hide-details
          class="text-sm select_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { activeType: $event } })"
        >
          <template v-slot:append="{ isMenuOpen, toggle }">
            <div class="text-primary cursor-pointer select-none" @click="toggle">
              <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
              <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
            </div>
          </template>
        </Select>
      </div>
      <div class="w-full sm:w-2/3 md:w-full lg:w-2/3 px-1">
        <div class="h-8" />
      </div>
      <!-- MARINE -->
      <div
        v-if="item.activeType === ShipmentType.MARINE"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.marine.billOfLadingNo"
          :debounce="250"
          :placeholder="$t('shipping.billOfLadingNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { marine: { billOfLadingNo: $event } } })"
        />
        <TextField
          :value="item.marine.ship"
          :debounce="250"
          :placeholder="$t('shipping.ship')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { marine: { ship: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.MARINE"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.containersCount')">
            {{ $t('shipping.containersCount') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.marine.containersCount"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { marine: { containersCount: $event } } })"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            :value="item.marine.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.containersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
            @input="$emit('update', { shipment: { marine: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <v-menu
              ref="menu"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="item.marine.exportDate ? $d($parseDate(item.marine.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    readonly
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.marine.exportDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="$emit('update', { shipment: { marine: { exportDate: $event || null } } })"
              ></v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>
      <!-- AIR -->
      <div
        v-if="item.activeType === ShipmentType.AIR"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.air.airWaybillNo"
          :debounce="250"
          :placeholder="$t('shipping.airWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { air: { airWaybillNo: $event } } })"
        />
        <TextField
          :value="item.air.flight"
          :debounce="250"
          :placeholder="$t('shipping.flight')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { air: { flight: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.AIR"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.numbersOfPkg')">
            {{ $t('shipping.numbersOfPkg') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.air.numbersOfPkg"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { air: { numbersOfPkg: $event } } })"
            />
          </div>
        </div>
      </div>
      <!-- RAILWAY -->
      <div
        v-if="item.activeType === ShipmentType.RAILWAY"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.railway.internationalWaybillNo"
          :debounce="250"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { railway: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.railway.train"
          :debounce="250"
          :placeholder="$t('shipping.train')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { railway: { train: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.RAILWAY"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.trainContainersCount')">
            {{ $t('shipping.trainContainersCount') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.railway.containersCount"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { railway: { containersCount: $event } } })"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            :value="item.railway.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.trainContainersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
            @input="$emit('update', { shipment: { railway: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <v-menu
              ref="menu"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="item.railway.exportDate ? $d($parseDate(item.railway.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    readonly
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.railway.exportDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="$emit('update', { shipment: { railway: { exportDate: $event || null } } })"
              ></v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>
      <!-- CAR -->
      <div
        v-if="item.activeType === ShipmentType.CAR"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.car.internationalWaybillNo"
          :debounce="250"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { car: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.car.vehicleNo"
          :debounce="250"
          :placeholder="$t('shipping.vehicleNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { car: { vehicleNo: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.CAR"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.semitrailerNo')">
            {{ $t('shipping.semitrailerNo') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.car.semitrailerNo"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { car: { semitrailerNo: $event } } })"
            />
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <v-menu
              ref="menu"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="item.car.exportDate ? $d($parseDate(item.car.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    readonly
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.car.exportDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="$emit('update', { shipment: { car: { exportDate: $event || null } } })"
              ></v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>
      <!-- MIXED -->
      <div
        v-if="item.activeType === ShipmentType.MIXED"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.mixed.internationalWaybillNo"
          :debounce="250"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { mixed: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.mixed.ship"
          :debounce="250"
          :placeholder="$t('shipping.ship')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { mixed: { ship: $event } } })"
        />
        <TextField
          :value="item.mixed.train"
          :debounce="250"
          :placeholder="$t('shipping.train')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { mixed: { train: $event } } })"
        />
        <TextField
          :value="item.mixed.flight"
          :debounce="250"
          :placeholder="$t('shipping.flight')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { mixed: { flight: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.MIXED"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.vehicleAndSemitrailerNo')">
            {{ $t('shipping.vehicleAndSemitrailerNo') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.mixed.vehicleNo"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { mixed: { vehicleNo: $event } } })"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            :value="item.mixed.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.containersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
            @input="$emit('update', { shipment: { mixed: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <v-menu
              ref="menu"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="item.mixed.exportDate ? $d($parseDate(item.mixed.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    readonly
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                  />
                </div>
              </template>
              <v-date-picker
                :value="$toISOString($parseDate(item.mixed.exportDate))"
                :locale="$i18n.locale"
                :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                :next-icon="icons.mdiChevronRight"
                :prev-icon="icons.mdiChevronLeft"
                color="#5a8199"
                no-title
                dark
                @change="$emit('update', { shipment: { mixed: { exportDate: $event || null } } })"
              ></v-date-picker>
            </v-menu>
          </div>
        </div>
      </div>
      <!-- EXPRESS -->
      <div
        v-if="item.activeType === ShipmentType.EXPRESS"
        class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1"
      >
        <TextField
          :value="item.express.postalNo"
          :debounce="250"
          :placeholder="$t('shipping.postalNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { express: { postalNo: $event } } })"
        />
        <TextField
          :value="item.express.deliveryService"
          :debounce="250"
          :placeholder="$t('shipping.deliveryService')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
          @input="$emit('update', { shipment: { express: { deliveryService: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.EXPRESS"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.numbersOfPkg')">
            {{ $t('shipping.numbersOfPkg') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.express.numbersOfPkg"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
              @input="$emit('update', { shipment: { express: { numbersOfPkg: $event } } })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { ShipmentType } from '../graphql/enums'
import { defaultFilter } from '../util/helpers'

export default {
  name: 'SpecShipment',
  props: {
    item: {
      type: Object,
      default: () => ({
        activeType: null,
        marine: {},
        air: {},
        railway: {},
        car: {},
        mixed: {},
        express: {},
      }),
    },
  },
  data () {
    return {
      shipmentTypeSearch: '',
      ShipmentType,
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  computed: {
    shipmentTypes () {
      const items = Object.values(ShipmentType).filter(el => el !== ShipmentType.UNDEFINED).map(el => {
        return {
          text: this.$t(`shipmentType.${el}`),
          value: el,
        }
      })
      if (this.shipmentTypeSearch) {
        return items.filter(item => Object.values(item).some(el => defaultFilter(el, this.shipmentTypeSearch)))
      }
      return items
    },
  },
}
</script>
