<template>
  <div
    class="flex flex-col relative w-full overflow-y-auto overflow-scroll-touch max-h-screen px-2 py-6 text-gray-100"
  >
    <!-- Header -->
    <div class="px-3">
      <div class="flex flex-col sm:flex-row">
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
    </div>
    <!-- Body -->
    <div class="py-6">
      <form ref="form" class="bg-gray-600 rounded py-6">
        <!-- REQUISITE -->
        <h5 class="uppercase mb-3 px-3">
          <span class="inline-block font-bold">{{ $t('shipping.supplierTitle') }}</span>&nbsp;<span class="inline-block font-bold text-gray-light">{{ $t('shipping.supplierSubtitle') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('requisite.label.companyName') }}</span>
              </label>
              <Select
                :value="requisite"
                :placeholder="$t('placeholder.notIndicated')"
                :nudge-bottom="32"
                :search.sync="requisiteSearch"
                :items="requisites"
                searchable
                return-object
                item-value="id"
                item-text="name"
                solo
                squared
                hide-details
                class="text-sm select_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                @input="setRequisite"
                @click:append-item="createRequisite"
              >
                <template v-slot:append-item>
                  <span class="flex jusitfy-center">
                    <Icon class="mr-1">{{ icons.mdiPlusCircleOutline }}</Icon>
                    <span>{{ $t('action.create') }}</span>
                  </span>
                </template>
                <template v-slot:append="{ isMenuOpen, toggle }">
                  <div class="text-primary cursor-pointer select-none" @click="toggle">
                    <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                    <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                  </div>
                </template>
              </Select>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('requisite.label.address') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                :value="requisite.legalAddress"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ legalAddress: $event })"
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
                  <span>{{ $t('requisite.label.phone') }}</span>
                </label>
                <TextField
                  :value="requisite.phone"
                  :debounce="250"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!hasRequisite"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="updateRequisite({ phone: $event })"
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
                  <span>{{ $t('requisite.label.fax') }}</span>
                </label>
                <TextField
                  :value="requisite.fax"
                  :debounce="250"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!hasRequisite"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="updateRequisite({ fax: $event })"
                />
              </div>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('requisite.label.email') }}</span>
              </label>
              <TextField
                :value="requisite.email"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ email: $event })"
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
                <span>{{ $t('requisite.label.website') }}</span>
              </label>
              <TextField
                :value="requisite.website"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-gray-200"
                @input="updateRequisite({ website: $event })"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('requisite.label.bankName') }}</span>
              </label>
              <TextField
                :value="requisite.bankName"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ bankName: $event })"
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
                <span>{{ $t('requisite.label.bankAddress') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                :value="requisite.bankAddress"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ bankAddress: $event })"
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
                <span>{{ $t('requisite.label.accountNumber') }}</span>
              </label>
              <TextField
                :value="requisite.bankAccountNumber"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ bankAccountNumber: $event })"
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
                <span>{{ $t('requisite.label.swift') }}</span>
              </label>
              <TextField
                :value="requisite.swift"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateRequisite({ swift: $event })"
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
                <span>{{ $t('requisite.label.itn') }} / {{ $t('shipping.vat') }}</span>
              </label>
              <TextField
                :value="requisite.itn"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!hasRequisite"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-yellow-500"
                @input="updateRequisite({ itn: $event })"
              />
            </div>
            <div class="pb-4 flex">
              <div class="w-2/5 pr-2">
                <label class="text-sm">
                  <span>{{ $t('requisite.label.bic') }}</span>
                </label>
                <TextField
                  :value="requisite.bic"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  :disabled="!hasRequisite"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="updateRequisite({ bic: $event })"
                />
              </div>
              <div class="w-3/5">
                <label class="text-sm">
                  <span>{{ $t('requisite.label.okpo') }}</span>
                </label>
                <TextField
                  :value="requisite.okpo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  :disabled="!hasRequisite"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="updateRequisite({ okpo: $event })"
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
                <span>{{ $t('client.label.companyName') }}</span>
              </label>
              <Select
                :value="specClient"
                :placeholder="$t('placeholder.notIndicated')"
                :nudge-bottom="32"
                :search.sync="clientSearch"
                :items="clients"
                searchable
                return-object
                item-value="id"
                item-text="name"
                solo
                squared
                hide-details
                class="text-sm select_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                @input="setSpecClient($event && $event.id)"
                @click:append-item="createClient"
              >
                <template v-slot:append-item>
                  <span class="flex jusitfy-center">
                    <Icon class="mr-1">{{ icons.mdiPlusCircleOutline }}</Icon>
                    <span>{{ $t('action.create') }}</span>
                  </span>
                </template>
                <template v-slot:append="{ isMenuOpen, toggle }">
                  <div class="text-primary cursor-pointer select-none" @click="toggle">
                    <Icon v-if="isMenuOpen">{{ icons.mdiChevronUp }}</Icon>
                    <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
                  </div>
                </template>
              </Select>
            </div>
            <template v-if="hasClient">
              <div class="pb-4">
                <label class="text-sm">
                  <!-- TODO: in Client type change address to placeOfResidence -->
                  <span>{{ $t('requisite.label.address') }}</span>&nbsp;
                  <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
                </label>
                <TextField
                  v-if="isClientTypeNatural"
                  :value="client.deliveryAddress"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="updateClient({ deliveryAddress: $event })"
                >
                  <template v-slot:append>
                    <span v-if="client.deliveryAddress" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
                <TextField
                  v-else
                  :value="client.legalAddress"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="updateClient({ legalAddress: $event })"
                >
                  <template v-slot:append>
                    <span v-if="client.legalAddress" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <template v-if="isClientTypeNatural">
                <div key="client-natural-firstName" class="pb-4">
                  <label class="text-sm">
                    <span>{{ $t('client.label.firstName') }}</span>
                  </label>
                  <TextField
                    :value="client.firstName"
                    :debounce="250"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    requried
                    @input="updateClient({ firstName: $event })"
                  >
                    <template v-slot:append>
                      <span v-if="client.firstName" class="text-green-500">
                        <Icon size="14">{{ icons.mdiCheck }}</Icon>
                      </span>
                    </template>
                  </TextField>
                </div>
                <div key="client-natural-lastName" class="pb-4">
                  <label class="text-sm">
                    <span>{{ $t('client.label.lastName') }}</span>
                  </label>
                  <TextField
                    :value="client.lastName"
                    :debounce="250"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    requried
                    @input="updateClient({ lastName: $event })"
                  >
                    <template v-slot:append>
                      <span v-if="client.lastName" class="text-green-500">
                        <Icon size="14">{{ icons.mdiCheck }}</Icon>
                      </span>
                    </template>
                  </TextField>
                </div>
                <div key="client-natural-middleName" class="pb-4">
                  <label class="text-sm">
                    <span>{{ $t('client.label.middleName') }}</span>
                  </label>
                  <TextField
                    :value="client.middleName"
                    :debounce="250"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                    @input="updateClient({ middleName: $event })"
                  />
                </div>
              </template>
              <div v-else key="client-contact-person" class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('client.label.contactPerson') }}</span>
                </label>
                <TextField
                  :value="client.contactPerson"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  requried
                  @input="updateClient({ contactPerson: $event })"
                >
                  <template v-slot:append>
                    <span v-if="client.contactPerson" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </template>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <template v-if="hasClient">
              <div class="pb-4 flex">
                <div class="w-4/6 pr-2">
                  <label class="text-sm">
                    <span>{{ $t('client.label.phone') }}</span>
                  </label>
                  <TextField
                    v-if="isClientTypeNatural"
                    :value="client.mobilePhone"
                    :debounce="250"
                    :placeholder="'000 - 00 - 00'"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    required
                    @input="updateClient({ mobilePhone: $event })"
                  >
                    <template v-slot:append>
                      <span v-if="client.mobilePhone" class="text-green-500">
                        <Icon size="14">{{ icons.mdiCheck }}</Icon>
                      </span>
                    </template>
                  </TextField>
                  <TextField
                    v-else
                    :value="client.phone"
                    :debounce="250"
                    :placeholder="'000 - 00 - 00'"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    required
                    @input="updateClient({ phone: $event })"
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
                    <span v-if="isClientTypeNatural">{{ $t('client.label.additionalPhone') }}</span>
                    <span v-else>{{ $t('client.label.fax') }}</span>
                  </label>
                  <TextField
                    v-if="isClientTypeNatural"
                    :value="client.additionalPhone"
                    :debounce="250"
                    :placeholder="'000 - 00 - 00'"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                    @input="updateClient({ additionalPhone: $event })"
                  />
                  <TextField
                    v-else
                    :value="client.fax"
                    :debounce="250"
                    :placeholder="'000 - 00 - 00'"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-gray-200"
                    @input="updateClient({ fax: $event })"
                  />
                </div>
              </div>
              <div class="pb-4">
                <div>
                  <label class="text-sm">
                    <span>{{ $t('client.label.email') }}</span>
                  </label>
                  <TextField
                    v-if="isClientTypeNatural"
                    :value="client.naturalEmail"
                    :debounce="250"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    required
                    @input="updateClient({ naturalEmail: $event })"
                  >
                    <template v-slot:append>
                      <span v-if="client.naturalEmail" class="text-green-500">
                        <Icon size="14">{{ icons.mdiCheck }}</Icon>
                      </span>
                    </template>
                  </TextField>
                  <TextField
                    v-else
                    :value="client.email"
                    :debounce="250"
                    :placeholder="$t('placeholder.notIndicated')"
                    solo
                    squared
                    hide-details
                    class="text-sm text-field_nd"
                    input-class="h-8 text-primary placeholder-pink-500"
                    required
                    @input="updateClient({ email: $event })"
                  >
                    <template v-slot:append>
                      <span v-if="client.email" class="text-green-500">
                        <Icon size="14">{{ icons.mdiCheck }}</Icon>
                      </span>
                    </template>
                  </TextField>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="border-t border-gray-900 m-3" />
        <!-- IMPORTER -->
        <h5 class="uppercase mb-3 px-3 pt-4">
          <label class="switch align-middle">
            <input
              v-model="isImporterActive"
              type="checkbox"
            />
            <span class="switch-slider" />
          </label>
          <span class="inline-block font-bold">{{ $t('shipping.importerTitle') }}</span>&nbsp;<span class="inline-block font-bold text-gray-light">{{ $t('shipping.importerSubtitle') }}</span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('client.label.companyName') }}</span>
              </label>
              <TextField
                :value="importer.consignee"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!isImporterActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateClient({ consignee: $event })"
              >
                <template v-slot:append>
                  <span v-if="importer.consignee" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <!-- TODO: in Client type change address to placeOfResidence -->
                <span>{{ $t('requisite.label.address') }}</span>&nbsp;
                <span class="text-gray-light">{{ $t('shipping.inEnglish') }}</span>
              </label>
              <TextField
                :value="importer.shippingAddress"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!isImporterActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateClient({ shippingAddress: $event })"
              >
                <template v-slot:append>
                  <span v-if="importer.shippingAddress" class="text-green-500">
                    <Icon size="14">{{ icons.mdiCheck }}</Icon>
                  </span>
                </template>
              </TextField>
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('client.label.contactPerson') }}</span>
              </label>
              <TextField
                :value="importer.importerContactPerson"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                :disabled="!isImporterActive"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="updateClient({ importerContactPerson: $event })"
              >
                <template v-slot:append>
                  <span v-if="importer.importerContactPerson" class="text-green-500">
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
                  <span>{{ $t('client.label.phone') }}</span>
                </label>
                <TextField
                  :value="importer.contactMobilePhone"
                  :debounce="250"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!isImporterActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="updateClient({ contactMobilePhone: $event })"
                >
                  <template v-slot:append>
                    <span v-if="importer.contactMobilePhone" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <div class="pb-4">
              <div class="w-4/6 pr-2">
                <label class="text-sm">
                  <span>{{ $t('client.label.fax') }}</span>
                </label>
                <TextField
                  :value="importer.importerFax"
                  :debounce="250"
                  :placeholder="'000 - 00 - 00'"
                  :disabled="!isImporterActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="updateClient({ importerFax: $event })"
                />
              </div>
            </div>
            <div class="pb-4">
              <div>
                <label class="text-sm">
                  <span>{{ $t('client.label.email') }}</span>
                </label>
                <TextField
                  :value="importer.importerEmail"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  :disabled="!isImporterActive"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="updateClient({ importerEmail: $event })"
                >
                  <template v-slot:append>
                    <span v-if="importer.importerEmail" class="text-green-500">
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
                :value="shipment.sentFrom"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="$emit('update', { shipment: { sentFrom: $event } })"
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
                :value="shipment.sentThrough"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-yellow-500"
                @input="$emit('update', { shipment: { sentThrough: $event } })"
              />
            </div>
            <div class="pb-4">
              <label class="text-sm">
                <span>{{ $t('shipping.destination') }}</span>
              </label>
              <TextField
                :value="shipment.sentDestination"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                solo
                squared
                hide-details
                class="text-sm text-field_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
                @input="$emit('update', { shipment: { sentDestination: $event } })"
              >
                <template v-slot:append>
                  <span v-if="shipment.sentDestination" class="text-green-500">
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
                    @change="$emit('update', { shipment: { marine: { exportDate: $event || null } } })"
                  ></v-date-picker>
                </v-menu>
              </div>
              <div class="w-1/2">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersCount') }}</span>
                </label>
                <TextField
                  :value="shipment.marine.containersCount"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { marine: { containersCount: $event } } })"
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
                :value="shipment.activeType"
                :placeholder="$t('placeholder.notIndicated')"
                :nudge-bottom="32"
                :items="shipmentTypes"
                solo
                squared
                hide-details
                class="text-sm select_nd"
                input-class="h-8 text-primary placeholder-pink-500"
                required
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
            <!-- MARINE -->
            <div v-if="shipment.activeType === ShipmentType.MARINE" key="marine">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.billOfLadingNo') }}</span>
                </label>
                <TextField
                  :value="shipment.marine.billOfLadingNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { marine: { billOfLadingNo: $event } } })"
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
                  :value="shipment.marine.ship"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { marine: { ship: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersNo') }}</span>
                </label>
                <TextField
                  :value="shipment.marine.containersNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  required
                  @input="$emit('update', { shipment: { marine: { containersNo: $event } } })"
                />
              </div>
            </div>
            <!-- AIR -->
            <div v-else-if="shipment.activeType === ShipmentType.AIR" key="air">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.airWaybillNo') }}</span>
                </label>
                <TextField
                  :value="shipment.air.airWaybillNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { air: { airWaybillNo: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.air && shipment.air.airWaybillNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.flight') }}</span>
                </label>
                <TextField
                  :value="shipment.air.flight"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { air: { flight: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.numbersOfPkg') }}</span>
                </label>
                <TextField
                  :value="shipment.air.numbersOfPkg"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { air: { numbersOfPkg: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.air && shipment.air.numbersOfPkg" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
            </div>
            <!-- RAILWAY -->
            <div v-else-if="shipment.activeType === ShipmentType.RAILWAY" key="railway">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  :value="shipment.railway.internationalWaybillNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { railway: { internationalWaybillNo: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.railway && shipment.railway.internationalWaybillNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.train') }}</span>
                </label>
                <TextField
                  :value="shipment.railway.train"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { railway: { train: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.trainContainersCount') }}</span>
                </label>
                <TextField
                  :value="shipment.railway.containersCount"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { railway: { containersCount: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.railway && shipment.railway.containersCount" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.trainContainersNo') }}</span>
                </label>
                <TextField
                  :value="shipment.railway.containersNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { railway: { containersNo: $event } } })"
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
                        input-class="h-8 text-primary placeholder-yellow-500"
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
                    @change="$emit('update', { shipment: { railway: { exportDate: $event || null } } })"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- CAR -->
            <div v-else-if="shipment.activeType === ShipmentType.CAR" key="car">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  :value="shipment.car.internationalWaybillNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { car: { internationalWaybillNo: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.car && shipment.car.internationalWaybillNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.vehicleNo') }}</span>
                </label>
                <TextField
                  :value="shipment.car.vehicleNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { car: { vehicleNo: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.semitrailerNo') }}</span>
                </label>
                <TextField
                  :value="shipment.car.semitrailerNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { car: { semitrailerNo: $event } } })"
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
                        input-class="h-8 text-primary placeholder-yellow-500"
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
                    @change="$emit('update', { shipment: { car: { exportDate: $event } } })"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- MIXED -->
            <div v-else-if="shipment.activeType === ShipmentType.MIXED" key="mixed">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.internationalWaybillNo') }}</span>
                </label>
                <TextField
                  :value="shipment.mixed.internationalWaybillNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { mixed: { internationalWaybillNo: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.mixed && shipment.mixed.internationalWaybillNo" class="text-green-500">
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
                  :value="shipment.mixed.ship"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { mixed: { ship: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.train') }}</span>
                </label>
                <TextField
                  :value="shipment.mixed.train"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { mixed: { train: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.flight') }}</span>
                </label>
                <TextField
                  :value="shipment.mixed.flight"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { mixed: { flight: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.vehicleAndSemitrailerNo') }}</span>
                </label>
                <TextField
                  :value="shipment.mixed.vehicleNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { mixed: { vehicleNo: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.containersNo') }}</span>
                </label>
                <TextField
                  :value="shipment.mixed.containersNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { mixed: { containersNo: $event } } })"
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
                        input-class="h-8 text-primary placeholder-yellow-500"
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
                    @change="$emit('update', { shipment: { mixed: { exportDate: $event || null } } })"
                  ></v-date-picker>
                </v-menu>
              </div>
            </div>
            <!-- EXPRESS -->
            <div v-else-if="shipment.activeType === ShipmentType.EXPRESS" key="express">
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.postalNo') }}</span>
                </label>
                <TextField
                  :value="shipment.express.postalNo"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { express: { postalNo: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.express && shipment.express.postalNo" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.deliveryService') }}</span>
                </label>
                <TextField
                  :value="shipment.express.deliveryService"
                  :debounce="250"
                  :placeholder="$t('placeholder.notIndicated')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { shipment: { express: { deliveryService: $event } } })"
                />
              </div>
              <div class="pb-4">
                <label class="text-sm">
                  <span>{{ $t('shipping.numbersOfPkg') }}</span>
                </label>
                <TextField
                  :value="shipment.express.numbersOfPkg"
                  :debounce="250"
                  :placeholder="$t('placeholder.notChosen')"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { shipment: { express: { numbersOfPkg: $event } } })"
                >
                  <template v-slot:append>
                    <span v-if="shipment.express && shipment.express.numbersOfPkg" class="text-green-500">
                      <Icon size="14">{{ icons.mdiCheck }}</Icon>
                    </span>
                  </template>
                </TextField>
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
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.countryOfOrigin') }}</span>
                </label>
                <Select
                  :value="customs.countryOfOrigin"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :search.sync="countriesSearch"
                  :items="shipmentCountries"
                  searchable
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { customs: { countryOfOrigin: $event } })"
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
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.termsLabel') }}</span>
                </label>
                <Select
                  :value="customs.terms"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="customsTerms"
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-pink-500"
                  required
                  @input="$emit('update', { customs: { terms: $event } })"
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
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.costLabel') }}</span>
                </label>
                <TextField
                  :value="customs.cost"
                  :placeholder="$t('placeholder.notChosen')"
                  lazy
                  type="number"
                  inputmode="decimal"
                  format-style="currency"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-yellow-500"
                  @input="$emit('update', { customs: { cost: $event } })"
                />
              </div>
              <div class="w-1/2 pl-1">
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.invoiceCurrency') }}</span>
                </label>
                <Select
                  :value="customs.currency"
                  :placeholder="$t('placeholder.notChosen')"
                  :nudge-bottom="32"
                  :items="[]"
                  disabled
                  solo
                  squared
                  hide-details
                  class="text-sm select_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="$emit('update', { customs: { currency: $event } })"
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
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.discountLabel') }}</span>
                </label>
                <TextField
                  :value="customs.discount"
                  :placeholder="$t('placeholder.notChosen')"
                  lazy
                  type="number"
                  inputmode="decimal"
                  format-style="currency"
                  solo
                  squared
                  hide-details
                  class="text-sm text-field_nd"
                  input-class="h-8 text-primary placeholder-gray-200"
                  @input="$emit('update', { customs: { discount: $event } })"
                />
              </div>
              <div class="w-1/3 px-1">
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.vatLabel') }}</span>
                </label>
                <Select
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
                <label class="text-sm">
                  <span class="block truncate">{{ $t('shipping.incomeTaxLabel') }}</span>
                </label>
                <Select
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
          <div class="w-full">
            <div class="w-full flex pb-4 px-3 sm:w-1/2 text-xl">
              <div class="whitespace-no-wrap">{{ $t('shipping.invoiceAmount') }}</div>
              <div class="flex-grow dots" />
              <div class="text-white whitespace-no-wrap">{{ $n(amount || 0, 'decimal') }}</div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span class="block truncate">{{ $t('shipping.amountInWords') }}</span>
              </label>
              <TextArea
                :value="amountInWords"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                squared
                hide-details
                class="text-sm text-area_nd"
                input-class="text-primary placeholder-yellow-500"
                @input="$emit('update', { amountInWords: $event })"
              />
            </div>
          </div>
          <div class="w-full sm:w-1/2 px-3">
            <div class="pb-4">
              <label class="text-sm">
                <span class="block truncate">{{ $t('shipping.amountInWordsClientLang') }}</span>
              </label>
              <TextArea
                :value="amountInWordsClientLang"
                :debounce="250"
                :placeholder="$t('placeholder.notIndicated')"
                rows="2"
                squared
                hide-details
                class="text-sm text-area_nd"
                input-class="text-primary placeholder-yellow-500"
                @input="$emit('update', { amountInWordsClientLang: $event })"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
    <!-- Footer -->
    <div class="px-3 pb-3">
      <div class="flex flex-col sm:flex-row">
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
    <v-dialog
      ref="requisiteDialog"
      v-model="requisiteDialog"
      :fullscreen="$vuetify.breakpoint.xs"
      scrollable
      max-width="1024"
      content-class="text-gray-100"
    >
      <RequisiteCard
        ref="requisiteCard"
        :org-id="orgId"
        create
        is-component
        @close="requisiteDialog = false"
        @create="setCreatedRequisite"
      />
    </v-dialog>
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
        @create="setSpecClient($event && $event.id)"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mdiCheck, mdiChevronUp, mdiChevronDown, mdiPlusCircleOutline } from '@mdi/js'
import Countries from '../config/countries-iso3.json'
import CountriesNames from '../config/countries-names.json'

import RequisiteCard from './RequisiteCard.vue'
import ClientCard from './ClientCard.vue'

import { UPDATE_CLIENT, UPDATE_REQUISITE, SET_SPEC_CLIENT } from '../graphql/mutations'
import { LIST_ORG_REQUISITES, SEARCH_CLIENTS } from '../graphql/queries'
import { ClientType, ShipmentType, CustomsTerms, CustomsTermsMore } from '../graphql/enums'

import { defaultFilter } from '../util/helpers'

export default {
  name: 'PrintSettings',
  components: {
    RequisiteCard,
    ClientCard,
  },
  apollo: {
    searchClients: {
      query: SEARCH_CLIENTS,
      variables () {
        return {
          orgId: this.orgId,
          search: this.clientSearch,
        }
      },
      fetchPolicy: 'cache-and-network',
      skip () {
        return !this.clientSearch
      },
      debounce: 300,
    },
    listOrgRequisites: {
      query: LIST_ORG_REQUISITES,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      result ({ data, loading }) {
        if (loading) this.requisiteLoading = true
        if (data) this.requisiteLoading = false
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  props: {
    orgId: String,
    specId: String,
    requisiteId: String,
    client: {
      type: Object,
      default: () => ({}),
    },
    shipment: {
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
    customs: {
      type: Object,
      default: () => ({}),
    },
    amount: {
      type: Number,
      default: 0,
    },
    amountInWords: String,
    amountInWordsClientLang: String,
  },
  data () {
    return {
      countriesSearch: '',
      clientDialog: false,
      clientSearch: '',
      updateClientLoading: false,
      requisiteSearch: '',
      requisiteDialog: false,
      requisiteLoading: false,
      isValid: false,
      ShipmentType,
      icons: {
        mdiCheck,
        mdiChevronUp,
        mdiChevronDown,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    isImporterActive: {
      get () {
        return !!this.importer.importerActive
      },
      set (val) {
        this.updateClient({ importerActive: !!val })
      },
    },
    importer () {
      return this.client || {}
    },
    hasClient () {
      return this.client && this.client.id
    },
    isClientTypeNatural () {
      return this.client && this.client.clientType === ClientType.NATURAL
    },
    hasRequisite () {
      return this.requisiteId
    },
    specClient () {
      const client = this.client || {}
      return {
        ...client,
        name: this.getClientName(client),
      }
    },
    clients () {
      const items = (this.searchClients && this.searchClients.items) || []
      return items.map(item => {
        return {
          ...item,
          name: this.getClientName(item),
        }
      })
    },
    requisites () {
      let items = this.listOrgRequisites || []
      if (this.requisiteSearch) {
        items = items.filter(item => defaultFilter(item.name, this.requisiteSearch))
      }
      return items
    },
    requisite () {
      return (this.listOrgRequisites || []).find(el => el.id === this.requisiteId) || {}
    },
    shipmentTypes () {
      return Object.values(ShipmentType).filter(el => el !== ShipmentType.UNDEFINED).map(el => {
        return {
          text: this.$t(`shipmentType.${el}`),
          value: el,
        }
      })
    },
    countries () {
      return Object.entries(Countries).map(([k, v]) => {
        return {
          text: v,
          value: k,
          name: CountriesNames[k] || null,
        }
      })
    },
    shipmentCountries () {
      if (this.countriesSearch) {
        return this.countries.filter(item => Object.values(item).some(el => defaultFilter(el, this.countriesSearch)))
      }
      return this.countries
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
      if (shipmentType === ShipmentType.RAILWAY || shipmentType === ShipmentType.CAR) {
        return this.customsTermsItems
      }
      if (shipmentType === ShipmentType.MARINE || shipmentType === ShipmentType.MIXED) {
        return [...this.customsTermsItems, { divider: true }, ...this.customsTermsMoreItems]
      }
      return []
    },
  },
  watch: {
    requisite: {
      handler () {
        this.$nextTick(() => {
          this.validate()
        })
      },
      deep: true,
    },
    client: {
      handler () {
        this.$nextTick(() => {
          this.validate()
        })
      },
      deep: true,
    },
    shipment: {
      handler () {
        this.$nextTick(() => {
          this.validate()
        })
      },
      deep: true,
    },
    customs: {
      handler () {
        this.$nextTick(() => {
          this.validate()
        })
      },
      deep: true,
    },
    isImporterActive () {
      this.$nextTick(() => {
        this.validate()
      })
    },
  },
  mounted () {
    this.validate()
  },
  methods: {
    getClientName (item) {
      if (!item) return ''
      let name = ''
      if (item.clientType === ClientType.LEGAL) {
        name = item.companyName || ''
      } else {
        name = item.firstName || ''
        name += name && item.lastName
          ? ` ${item.lastName}`
          : (item.lastName || '')
      }
      return name
    },
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
    async updateClient (input) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_CLIENT,
          variables: {
            id: this.client.id,
            input,
          },
        })
      } catch (error) {
        const message = !this.client || !this.client.id ? 'Покупатель не установлен.' : error.message
        this.$notify({
          color: 'red',
          text: message,
          timeout: 10000,
        })
        throw new Error(error)
      }
    },
    async updateRequisite (input) {
      try {
        await this.$apollo.mutate({
          mutation: UPDATE_REQUISITE,
          variables: {
            id: this.requisiteId,
            input,
          },
        })
      } catch (error) {
        const message = !this.requisiteId ? 'Продавец / Поставщик не установлен.' : error.message
        this.$notify({
          color: 'red',
          text: message,
          timeout: 10000,
        })
        throw new Error(error)
      }
    },
    setRequisite (val) {
      this.$emit('update', { requisite: val.id })
    },
    createRequisite () {
      this.requisiteDialog = true
      this.$nextTick(() => {
        if (this.$refs.requisiteCard) {
          this.$refs.requisiteCard.reset()
          if (this.$refs.requisiteDialog.$refs.dialog) {
            this.$refs.requisiteDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    setCreatedRequisite (item) {
      this.$emit('update', { requisite: item.id })
      this.requisiteDialog = false
    },
    createClient () {
      this.clientDialog = true
      this.$nextTick(() => {
        if (this.$refs.clientCard) {
          this.$refs.clientCard.reset()
          if (this.$refs.clientDialog.$refs.dialog) {
            this.$refs.clientDialog.$refs.dialog.scrollTop = 0
          }
        }
      })
    },
    async setSpecClient (clientId) {
      if (!clientId) return
      try {
        this.updateClientLoading = true
        await this.$apollo.mutate({
          mutation: SET_SPEC_CLIENT,
          variables: {
            specId: this.specId,
            clientId,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateClientLoading = false
        this.clientDialog = false
      }
    },
  },
}
</script>
