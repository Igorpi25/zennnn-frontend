<template>
  <div class="w-full flex-grow lg:w-auto pb-8 lg:pb-0 lg:pr-3">
    <h4 class="text-white text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.forDeliver') }}
    </h4>
    <div class="bg-gray-700 rounded-t-md flex flex-wrap lg:flex-nowrap items-center mb-1 py-2 px-sm">
      <div class="w-full pb-5 lg:p-0 lg:w-1/3">
        <TextField
          :value="item.sentFrom"
          :debounce="250"
          :placeholder="$t('shipping.sentFrom')"
          dense
          @input="$emit('update', { shipment: { sentFrom: $event } })"
        />
      </div>

      <div class="flex justify-center w-full lg:w-auto px-1 xl:px-2">
        <svg class="transform rotate-90 lg:rotate-0" width="32" height="5" viewBox="0 0 32 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M31.4001 2.30004L27.8001 3.95216e-05C27.7001 -0.0999605 27.5001 3.95253e-05 27.5001 0.10004C27.5001 0.20004 27.5001 0.40004 27.6001 0.40004L30.4001 2.20004H0.00012207V2.70004H30.4001L27.6001 4.50004C27.5001 4.60004 27.4001 4.70004 27.5001 4.80004C27.5001 5.00004 27.6001 5.00004 27.7001 5.00004H27.8001L31.4001 2.70004C31.5001 2.70004 31.5001 2.60004 31.5001 2.50004C31.5001 2.40004 31.5001 2.40004 31.4001 2.30004Z" fill="#676767"/>
        </svg>
      </div>

      <div class="w-full flex-1 py-5 lg:p-0">
        <TextField
          :value="item.sentThrough"
          :debounce="250"
          :placeholder="$t('shipping.sentThrough')"
          dense
          @input="$emit('update', { shipment: { sentThrough: $event } })"
        />
      </div>

      <div class="flex justify-center w-full lg:w-auto px-1 xl:px-2">
        <svg class="transform rotate-90 lg:rotate-0" width="32" height="5" viewBox="0 0 32 5" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M31.4001 2.30004L27.8001 3.95216e-05C27.7001 -0.0999605 27.5001 3.95253e-05 27.5001 0.10004C27.5001 0.20004 27.5001 0.40004 27.6001 0.40004L30.4001 2.20004H0.00012207V2.70004H30.4001L27.6001 4.50004C27.5001 4.60004 27.4001 4.70004 27.5001 4.80004C27.5001 5.00004 27.6001 5.00004 27.7001 5.00004H27.8001L31.4001 2.70004C31.5001 2.70004 31.5001 2.60004 31.5001 2.50004C31.5001 2.40004 31.5001 2.40004 31.4001 2.30004Z" fill="#676767"/>
        </svg>
      </div>

      <div class="w-full flex-1 pt-5 lg:p-0">
        <TextField
          :value="item.sentDestination"
          :debounce="250"
          :placeholder="$t('shipping.destination')"
          dense
          @input="$emit('update', { shipment: { sentDestination: $event } })"
        />
      </div>
    </div>

    <div class="bg-gray-700 rounded-b-md flex flex-wrap pt-4 pb-5" style="padding-left: 6px; padding-right: 6px;">
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1 pb-2">
        <Select
          :value="item.activeType"
          :placeholder="$t('shipping.shipmentType')"
          v-model:search="shipmentTypeSearch"
          :items="shipmentTypes"
          dense
          searchable
          @input="$emit('update', { shipment: { activeType: $event } })"
        />
      </div>
      <div class="w-full sm:w-2/3 md:w-full lg:w-2/3 px-1 pb-2">
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { marine: { billOfLadingNo: $event } } })"
        />
        <TextField
          :value="item.marine.ship"
          :debounce="250"
          :placeholder="$t('shipping.ship')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { marine: { ship: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.MARINE"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.containersCount')">
            {{ $t('shipping.containersCount') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.marine.containersCount"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
              @input="$emit('update', { shipment: { marine: { containersCount: $event } } })"
            />
          </div>
        </div>
        <div class="px-1 pb-2">
          <TextField
            :value="item.marine.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.containersNo')"
            dense
            @input="$emit('update', { shipment: { marine: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <DatePicker
              :value="item.marine.exportDate"
              @input="$emit('update', { shipment: { marine: { exportDate: $event } } })"
            >
              <template v-slot:activator>
                <div>
                  <TextField
                    :value="item.marine.exportDate ? $d($parseDate(item.marine.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    dense
                    readonly
                  />
                </div>
              </template>
            </DatePicker>
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { air: { airWaybillNo: $event } } })"
        />
        <TextField
          :value="item.air.flight"
          :debounce="250"
          :placeholder="$t('shipping.flight')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { air: { flight: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.AIR"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.numbersOfPkg')">
            {{ $t('shipping.numbersOfPkg') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.air.numbersOfPkg"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { railway: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.railway.train"
          :debounce="250"
          :placeholder="$t('shipping.train')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { railway: { train: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.RAILWAY"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.trainContainersCount')">
            {{ $t('shipping.trainContainersCount') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.railway.containersCount"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
              @input="$emit('update', { shipment: { railway: { containersCount: $event } } })"
            />
          </div>
        </div>
        <div class="px-1 pb-2">
          <TextField
            :value="item.railway.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.trainContainersNo')"
            dense
            @input="$emit('update', { shipment: { railway: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <DatePicker
              :value="item.railway.exportDate"
              @input="$emit('update', { shipment: { railway: { exportDate: $event } } })"
            >
              <template v-slot:activator>
                <div>
                  <TextField
                    :value="item.railway.exportDate ? $d($parseDate(item.railway.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    dense
                    readonly
                  />
                </div>
              </template>
            </DatePicker>
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { car: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.car.vehicleNo"
          :debounce="250"
          :placeholder="$t('shipping.vehicleNo')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { car: { vehicleNo: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.CAR"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.semitrailerNo')">
            {{ $t('shipping.semitrailerNo') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.car.semitrailerNo"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
              @input="$emit('update', { shipment: { car: { semitrailerNo: $event } } })"
            />
          </div>
        </div>
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <DatePicker
              :value="item.car.exportDate"
              @input="$emit('update', { shipment: { car: { exportDate: $event } } })"
            >
              <template v-slot:activator>
                <div>
                  <TextField
                    :value="item.car.exportDate ? $d($parseDate(item.car.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    dense
                    readonly
                  />
                </div>
              </template>
            </DatePicker>
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { mixed: { internationalWaybillNo: $event } } })"
        />
        <TextField
          :value="item.mixed.ship"
          :debounce="250"
          :placeholder="$t('shipping.ship')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { mixed: { ship: $event } } })"
        />
        <TextField
          :value="item.mixed.train"
          :debounce="250"
          :placeholder="$t('shipping.train')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { mixed: { train: $event } } })"
        />
        <TextField
          :value="item.mixed.flight"
          :debounce="250"
          :placeholder="$t('shipping.flight')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { mixed: { flight: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.MIXED"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.vehicleAndSemitrailerNo')">
            {{ $t('shipping.vehicleAndSemitrailerNo') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.mixed.vehicleNo"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
              @input="$emit('update', { shipment: { mixed: { vehicleNo: $event } } })"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            :value="item.mixed.containersNo"
            :debounce="250"
            :placeholder="$t('shipping.containersNo')"
            dense
            class="pb-2"
            @input="$emit('update', { shipment: { mixed: { containersNo: $event } } })"
          />
        </div>
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.exportDate')">
            {{ $t('shipping.exportDate') }}:
          </div>
          <div class="w-1/2 px-1">
            <DatePicker
              :value="item.mixed.exportDate"
              @input="$emit('update', { shipment: { mixed: { exportDate: $event } } })"
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <TextField
                    :value="item.mixed.exportDate ? $d($parseDate(item.mixed.exportDate), 'short'): ''"
                    :placeholder="$t('placeholder.notIndicated')"
                    dense
                    readonly
                  />
                </div>
              </template>
            </DatePicker>
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
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { express: { postalNo: $event } } })"
        />
        <TextField
          :value="item.express.deliveryService"
          :debounce="250"
          :placeholder="$t('shipping.deliveryService')"
          dense
          class="pb-2"
          @input="$emit('update', { shipment: { express: { deliveryService: $event } } })"
        />
      </div>
      <div
        v-if="item.activeType === ShipmentType.EXPRESS"
        class="w-full sm:w-2/3 md:w-full lg:w-2/3"
      >
        <div class="flex items-center pb-2">
          <div class="w-1/2 text-right px-1 truncate" :title="$t('shipping.numbersOfPkg')">
            {{ $t('shipping.numbersOfPkg') }}:
          </div>
          <div class="w-1/2 px-1">
            <TextField
              :value="item.express.numbersOfPkg"
              :debounce="250"
              :placeholder="$t('placeholder.notIndicated')"
              dense
              @input="$emit('update', { shipment: { express: { numbersOfPkg: $event } } })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ShipmentType } from '../graphql/enums'

import Select from './Base/Select'
import TextField from './Base/TextField'
import DatePicker from './Base/DatePicker'

export default {
  name: 'SpecShipment',
  components: {
    Select,
    TextField,
    DatePicker,
  },
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
      return items
    },
  },
}
</script>
