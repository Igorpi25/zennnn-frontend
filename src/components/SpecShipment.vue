<template>
  <div class="w-full pb-4 md:w-1/2 lg:w-4/6 md:pr-3">
    <h4 class="text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.forDeliver') }}
    </h4>
    <div class="bg-gray-700 rounded-t-md mb-1 py-1 px-2 flex flex-wrap items-center">
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          v-model="item.sentFrom"
          :placeholder="$t('shipping.sentFrom')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
      </div>
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          v-model="item.sentThrough"
          :placeholder="$t('shipping.sentThrough')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
      </div>
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <TextField
          v-model="item.sentDestination"
          :placeholder="$t('shipping.destination')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
      </div>
    </div>
    <div class="bg-gray-700 rounded-b-md py-1 px-2 flex flex-wrap">
      <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
        <Select
          v-model="item.activeType"
          :placeholder="$t('shipping.shipmentType')"
          :nudge-bottom="32"
          :items="shipmentTypes"
          solo
          squared
          hide-details
          class="text-sm select_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
          v-model="item.marine.billOfLadingNo"
          :placeholder="$t('shipping.billOfLadingNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.marine.ship"
          :placeholder="$t('shipping.ship')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.marine.containersCount"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            v-model="item.marine.containersNo"
            :placeholder="$t('shipping.containersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
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
                @change="item.marine.exportDate = $event || null"
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
          v-model="item.air.airWaybillNo"
          :placeholder="$t('shipping.airWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.air.flight"
          :placeholder="$t('shipping.flight')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.air.numbersOfPkg"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
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
          v-model="item.railway.internationalWaybillNo"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.railway.train"
          :placeholder="$t('shipping.train')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.railway.containersCount"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            v-model="item.railway.containersNo"
            :placeholder="$t('shipping.trainContainersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
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
                @change="item.railway.exportDate = $event || null"
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
          v-model="item.car.internationalWaybillNo"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.car.vehicleNo"
          :placeholder="$t('shipping.vehicleNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.car.semitrailerNo"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
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
                @change="item.car.exportDate = $event || null"
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
          v-model="item.mixed.internationalWaybillNo"
          :placeholder="$t('shipping.internationalWaybillNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.mixed.ship"
          :placeholder="$t('shipping.ship')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.mixed.train"
          :placeholder="$t('shipping.train')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.mixed.flight"
          :placeholder="$t('shipping.flight')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.mixed.vehicleNo"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
            />
          </div>
        </div>
        <div class="px-1">
          <TextField
            v-model="item.mixed.containersNo"
            :placeholder="$t('shipping.containersNo')"
            solo
            squared
            hide-details
            class="text-sm text-field_nd"
            input-class="h-8 text-primary placeholder-gray-200"
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
                @change="item.mixed.exportDate = $event || null"
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
          v-model="item.express.postalNo"
          :placeholder="$t('shipping.postalNo')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
        />
        <TextField
          v-model="item.express.deliveryService"
          :placeholder="$t('shipping.deliveryService')"
          solo
          squared
          hide-details
          class="text-sm text-field_nd"
          input-class="h-8 text-primary placeholder-gray-200"
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
              v-model="item.express.numbersOfPkg"
              :placeholder="$t('placeholder.notIndicated')"
              solo
              squared
              hide-details
              class="text-sm text-field_nd"
              input-class="h-8 text-primary placeholder-gray-200"
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

export default {
  name: 'SpecShipment',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      ShipmentType,
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  computed: {
    shipmentTypes () {
      return Object.values(ShipmentType).filter(el => el !== ShipmentType.UNDEFINED).map(el => {
        return {
          text: this.$t(`shipmentType.${el}`),
          value: el,
        }
      })
    },
  },
}
</script>
