<template>
  <div
    class="h-full px-2 py-6 text-gray-100"
  >
    <!-- Header -->
    <div class="flex flex-col sm:flex-row px-3">
      <div class="mb-3 sm:mb-0">
        <h4 class="text-xl font-semibold leading-6">
          {{ $t('shipping.toPrintInvoiceTitle') }}
        </h4>
        <p>
          {{ $t('shipping.toPrintInvoiceSubtitle') }}
        </p>
      </div>
      <div class="flex-grow" />
      <div>
        <button
          :disabled="!isValid"
          :class="[ isValid ? 'bg-primary hover:bg-primary-accent' : 'bg-gray-400 text-gray-100 cursor-default' ]"
          class="h-12 w-full sm:w-48 px-4 rounded-md focus:outline-none text-white focus:bg-primary-accent"
          @click="print"
        >
          {{ $t('shipping.doPrint') }}
        </button>
      </div>
    </div>
    <!-- Body -->
    <div class="py-6">
      <form ref="form" class="bg-gray-600 rounded py-6">
        <!-- SUPPLIER -->
        <h5 class="uppercase mb-3 px-3">
          <span class="inline-block font-bold">{{ $t('shipping.supplierTitle') }}</span>&nbsp;<span class="inline-block font-bold text-gray-light">{{ $t('shipping.supplierSubtitle') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.companyName') }}</span>
              </label>
              <TextField
                v-model="requisite.companyName"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.companyName" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.address') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                v-model="requisite.legalAddress"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.legalAddress" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4 flex">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('suppliers.phone') }}</span>
                </label>
                <TextField
                  v-model="requisite.phone"
                  :placeholder="'000 - 00 - 00'"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="requisite.phone" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <div class="pb-4">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('label.client.fax') }}</span>
                </label>
                <TextField
                  v-model="requisite.fax"
                  :placeholder="'000 - 00 - 00'"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.supplier.email') }}</span>
              </label>
              <TextField
                v-model="requisite.email"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.email" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.supplier.website') }}</span>
              </label>
              <TextField
                v-model="requisite.website"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-gray-200"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.bankName') }}</span>
              </label>
              <TextField
                v-model="requisite.bankName"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.bankName" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.bankAddress') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                v-model="requisite.bankAddress"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.bankAddress" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.supplier.accountNumber') }}</span>
              </label>
              <TextField
                v-model="requisite.bankAccountNumber"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.bankAccountNumber" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.swift') }}</span>
              </label>
              <TextField
                v-model="requisite.swift"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="requisite.swift" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.itn') }} / {{ $t('shipping.vat') }}</span>
              </label>
              <TextField
                v-model="requisite.itn"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-yellow-500"
              />
            </div>
            <div class="pb-4 flex">
              <div class="w-2/5 pr-2">
                <label class="text-sm">
                  <span>{{ $t('label.client.bic') }}</span>
                </label>
                <TextField
                  v-model="requisite.bic"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="w-3/5">
                <label class="text-sm">
                  <span>{{ $t('label.client.okpo') }}</span>
                </label>
                <TextField
                  v-model="requisite.okpo"
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
        <div class="border-t border-gray-900 m-3" />
        <!-- CLIENT -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <span class="inline-block font-bold">{{ $t('shipping.clientTitle') }}</span>&nbsp;<span class="inline-block font-bold text-gray-light">{{ $t('shipping.clientSubtitle') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.companyName') }}</span>
              </label>
              <TextField
                v-model="client.companyName"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="client.companyName" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.address') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                v-model="client.legalAddress"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="client.legalAddress" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.contactPerson') }}</span>
              </label>
              <TextField
                v-model="client.contactPerson"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                requried
              >
                <template v-slot:append>
                  <span v-if="client.contactPerson" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4 flex">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('suppliers.phone') }}</span>
                </label>
                <TextField
                  v-model="client.phone"
                  :placeholder="'000 - 00 - 00'"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="client.phone" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <div class="pb-4">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('label.client.fax') }}</span>
                </label>
                <TextField
                  v-model="client.fax"
                  :placeholder="'000 - 00 - 00'"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
            </div>
            <div class="pb-4">
              <div>
                <label class="text-sm">
                  <span>{{ $t('label.supplier.email') }}</span>
                </label>
                <TextField
                  v-model="client.email"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="client.email" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-900 m-3" />
        <!-- IMPORTER -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <label class="switch align-middle">
            <input type="checkbox" v-model="importerActive" />
            <span class="switch-slider" />
          </label>
          <span class="inline-block font-bold">{{ $t('shipping.importerTitle') }}</span>&nbsp;<span class="inline-block font-bold text-gray-light">{{ $t('shipping.importerSubtitle') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.companyName') }}</span>
              </label>
              <TextField
                v-model="client.importerCompanyName"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!importerActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="client.importerCompanyName" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('suppliers.address') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                v-model="client.importerAddress"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!importerActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="client.importerAddress" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('label.client.contactPerson') }}</span>
              </label>
              <TextField
                v-model="client.importerContactPerson"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!importerActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="client.importerContactPerson" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4 flex">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('suppliers.phone') }}</span>
                </label>
                <TextField
                  v-model="client.importerPhone"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!importerActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="client.importerPhone" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <div class="pb-4">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('label.client.fax') }}</span>
                </label>
                <TextField
                  v-model="client.importerFax"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!importerActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
            </div>
            <div class="pb-4">
              <div>
                <label class="text-sm">
                  <span>{{ $t('label.supplier.email') }}</span>
                </label>
                <TextField
                  v-model="client.importerEmail"
                  :placeholder="$t('placeholder.notIndicated')"
                  :disabled="!importerActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="client.importerEmail" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-900 m-3" />
        <!-- DELIVERY -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <span class="font-bold">{{ $t('shipping.forDeliver') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('shipping.sentFrom') }}</span>
              </label>
              <TextField
                v-model="shipment.sentFrom"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="shipment.sentFrom" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('shipping.sentThrough') }}</span>
              </label>
              <TextField
                v-model="shipment.sentThrough"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-yellow-500"
              />
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('shipping.destination') }}</span>
              </label>
              <TextField
                v-model="shipment.sentDestination"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append>
                  <span v-if="shipment.destination" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div
              v-if="shipment.activeType === ShipmentType.MARINE"
              class="pb-4 flex"
            >
              <div class="w-1/2 pr-2">
                <label class="text-sm">
                  <span>{{ $t('shipping.exportDate') }}</span>
                </label>
                <v-menu
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <TextField
                        :value="shipment.marine.exportDate ? $d($parseDate(shipment.marine.exportDate), 'short'): ''"
                        :placeholder="$t('placeholder.notIndicated')"
                        solo
                        squared
                        readonly
                        hide-details
                        class="text-sm text-field_nd"
                        input-class="h-8 text-primary placeholder-yellow-500"
                      />
                    </div>
                  </template>
                  <v-date-picker
                    :value="$toISOString($parseDate(shipment.marine.exportDate))"
                    :locale="$i18n.locale"
                    :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                    :next-icon="icons.mdiChevronRight"
                    :prev-icon="icons.mdiChevronLeft"
                    color="#5a8199"
                    no-title
                    dark
                    @change="shipment.marine.exportDate = $event || null"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div class="w-1/2">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersCount') }}</span>
                </label>
                <TextField
                  v-model="shipment.marine.containersCount"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="shipment.marine && shipment.marine.containersCount" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('shipping.shipmentType') }}</span>
              </label>
              <Select
                v-model="shipment.activeType"
                :placeholder="$t('placeholder.notIndicated')"
                :nudge-bottom="32"
                :items="shipmentTypes"
                solo
                squared
                hide-details
                class="text-sm select_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
              >
                <template v-slot:append="{ isMenuOpen, toggle }">
                  <div class="text-primary cursor-pointer select-none" @click="toggle">
                    <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                    <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                  </div>
                </template>
              </Select>
            </div>
            <!-- MARINE -->
            <div v-if="shipment.activeType === ShipmentType.MARINE">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.billOfLadingNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.marine.billOfLadingNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="shipment.marine && shipment.marine.billOfLadingNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.ship') }}</span>
                </label>
                <TextField
                  v-model="shipment.marine.ship"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.marine.containersNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  required
                >
                  <template v-slot:append>
                    <span v-if="shipment.marine && shipment.marine.containersNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <!-- AIR -->
            <div v-else-if="shipment.activeType === ShipmentType.AIR">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.airWaybillNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.air.airWaybillNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.flight') }}</span>
                </label>
                <TextField
                  v-model="shipment.air.flight"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.numbersOfPkg') }}</span>
                </label>
                <TextField
                  v-model="shipment.air.numbersOfPkg"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
            </div>
            <!-- RAILWAY -->
            <div v-else-if="shipment.activeType === ShipmentType.RAILWAY">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.railway.internationalWaybillNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.train') }}</span>
                </label>
                <TextField
                  v-model="shipment.railway.train"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.trainContainersCount') }}</span>
                </label>
                <TextField
                  v-model="shipment.railway.containersCount"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.trainContainersNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.railway.containersNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.exportDate') }}</span>
                </label>
                <v-menu
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <TextField
                        :value="shipment.railway.exportDate ? $d($parseDate(shipment.railway.exportDate), 'short'): ''"
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
                    :value="$toISOString($parseDate(shipment.railway.exportDate))"
                    :locale="$i18n.locale"
                    :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                    :next-icon="icons.mdiChevronRight"
                    :prev-icon="icons.mdiChevronLeft"
                    color="#5a8199"
                    no-title
                    dark
                    @change="shipment.railway.exportDate = $event || null"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- CAR -->
            <div v-else-if="shipment.activeType === ShipmentType.CAR">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.car.internationalWaybillNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.vehicleNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.car.vehicleNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.semitrailerNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.car.semitrailerNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.exportDate') }}</span>
                </label>
                <v-menu
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <TextField
                        :value="shipment.car.exportDate ? $d($parseDate(shipment.car.exportDate), 'short'): ''"
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
                    :value="$toISOString($parseDate(shipment.car.exportDate))"
                    :locale="$i18n.locale"
                    :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                    :next-icon="icons.mdiChevronRight"
                    :prev-icon="icons.mdiChevronLeft"
                    color="#5a8199"
                    no-title
                    dark
                    @change="shipment.car.exportDate = $event || null"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- MIXED -->
            <div v-else-if="shipment.activeType === ShipmentType.MIXED">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.internationalWaybillNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.ship') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.ship"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.train') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.train"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.flight') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.flight"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.vehicleAndSemitrailerNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.vehicleNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.mixed.containersNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.exportDate') }}</span>
                </label>
                <v-menu
                  transition="scale-transition"
                  min-width="290px"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <div v-on="on">
                      <TextField
                        :value="shipment.mixed.exportDate ? $d($parseDate(shipment.mixed.exportDate), 'short'): ''"
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
                    :value="$toISOString($parseDate(shipment.mixed.exportDate))"
                    :locale="$i18n.locale"
                    :first-day-of-week="$i18n.locale === 'ru' ? 1 : 0"
                    :next-icon="icons.mdiChevronRight"
                    :prev-icon="icons.mdiChevronLeft"
                    color="#5a8199"
                    no-title
                    dark
                    @change="shipment.mixed.exportDate = $event || null"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- EXPRESS -->
            <div v-else-if="shipment.activeType === ShipmentType.EXPRESS">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.postalNo') }}</span>
                </label>
                <TextField
                  v-model="shipment.express.postalNo"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.deliveryService') }}</span>
                </label>
                <TextField
                  v-model="shipment.express.deliveryService"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.numbersOfPkg') }}</span>
                </label>
                <TextField
                  v-model="shipment.express.numbersOfPkg"
                  :placeholder="$t('placeholder.emptyNumber')"
                  type="number"
                  inputmode="decimal"
                  format-style="decimal"
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
        <div class="border-t border-gray-900 m-3" />
        <!-- CUSTOMS -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <span class="font-bold">{{ $t('shipping.customsAndTaxes') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4 flex">
              <div class="w-1/2 pr-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.countryOfOrigin') }}</span>
                </label>
                <Select
                  v-model="customs.countryOfOrigin"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="deliveryCountries"
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append="{ isMenuOpen, toggle }">
                    <div class="text-primary cursor-pointer select-none" @click="toggle">
                      <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                      <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                    </div>
                  </template>
                </Select>
              </div>
              <div class="w-1/2 pl-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.termsLabel') }}</span>
                </label>
                <Select
                  v-model="customs.terms"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="deliveryTerms"
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                >
                  <template v-slot:append="{ isMenuOpen, toggle }">
                    <div class="text-primary cursor-pointer select-none" @click="toggle">
                      <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                      <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                    </div>
                  </template>
                </Select>
              </div>
            </div>
            <div class="pb-4 flex">
              <div class="w-1/2 pr-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.costLabel') }}</span>
                </label>
                <TextField
                  v-model="customs.cost"
                  :placeholder="$t('placeholder.emptyNumber')"
                  type="number"
                  inputmode="decimal"
                  format-style="decimal"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                />
              </div>
              <div class="w-1/2 pl-1">
                <label class="text-sm truncate w-1/2 pl-1">
                  <span>{{ $t('shipping.invoiceCurrency') }}</span>
                </label>
                <Select
                  v-model="customs.currency"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="[]"
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
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4 flex">
              <div class="w-1/3 pr-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.discountLabel') }}</span>
                </label>
                <TextField
                  v-model="shipment.discount"
                  :placeholder="$t('placeholder.emptyNumber')"
                  type="number"
                  inputmode="decimal"
                  format-style="decimal"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                />
              </div>
              <div class="w-1/3 px-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.vatLabel') }}</span>
                </label>
                <Select
                  v-model="shipment.vat"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="[]"
                  disabled
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                >
                  <template v-slot:append="{ isMenuOpen }">
                    <div class="text-gray-darkest cursor-not-allowed">
                      <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                      <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                    </div>
                  </template>
                </Select>
              </div>
              <div class="w-1/3 pl-1">
                <label class="text-sm truncate">
                  <span>{{ $t('shipping.incomeTaxLabel') }}</span>
                </label>
                <Select
                  v-model="shipment.incomeTax"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="[]"
                  disabled
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                >
                  <template v-slot:append="{ isMenuOpen }">
                    <div class="text-gray-darkest cursor-not-allowed">
                      <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                      <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                    </div>
                  </template>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-900 m-3" />
        <!-- AMOUNT -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <span class="font-bold">{{ $t('shipping.amount') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div>
            <div class="w-full flex pb-4 px-3 sm:w-1/2 text-xl">
              <div class="whitespace-no-wrap">{{ $t('shipping.invoiceAmount') }}</div>
              <div class="flex-grow dots" />
              <div class="text-white whitespace-no-wrap">{{ $n(customs.amount || 0, 'decimal') }}</div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm truncate">
                <span>{{ $t('shipping.amountInWords') }}</span>
              </label>
              <TextArea
                v-model="customs.amountInWords"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                squared
                hide-details
                class="text-sm text-area_nd"
                input-class="text-primary placeholder-yellow-500"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm truncate">
                <span>{{ $t('shipping.amountInWordsClientLang') }}</span>
              </label>
              <TextArea
                v-model="customs.amountInWordsClientLang"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                squared
                hide-details
                class="text-sm text-area_nd"
                input-class="text-primary placeholder-yellow-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- Footer -->
    <div class="flex flex-col sm:flex-row px-3 pb-3">
      <button
        class="h-12 w-full mb-3 sm:mb-0 sm:w-48 px-4 rounded-md focus:outline-none border border-gray-400 hover:border-primary hover:text-primary focus:border-primary focus:text-primary"
        @click="$emit('close')"
      >
        {{ $t('shipping.cancelPrint') }}
      </button>
      <div class="flex-grow" />
      <button
        :disabled="!isValid"
        :class="[ isValid ? 'bg-primary hover:bg-primary-accent' : 'bg-gray-400 text-gray-100 cursor-default' ]"
        class="h-12 w-full sm:w-48 px-4 rounded-md focus:outline-none text-white focus:bg-primary-accent"
        @click="print"
      >
        {{ $t('shipping.doPrint') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mdiChevronUp, mdiChevronDown, mdiCheck } from '@mdi/js'
import { ShipmentType } from '../graphql/enums'

export default {
  name: 'PrintSettings',
  data () {
    return {
      isValid: false,
      ShipmentType,
      requisite: {},
      client: {},
      importerActive: false,
      shipment: {
        activeType: null,
        marine: {},
        air: {},
        railway: {},
        car: {},
        mixed: {},
        express: {},
      },
      customs: {},
      icons: {
        mdiChevronUp,
        mdiChevronDown,
        mdiCheck,
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
    deliveryCountries () {
      return [
        {
          text: 'CHN',
          value: 'CN',
        },
      ]
    },
    deliveryTerms () {
      return [
        {
          text: 'CFR',
          value: 'CFR',
        },
      ]
    },
  },
  watch: {
    requisite: {
      handler () {
        this.validate()
      },
      deep: true,
    },
    client: {
      handler () {
        this.validate()
      },
      deep: true,
    },
    shipment: {
      handler () {
        this.validate()
      },
      deep: true,
    },
    customs: {
      handler () {
        this.validate()
      },
      deep: true,
    },
    importerActive () {
      this.$nextTick(() => {
        this.validate()
      })
    },
  },
  mounted () {
    this.validate()
  },
  methods: {
    print () {
      this.$logger.log('submit form', this.validate())
      this.$emit('close')
    },
    validate () {
      let errorsCount = 0
      const form = this.$refs.form
      const elements = form.elements
      for (const el of elements) {
        if (!el.disabled && el.willValidate === true && !el.validity.valid) {
          if (el.validity.valueMissing) {
            errorsCount++
          }
        }
      }
      this.isValid = !errorsCount
      return errorsCount
    },
  },
}
</script>
