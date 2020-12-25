<template>
  <div class="flex flex-wrap">
    <div class="w-full sm:w-1/2 sm:pr-5">
      <div class="pb-2">
        <TextField
          :value="shipment.sentFrom"
          :debounce="500"
          :label="$t('shipping.fromLabel')"
          :placeholder="$t('shipping.deliveryPlaceholder')"
          :rules="[rules.required]"
          state-icon
          required
          @input="$emit('update', { shipment: { sentFrom: $event } })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="shipment.sentThrough"
          :debounce="500"
          :label="$t('shipping.viaLabel')"
          :placeholder="$t('shipping.deliveryPlaceholder')"
          :rules="[rules.required]"
          state-icon
          state-color="warn"
          @input="$emit('update', { shipment: { sentThrough: $event } })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="shipment.sentDestination"
          :debounce="500"
          :label="$t('shipping.toLabel')"
          :placeholder="$t('shipping.deliveryPlaceholder')"
          :rules="[rules.required]"
          state-icon
          required
          @input="$emit('update', { shipment: { sentDestination: $event } })"
        />
      </div>
      <div v-show="hasExportDate" class="pr-2">
        <DatePicker
          :value="exportDate"
          @input="updateExportDate"
        >
          <template v-slot:activator>
            <div style="max-width: 232px;">
              <TextField
                :value="exportDate ? $d($parseDate(exportDate), 'short'): ''"
                :label="$t('shipping.exportDate')"
                :placeholder="$t('companyDetail.placeholder.date')"
                :rules="[rules.required]"
                state-icon
                state-color="warn"
                readonly
              >
                <template v-slot:prepend>
                  <i class="zi-calendar text-lg" />
                </template>
              </TextField>
            </div>
          </template>
        </DatePicker>
      </div>
    </div>
    <div class="w-full sm:w-1/2 sm:pl-5">
      <div class="pb-2">
        <Select
          :value="activeType"
          :menu-attach="$refs.container"
          :label="$t('shipping.shipmentType')"
          :placeholder="$t('shipping.methodOfDispatchPlaceholder')"
          v-model:search="shipmentTypeSearch"
          :items="shipmentTypes"
          :rules="[rules.required]"
          state-icon
          searchable
          required
          @input="$emit('update', { shipment: { activeType: $event } })"
        >
        </Select>
      </div>
      <!-- MARINE -->
      <div v-show="shipment.activeType === ShipmentType.MARINE" key="marine">
        <TextField
          :value="shipment.marine.containersCount"
          :debounce="500"
          :label="$t('shipping.containersCount')"
          :placeholder="$t('placeholder.notIndicated')"
          :rules="[rules.required]"
          state-icon
          required
          @input="$emit('update', { shipment: { marine: { containersCount: $event } } })"
        />
        <div class="pb-2">
          <TextField
            :value="shipment.marine.billOfLadingNo"
            :debounce="500"
            :label="$t('shipping.billOfLadingNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { marine: { billOfLadingNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.marine.ship"
            :debounce="500"
            :label="$t('shipping.ship')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { marine: { ship: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.marine.containersNo"
            :debounce="500"
            :label="$t('shipping.containersNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { marine: { containersNo: $event } } })"
          />
        </div>
      </div>
      <!-- AIR -->
      <div v-show="shipment.activeType === ShipmentType.AIR" key="air">
        <div class="pb-2">
          <TextField
            :value="shipment.air.airWaybillNo"
            :debounce="500"
            :label="$t('shipping.airWaybillNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { air: { airWaybillNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.air.flight"
            :debounce="500"
            :label="$t('shipping.flight')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { air: { flight: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.air.numbersOfPkg"
            :debounce="500"
            :label="$t('shipping.numbersOfPkg')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { air: { numbersOfPkg: $event } } })"
          />
        </div>
      </div>
      <!-- RAILWAY -->
      <div v-show="shipment.activeType === ShipmentType.RAILWAY" key="railway">
        <div class="pb-2">
          <TextField
            :value="shipment.railway.internationalWaybillNo"
            :debounce="500"
            :label=" $t('shipping.internationalWaybillNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { railway: { internationalWaybillNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.railway.train"
            :debounce="500"
            :label="$t('shipping.train')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { railway: { train: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.railway.containersCount"
            :debounce="500"
            :label="$t('shipping.trainContainersCount')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { railway: { containersCount: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.railway.containersNo"
            :debounce="500"
            :label="$t('shipping.trainContainersNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { railway: { containersNo: $event } } })"
          />
        </div>
      </div>
      <!-- CAR -->
      <div v-show="shipment.activeType === ShipmentType.CAR" key="car">
        <div class="pb-2">
          <TextField
            :value="shipment.car.internationalWaybillNo"
            :debounce="500"
            :label="$t('shipping.internationalWaybillNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { car: { internationalWaybillNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.car.vehicleNo"
            :debounce="500"
            :label="$t('shipping.vehicleNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { car: { vehicleNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.car.semitrailerNo"
            :debounce="500"
            :label="$t('shipping.semitrailerNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { car: { semitrailerNo: $event } } })"
          />
        </div>
      </div>
      <!-- MIXED -->
      <div v-show="shipment.activeType === ShipmentType.MIXED" key="mixed">
        <div class="pb-2">
          <TextField
            :value="shipment.mixed.internationalWaybillNo"
            :debounce="500"
            :label="$t('shipping.internationalWaybillNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { mixed: { internationalWaybillNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.mixed.ship"
            :debounce="500"
            :label="$t('shipping.ship')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { mixed: { ship: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.mixed.train"
            :debounce="500"
            :label="$t('shipping.train')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { mixed: { train: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.mixed.flight"
            :debounce="500"
            :label="$t('shipping.flight')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { mixed: { flight: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.mixed.vehicleNo"
            :debounce="500"
            :label="$t('shipping.vehicleAndSemitrailerNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { mixed: { vehicleNo: $event } } })"
          />
        </div>
        <div class="pb-4">
          <TextField
            :value="shipment.mixed.containersNo"
            :debounce="500"
            :label="$t('shipping.containersNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { mixed: { containersNo: $event } } })"
          />
        </div>
      </div>
      <!-- EXPRESS -->
      <div v-show="shipment.activeType === ShipmentType.EXPRESS" key="express">
        <div class="pb-2">
          <TextField
            :value="shipment.express.postalNo"
            :debounce="500"
            :label="$t('shipping.postalNo')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { express: { postalNo: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.express.deliveryService"
            :debounce="500"
            :label="$t('shipping.deliveryService')"
            :placeholder="$t('placeholder.notIndicated')"
            :rules="[rules.required]"
            state-icon
            state-color="warn"
            @input="$emit('update', { shipment: { express: { deliveryService: $event } } })"
          />
        </div>
        <div class="pb-2">
          <TextField
            :value="shipment.express.numbersOfPkg"
            :debounce="500"
            :label="$t('shipping.numbersOfPkg')"
            :placeholder="$t('placeholder.notChosen')"
            :rules="[rules.required]"
            state-icon
            required
            @input="$emit('update', { shipment: { express: { numbersOfPkg: $event } } })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ShipmentType, CustomsTerms, CustomsTermsMore } from '../../graphql/enums'

import Select from '../Base/Select'
import TextField from '../Base/TextField'
import DatePicker from '../Base/DatePicker'

export default {
  name: 'PrintDelivery',
  components: {
    Select,
    TextField,
    DatePicker,
  },
  props: {
    item: {
      type: Object,
    },
  },
  data () {
    return {
      lazyItem: {
        marine: {},
        air: {},
        railway: {},
        car: {},
        mixed: {},
        express: {},
      },
      ShipmentType,
      shipmentTypeSearch: '',
      termsSearch: '',
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    shipment () {
      return this.lazyItem
    },
    activeType () {
      return this.shipment.activeType
    },
    hasExportDate () {
      const activeType = this.activeType
      return activeType === ShipmentType.MARINE || activeType === ShipmentType.RAILWAY ||
        activeType === ShipmentType.CAR || activeType === ShipmentType.MIXED
    },
    exportDate () {
      if (this.activeType && this.exportDateKey) {
        return this.shipment[this.exportDateKey].exportDate
      }
      return null
    },
    exportDateKey () {
      const type = this.activeType
      switch (type) {
        case ShipmentType.MARINE: return 'marine'
        case ShipmentType.RAILWAY: return 'railway'
        case ShipmentType.CAR: return 'car'
        case ShipmentType.MIXED: return 'mixed'
        default: return ''
      }
    },
    shipmentTypes () {
      const items = Object.values(ShipmentType).filter(el => el !== ShipmentType.UNDEFINED).map(el => {
        return {
          text: this.$t(`shipmentType.${el}`),
          value: el,
        }
      })
      return items
    },
    customsTermsItems () {
      return Object.values(CustomsTerms).map(el => {
        return {
          text: this.$t(`customsTerms.${el}`),
          value: el,
        }
      })
    },
    customsTermsMoreItems () {
      return Object.values(CustomsTermsMore).map(el => {
        return {
          text: this.$t(`customsTerms.${el}`),
          value: el,
        }
      })
    },
    customsTerms () {
      const shipmentType = this.shipment.activeType
      let items = []
      if (shipmentType === ShipmentType.RAILWAY || shipmentType === ShipmentType.CAR) {
        items = this.customsTermsItems
      }
      if (shipmentType === ShipmentType.MARINE || shipmentType === ShipmentType.MIXED) {
        items = [...this.customsTermsItems, { divider: true }, ...this.customsTermsMoreItems]
      }
      return items
    },
    contactPerson () {
      return this.item.contactPerson || {}
    },
  },
  watch: {
    item: {
      handler (val) {
        setTimeout(() => {
          this.lazyItem = val
        }, 100)
      },
      immediate: true,
    },
  },
  methods: {
    updateData (input) {
      this.$emit('update', input)
    },
    updateExportDate (val) {
      const key = this.exportDateKey
      this.$emit('update', { shipment: { [key]: { exportDate: val } } })
    },
  },
}
</script>
