<template>
  <div class="spec-summary">

    <v-dialog
      v-model="paperList"
      max-width="443"
    >
      <PaperListModal
        :items="papers"
        @close="paperList = false"
        @openPaper="openContract"
        @createPaper="createContract"
      />
    </v-dialog>

    <v-dialog
      v-model="paperConfigurator"
      :fullscreen="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
      content-class="dialog-full-height rounded-none paper-configurator-dialog"
      max-width="906"
      scrollable
      persistent
    >
      <PaperConfiguratorModal
        :blank="blank"
        :create="create"
        @update="contractCreated"
        @close="paperConfigurator = false"
      />
    </v-dialog>

    <v-dialog
      v-model="printDialog"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      content-class="dialog-full-height bg-gray-800"
      max-width="900"
      scrollable
      persistent
    >
      <PrintSettings
        :org-id="orgId"
        :spec-id="spec.id"
        :requisite-id="spec.requisite"
        :client="spec.client || {}"
        :shipment="spec.shipment"
        :customs="spec.customs"
        :amount="spec.amount"
        :amount-in-words="spec.amountInWords"
        :amount-in-words-client-lang="spec.amountInWordsClientLang"
        @update="v => updateSpec(v)"
        @close="printDialog = false"
        @print="doPrint"
      />
    </v-dialog>

    <div>
      <h4 class="text-lg mb-4">
        {{ $t('shipping.summaryTitle') }}
      </h4>
      <div class="spec-summary__wrapper flex-col lg:flex-row">
        <div class="spec-summary__info">
          <div v-if="containers.length > 0" class="relative pb-5">
            <div
              v-if="spec.shipped"
              class="spec-summary__container__image spec-summary__container__image--shipped w-full"
              style="top: -16px; left: -20px; width: 350px; background-size: contain; height: auto; z-index: 1;"
            />
            <template
              v-for="(container, i) of containers"
            >
              <div
                v-if="!container.full"
                :key="`unloaded-${i}`"
                class="spec-summary__container"
              >
                <div
                  class="spec-summary__container__image"
                  :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
                  :style="{
                    width: (container.loaded || 0) + '%',
                    height: container.size === '_20' ? '85px' : '48px'
                  }"
                />
                <img
                  v-if="container.size === '_20'"
                  width="210"
                  height="85"
                  src="/img/container-empty.svg"
                  alt="Container"
                >
                <img
                  v-else
                  width="210"
                  height="48"
                  src="/img/container-empty-sm.svg"
                  alt="Container"
                >
              </div>
              <div
                v-else
                :key="`loaded-${i}`"
              >
                <div
                  class="spec-summary__container"
                >
                  <div
                    class="spec-summary__container__image"
                    :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
                    :style="{
                      width: '100%',
                      height: container.size === '_20' ? '85px' : '48px'
                    }"
                  />
                  <div class="spec-summary__container__label">
                    {{ container.full }} x {{ container.size.replace('_', '') }}′{{ container.mode.replace('_', '') }}
                  </div>
                  <img
                    v-if="container.size === '_20'"
                    width="210"
                    height="85"
                    src="/img/container-empty.svg"
                    alt="Container"
                  >
                  <img
                    v-else
                    width="210"
                    height="48"
                    src="/img/container-empty-sm.svg"
                    alt="Container"
                  >
                </div>
                <div class="spec-summary__container py-2 flex justify-center text-white">
                  <Icon>{{ icons.mdiPlusThick }}</Icon>
                </div>
                <div
                  class="spec-summary__container"
                >
                  <div
                    class="spec-summary__container__image"
                    :class="[container.size === '_20' ? 'spec-summary__container__image--full' : 'spec-summary__container__image--full-sm']"
                    :style="{
                      width: (container.loaded || 0) + '%',
                      height: container.size === '_20' ? '85px' : '48px'
                    }"
                  />
                  <img
                    v-if="container.size === '_20'"
                    width="210"
                    height="85"
                    src="/img/container-empty.svg"
                    alt="Container"
                  >
                  <img
                    v-else
                    width="210"
                    height="48"
                    src="/img/container-empty-sm.svg"
                    alt="Container"
                  >
                </div>
              </div>
            </template>
          </div>
          <div>
            <ul class="leaders">
              <li
                v-for="(c, i) in containers"
                :key="i"
              >
                <span>
                  <select
                    :value="`${c.size}${c.mode}`"
                    :disabled="setContainerSizeLoading"
                    name="container-size"
                    class="simple-select"
                    @change="setContainerSize(c.id, $event)"
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
                  {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                </span>
                <span class="leaders__num">
                  {{ c.loaded }}%
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.estimateDate') }}</span>
                <span class="leaders__num">
                  {{ spec.estimateShippingDate ? $d($parseDate(spec.estimateShippingDate), 'short') : '-' }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalVolume') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalVolume, 'formatted') }} {{ $t('measure.m') }}<sup>3</sup>
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalWeight') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalWeight, 'formatted') }} {{ $t('measure.kg') }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.qtyOfPackages') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.qtyOfPackages, 'formatted') }}
                </span>
              </li>
            </ul>
            <ToggleButton
              :value="spec.shipped"
              class="my-6"
              @input="updateSpec({ shipped: $event })"
            >
              <span>{{ $t('shipping.setShipped') }}</span>
            </ToggleButton>
          </div>
        </div>
        <div class="spec-summary__cost">
          <div class="spec-summary__cost__card">
            <ul>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.finalCost') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <div class="flex-grow dots" />
                <!-- TODO to custom component or Intl polyfill -->
                <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.finalCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.finalCost || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.finalObtainCost') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.finalObtainCost || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.profit') }}  {{ $t('currency.CNY.symbol') }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div style="color: #00ff16;">{{ $n(spec.profit, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.profit || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div style="color: #00ff16;">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
            </ul>
          </div>
          <div class="spec-summary__cost__card" style="background-image: linear-gradient(to top, #272727 0%, #272727 80%, #1d1d1b 95%, #1d1d1b 100%);">
            <ul>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.totalPrepay') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div class="text-white">{{ $n(spec.totalPrepay, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalPrepay, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.totalPrepay, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.totalPrepay || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
              <li class="flex">
                <span class="flex-shrink-0">
                  {{ $t('shipping.totalClientDebt') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <div class="flex-grow dots" />
                <!-- <span class="flex">
                  <div style="color: #ff2900;">{{ $n(spec.totalClientDebt, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.totalClientDebt, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.totalClientDebt, 'decimal').slice(-2) }}</div>
                </span> -->
                <i18n-n :value="spec.totalClientDebt || 0" format="decimal" class="flex items-baseline">
                  <template v-slot:integer="slotProps">
                    <div style="color: #ff2900;">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n>
              </li>
            </ul>
          </div>
          <div class="flex justify-end items-center pt-2 pr-4">
            <span>{{ $t('shipping.documentRate') }}</span>
            <span class="mx-2">=</span>
            <TextField
              :debounce="250"
              :placeholder="$t('placeholder.emptyNumber')"
              type="number"
              inputmode="decimal"
              solo
              colored
              outlined
              hide-details
              class="text-sm text-right w-16 mr-2 sm:p-0 leading-normal"
            />
          </div>
        </div>
        <!-- <div class="spec-summary__actions">
          <Button text class="mb-4" @click="openPaperList">
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziSettings }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.paperConfigurator') }}</span>
          </Button>
          <Button text class="mb-4" @click.prevent>
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziPaperPlane }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.notifyClient') }}</span>
          </Button>
          <Button text class="mb-4" @click="printPDF">
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziPrint }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.print') }}</span>
          </Button>
          <Button text @click="accessControlDialog = true">
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziShare }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.share') }}</span>
          </Button>
        </div> -->
      </div>
    </div>
    <!-- <div>
      <div class="flex justify-center sm:block">
        <a
          :href="`/paper/${$route.params.specId}`"
          target="_blank"
          class="select-none"
        >
          <Button
            large
            squared
            outline
            style="max-width: 320px;"
          >
            <span class="text-lg">{{ $t('shipping.overview') }}</span>
          </Button>
        </a>
      </div>
    </div> -->

    <div class="py-10">
      <div class="flex flex-wrap">
        <!-- Delivery -->
        <SpecShipment
          :item="spec.shipment"
          @update="v => updateSpec(v)"
        />
        <!-- Customs -->
        <SpecCustoms
          :shipment-type="(spec.shipment && spec.shipment.activeType) || ''"
          :item="spec.customs"
          :amount="spec.amount"
          :amount-in-words="spec.amountInWords"
          :amount-in-words-client-lang="spec.amountInWordsClientLang"
          @update="v => updateSpec(v)"
        />
      </div>
    </div>

    <div class="pb-10">
      <h4 class="text-xl font-semibold leading-6 mb-4">
        {{ $t('shipping.actions') }}
      </h4>
      <div class="bg-gray-700 rounded-md p-3 select-none">
        <div class="flex flex-wrap lg:justify-between">
          <div class="w-full md:w-auto p-2">
            <a
              :href="`/paper/${$route.params.specId}`"
              target="_blank"
              class="w-full inline-block rounded-md border border-gray-400 hover:border-primary"
            >
              <div class="h-12 flex items-center px-2">
                <svg class="mr-2" width="26" height="16" viewBox="0 0 26 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.0396 0.000244141C7.45667 0.000244141 2.61757 3.25129 0.239624 8.00024C2.61757 12.7492 7.45667 16.0002 13.0396 16.0002C18.6224 16.0002 23.4616 12.7492 25.8396 8.00024C23.4617 3.25129 18.6224 0.000244141 13.0396 0.000244141ZM19.3509 4.24284C20.855 5.20219 22.1295 6.48719 23.0868 8.00024C22.1295 9.51329 20.8549 10.7983 19.3509 11.7576C17.461 12.9631 15.2786 13.6002 13.0396 13.6002C10.8006 13.6002 8.61822 12.9631 6.72837 11.7576C5.22437 10.7982 3.94987 9.51324 2.99252 8.00024C3.94982 6.48714 5.22437 5.20214 6.72837 4.24284C6.82632 4.18034 6.92527 4.11979 7.02482 4.06034C6.77587 4.74354 6.63962 5.48089 6.63962 6.25024C6.63962 9.78479 9.50502 12.6502 13.0396 12.6502C16.5742 12.6502 19.4396 9.78479 19.4396 6.25024C19.4396 5.48089 19.3034 4.74354 19.0545 4.06029C19.1539 4.11974 19.2529 4.18034 19.3509 4.24284ZM13.0396 5.45024C13.0396 6.77574 11.9651 7.85024 10.6396 7.85024C9.31412 7.85024 8.23962 6.77574 8.23962 5.45024C8.23962 4.12474 9.31412 3.05024 10.6396 3.05024C11.9651 3.05024 13.0396 4.12474 13.0396 5.45024Z" fill="#AAAAAA"/>
                </svg>
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.previewAsCustomer') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
              @click.prevent="openPaperList"
            >
              <div class="h-12 flex items-center px-2">
                <svg class="mr-2" width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.9891 3.84607L19.059 6.7762C18.788 7.04751 18.4137 7.21499 18.0004 7.21499C17.5867 7.21499 17.2115 7.04751 16.9404 6.7762L16.2342 6.07027C15.9631 5.79895 15.796 5.42445 15.796 5.01073C15.796 4.59701 15.9631 4.22272 16.2342 3.95162L19.1643 1.02149C17.3729 0.319629 15.2574 0.691561 13.8098 2.13921C11.8596 4.0891 11.8596 7.25089 13.8098 9.20067C15.7601 11.151 18.9215 11.151 20.8713 9.20067C22.3194 7.75323 22.6911 5.6379 21.9891 3.84607Z" fill="#AAAAAA"/>
                  <path d="M6.26881 12.8812L3.22821 15.7005C2.69073 16.1991 2.34901 16.9073 2.33401 17.6983C2.31901 18.4893 2.63372 19.2096 3.15235 19.7282L3.28297 19.8587C3.80116 20.3771 4.52145 20.692 5.31246 20.677C6.1039 20.6622 6.81134 20.3205 7.31024 19.7826L10.1295 16.742L6.26881 12.8812ZM6.13605 18.64C5.64914 19.1279 4.85856 19.1279 4.37079 18.64C3.88346 18.1527 3.88346 17.3621 4.37079 16.8748C4.85856 16.3869 5.64914 16.3869 6.13605 16.8748C6.62339 17.3621 6.62339 18.1527 6.13605 18.64Z" fill="#AAAAAA"/>
                  <path d="M11.0237 8.07837C10.8306 8.07837 10.6558 8.15627 10.5295 8.28282L7.2812 11.5314C7.15444 11.6579 7.07654 11.8327 7.07654 12.0256C7.07654 12.2188 7.15444 12.3936 7.2812 12.5198L14.5543 19.7934C15.7252 20.9636 17.6215 20.9632 18.7914 19.7934C19.9618 18.6233 19.9618 16.7266 18.7914 15.5563L11.5179 8.28282C11.3915 8.15627 11.2169 8.07837 11.0237 8.07837ZM16.0022 17.922C16.1962 18.1162 16.1962 18.434 16.0022 18.628C15.8081 18.8224 15.49 18.8224 15.2959 18.628L8.94059 12.2727C8.74621 12.0786 8.74621 11.7609 8.94059 11.5664C9.13465 11.3724 9.45236 11.3724 9.64674 11.5664L16.0022 17.922ZM17.6265 16.2978C17.8206 16.4921 17.8206 16.8098 17.6265 17.0041C17.4324 17.1984 17.1143 17.1984 16.9202 17.0041L10.5649 10.6485C10.3701 10.4542 10.3701 10.1365 10.5649 9.94231C10.7586 9.74804 11.0767 9.74804 11.2707 9.94253L17.6265 16.2978Z" fill="#AAAAAA"/>
                  <path d="M2.9327 5.81556L3.72714 5.78791L7.88161 9.94217L8.94061 8.88284L4.78668 4.72891L4.81411 3.93425C4.81625 3.86685 4.80168 3.79763 4.76782 3.73355C4.73407 3.66937 4.68435 3.61858 4.62691 3.58236L1.96188 1.90454L0.902344 2.96344L2.58113 5.62911C2.6167 5.68654 2.66814 5.7353 2.73189 5.76937C2.79608 5.80324 2.86509 5.81792 2.9327 5.81556Z" fill="#AAAAAA"/>
                </svg>
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.paperConfigurator') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
              @click.prevent="printDialog = true"
            >
              <div class="h-12 flex items-center px-2">
                <svg class="mr-2" width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.6397 9.39158C21.149 8.90095 20.5609 8.65577 19.8752 8.65577H19.042V5.32245C19.042 4.97534 18.9549 4.5932 18.7812 4.17673C18.6076 3.76007 18.3994 3.43024 18.1564 3.18716L16.177 1.20794C15.934 0.965088 15.6042 0.756667 15.1877 0.582953C14.771 0.409421 14.3892 0.322632 14.0418 0.322632H5.29168C4.94444 0.322632 4.64923 0.444081 4.40615 0.687163C4.1632 0.930108 4.04157 1.22527 4.04157 1.57256V8.65577H3.2083C2.52252 8.65577 1.93442 8.90108 1.44388 9.39158C0.953431 9.88194 0.708252 10.4701 0.708252 11.1559V16.5727C0.708252 16.6857 0.749526 16.7829 0.831936 16.8658C0.914438 16.948 1.01213 16.9892 1.12487 16.9892H4.04157V19.0725C4.04157 19.4199 4.16307 19.7151 4.40615 19.9581C4.64923 20.2009 4.94444 20.3226 5.29168 20.3226H17.7916C18.1387 20.3226 18.4343 20.2009 18.6772 19.9581C18.9202 19.7149 19.0418 19.4199 19.0418 19.0725V16.9892H21.9584C22.0711 16.9892 22.1688 16.948 22.2512 16.8658C22.3336 16.7829 22.3748 16.6857 22.3748 16.5727V11.1559C22.375 10.4701 22.1299 9.88194 21.6397 9.39158ZM17.375 18.6559H5.70834V15.3227H17.375V18.6559ZM17.375 10.3225H5.70834V1.98931H14.0418V4.07256C14.0418 4.41981 14.1635 4.71484 14.4062 4.95796C14.6492 5.20105 14.9443 5.32249 15.2918 5.32249H17.375V10.3225ZM20.4611 11.7418C20.2962 11.9066 20.1009 11.9893 19.8752 11.9893C19.6495 11.9893 19.4541 11.9066 19.2892 11.7418C19.1244 11.5771 19.042 11.3816 19.042 11.1559C19.042 10.9302 19.1244 10.7348 19.2892 10.57C19.454 10.405 19.6494 10.3225 19.8752 10.3225C20.1008 10.3225 20.2962 10.405 20.4611 10.57C20.6258 10.7348 20.7086 10.9302 20.7086 11.1559C20.7086 11.3816 20.626 11.5771 20.4611 11.7418Z" fill="#AAAAAA"/>
                </svg>
                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.print') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              href="#"
              class="w-full inline-block rounded-md border border-transparent hover:border-primary"
              @click.prevent="accessControlDialog = true"
            >
              <div class="h-12 flex items-center px-2">
                <svg class="mr-2" width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6798 13.5357C16.6926 12.4949 15.5064 11.7377 14.2571 11.3254C15.5018 10.2028 16.2856 8.57835 16.2856 6.77417C16.2856 3.39462 13.5361 0.645142 10.1565 0.645142C6.77699 0.645142 4.02746 3.39462 4.02746 6.77417C4.02746 8.57835 4.81119 10.2028 6.05592 11.3254C4.80656 11.7378 3.62042 12.495 2.63321 13.5358C1.03609 15.2196 0.156494 17.4008 0.156494 19.6774V20.6451H20.1565V19.6774C20.1565 17.4008 19.2769 15.2196 17.6798 13.5357ZM5.96295 6.77417C5.96295 4.46186 7.84418 2.58063 10.1565 2.58063C12.4688 2.58063 14.35 4.46186 14.35 6.77417C14.35 9.08649 12.4688 10.9677 10.1565 10.9677C7.84418 10.9677 5.96295 9.08649 5.96295 6.77417ZM2.16017 18.7097C2.64048 15.3281 5.57417 12.9032 8.22101 12.9032H12.092C14.7388 12.9032 17.6725 15.3281 18.1528 18.7097H2.16017Z" fill="#AAAAAA"/>
                  <path d="M22.7371 9.03225V6.12903H20.8017V9.03225H17.8984V10.9677H20.8017V13.871H22.7371V10.9677H25.6404V9.03225H22.7371Z" fill="#AAAAAA"/>
                </svg>

                <span class="text-primary whitespace-nowrap">
                  {{ $t('shipping.inviteCustomer') }}
                </span>
              </div>
            </a>
          </div>
          <div class="w-full md:w-auto p-2">
            <a
              class="w-full inline-block rounded-md border border-transparent hover:border-primary pointer-events-none"
              @click.prevent
            >
              <div class="h-12 flex items-center px-2 text-gray-400">
                <svg class="mr-2" width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.9985 11.6316L16.9985 11.6316C17.2638 11.5129 17.54 11.3893 17.828 11.2609C18.188 11.2609 18.4802 10.9687 18.4802 10.6087V2.3913C18.4802 1.07304 17.408 0 16.0889 0H5.21931C3.90018 0 2.828 1.07304 2.828 2.3913V10.6087C2.828 10.9687 3.12018 11.2609 3.48018 11.2609C3.81999 11.4155 4.1428 11.5631 4.45018 11.7037C7.45631 13.0783 8.98732 13.7783 10.5259 13.7954C12.1227 13.8131 13.7277 13.095 16.9985 11.6316ZM6.95845 10H14.3497C14.7097 10 15.0019 9.70785 15.0019 9.34785C15.0019 8.98785 14.7097 8.69568 14.3497 8.69568H6.95845C6.59845 8.69568 6.30627 8.98785 6.30627 9.34785C6.30627 9.70785 6.59845 10 6.95845 10ZM14.3497 7.39138H6.95845C6.59845 7.39138 6.30627 7.09921 6.30627 6.73921C6.30627 6.37921 6.59845 6.08704 6.95845 6.08704H14.3497C14.7097 6.08704 15.0019 6.37921 15.0019 6.73921C15.0019 7.09921 14.7097 7.39138 14.3497 7.39138ZM6.95845 4.78262H10.8715C11.2315 4.78262 11.5237 4.49044 11.5237 4.13045C11.5237 3.77045 11.2315 3.47827 10.8715 3.47827H6.95845C6.59845 3.47827 6.30627 3.77045 6.30627 4.13045C6.30627 4.49044 6.59845 4.78262 6.95845 4.78262Z" fill="currentColor"/>
                  <path d="M19.1323 20H2.17576C1.09663 20 0.219238 19.1226 0.219238 18.0435V7.52172C0.219238 6.80346 0.613151 6.14346 1.24793 5.79998L3.17228 4.77215C3.49141 4.60259 3.88532 4.72259 4.05489 5.03998C4.22445 5.35824 4.10445 5.75302 3.78706 5.92259L1.86532 6.94867C1.65924 7.06085 1.52359 7.28607 1.52359 7.52172V18.0435C1.52359 18.4035 1.81576 18.6956 2.17576 18.6956H19.1323C19.4923 18.6956 19.7844 18.4035 19.7844 18.0435V7.52172C19.7844 7.28607 19.6488 7.06085 19.4392 6.9478L17.5201 5.92346C17.2027 5.75389 17.0827 5.35911 17.2523 5.04085C17.4218 4.72346 17.8158 4.60259 18.1349 4.77302L20.0566 5.79911C20.6949 6.14346 21.0888 6.80346 21.0888 7.52172V18.0435C21.0888 19.1226 20.2114 20 19.1323 20Z" fill="currentColor"/>
                  <path d="M10.6531 14.7791C10.2723 14.7791 9.89227 14.6896 9.54618 14.5104L0.569663 9.82088C0.250533 9.65479 0.127055 9.26001 0.294011 8.94088C0.461837 8.62175 0.85575 8.49914 1.17401 8.66523L10.1479 13.3522C10.4592 13.5131 10.8505 13.5131 11.1644 13.3504L20.1357 8.66523C20.454 8.49827 20.8488 8.62175 21.0157 8.94088C21.1827 9.26001 21.0592 9.65392 20.7401 9.82088L11.7662 14.5078C11.4157 14.6887 11.0349 14.7791 10.6531 14.7791Z" fill="currentColor"/>
                </svg>
                <span class="whitespace-nowrap">
                  {{ $t('shipping.notifyCustomer') }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="accessControlDialog"
      max-width="320px"
    >
      <div class="p-4 bg-gray" style="color: #aaa;">
        <h3 class="pb-3 font-semibold">{{ $t('shipping.access') }}</h3>
        <Spinner v-if="linkAccessLoading" />
        <template v-else>
          <!-- <ToggleButton
            :value="linkAccess"
            class="mb-2"
            @input="updateLinkAccess"
          >
            <span>{{ $t('shipping.linkAccess') }}</span>
          </ToggleButton> -->
          <TextField
            ref="linkInput"
            :value="link"
            hide-details
            squared
            readonly
            solo
            class="mb-1"
          />
          <Button
            @click="copyLink"
          >
            {{ $t('shipping.copyLink') }}
          </Button>
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
          />
          <Button
            :disabled="sendAccessLinkLoading"
            @click="sendLinkAccessToEmail(emailAccessInput)"
          >
            {{ $t('shipping.sendEmail') }}
          </Button>
        </template>
        <Spinner v-if="emailAccessLoading" />
        <div v-else class="py-4">
          <h4 v-if="emailAccess.length > 0" class="font-semibold">Имеют доступ:</h4>
          <div
            v-for="a in emailAccess"
            :key="a.email"
            class="flex py-2"
          >
            <div class="flex-grow">
              {{ a.email }}
            </div>
            <v-slide-x-transition mode="out-in">
              <div v-if="removeEmailAccessLoading === a.email">
                <Spinner />
              </div>
              <div
                v-else
                class="cursor-pointer"
                @click="removeEmailAccess(a.email)"
              >
                <Icon size="18">
                  {{ icons.mdiClose }}
                </Icon>
              </div>
            </v-slide-x-transition>
          </div>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'

import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

import { mdiClose, mdiPlusThick } from '@mdi/js'
import { ziSettings, ziPaperPlane, ziPrint, ziShare } from '@/assets/icons'

import PaperListModal from '@/components/PaperListModal.vue'
import PaperConfiguratorModal from '@/components/PaperConfiguratorModal.vue'
import PrintSettings from '../components/PrintSettings.vue'
import SpecShipment from '../components/SpecShipment.vue'
import SpecCustoms from '../components/SpecCustoms.vue'

import Countries from '../config/countries-iso3.json'

import { ClientType, ShipmentType } from '../graphql/enums'
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

export default {
  name: 'SpecSummary',
  components: {
    PaperListModal,
    PaperConfiguratorModal,
    PrintSettings,
    SpecShipment,
    SpecCustoms,
  },
  props: {
    spec: {
      type: Object,
      default: () => ({}),
    },
  },
  apollo: {
    listOrgContracts: {
      query: LIST_ORG_CONTRACTS,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },

  },
  data () {
    return {
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
      icons: {
        mdiClose,
        mdiPlusThick,
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
    }
  },
  computed: {
    link () {
      return `${window.location.protocol}//${window.location.host}/paper/${this.specId}`
    },
    orgId () {
      return this.$route.params.orgId
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
  methods: {
    getLastPrepaymentDate () {
      let prepaymentDate = null
      const invoices = this.spec.invoices || []
      invoices.forEach(el => {
        if (el.prepaymentDate) {
          const d = this.$parseDate(el.prepaymentDate)
          if (!prepaymentDate || d > prepaymentDate) {
            prepaymentDate = d
          }
        }
      })
      return prepaymentDate
    },
    genLabel (path, clientLang, opt = {}) {
      const flat = opt.flat
      const secondary = opt.secondary
      const value = opt.value
      const fallback = opt.fallback
      const args = opt.args || {}
      const defaultLang = this.$i18n.fallbackLocale
      const isDefaultLang = clientLang === defaultLang
      const title = this.$te(path, defaultLang)
        ? this.$t(path, defaultLang, args)
        : fallback
      const subtitle = this.$te(path, clientLang)
        ? this.$t(path, clientLang, args)
        : ''
      if (flat) {
        const v = subtitle && !isDefaultLang ? `${title} / ${subtitle}` : `${title}`
        return secondary ? v : `${v}:`
      }
      const stack = []
      if (secondary) {
        stack.push({
          text: title,
        })
      } else if (value) {
        stack.push({
          text: [
            {
              text: `${title}:`,
              bold: true,
            },
            {
              text: value,
            },
          ],
        })
      } else {
        stack.push({
          text: `${title}:`,
          bold: true,
        })
      }
      if (subtitle && !isDefaultLang) {
        stack.push({
          text: subtitle,
          fontSize: 8,
          italics: true,
        })
      }
      return stack
    },
    genValues (...args) {
      let result = ''
      if (args.length > 0) {
        args.forEach(v => {
          const val = v || ''
          result += result ? ` / ${val}` : val
        })
      }
      return result
    },
    genBillToBody (client, clientLang) {
      const items = [
        [
          {
            stack: this.genLabel('print.billTo', clientLang),
          },
          {
            stack: [
              {
                text: client.fullName,
              },
            ],
          },
        ],
        client.clientType === ClientType.LEGAL
          ? [
            {
              stack: this.genLabel('print.addressTelFax', clientLang),
            },
            {
              stack: [
                {
                  text: this.genValues(client.legalAddress, client.phone, client.fax),
                },
              ],
            },
          ]
          : [
            {
              stack: this.genLabel('print.addressTelFax', clientLang),
            },
            {
              stack: [
                {
                  text: this.genValues(client.deliveryAddress, client.mobilePhone, client.additionalPhone),
                },
              ],
            },
          ],
      ]
      if (client.importerActive) {
        items.push([
          {
            stack: this.genLabel('print.importer', clientLang),
          },
          {
            stack: [
              {
                text: client.consignee,
              },
            ],
          },
        ])
        items.push([
          {
            stack: this.genLabel('print.addressTelFax', clientLang),
          },
          {
            stack: [
              {
                text: this.genValues(client.shippingAddress, client.contactMobilePhone, client.importerFax),
              },
            ],
          },
        ])
        items.push([
          {
            stack: this.genLabel('print.contactPersonEmail', clientLang),
          },
          {
            stack: [
              {
                text: this.genValues(client.contactPerson, client.importerEmail),
              },
            ],
          },
        ])
      }
      return items
    },
    genDeliveryInfoTable (shipment, clientLang) {
      const widths = shipment.sentThrough
        ? ['auto', '*', 'auto', '*', 'auto', '*']
        : ['auto', '*', '50%']
      const row1 = [
        {
          stack: this.genLabel('print.from', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 12, 0, 0],
          svg: `<svg viewBox="0 0 100 3" width="100" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="100" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.via', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 12, 0, 0],
          svg: `<svg viewBox="0 0 100 3" width="100" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="100" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.to', clientLang),
        },
        '',
      ]
      const row2 = [
        {
          stack: this.genLabel('print.from', clientLang),
        },
        {
          fit: ['*', 3],
          margin: [0, 12, 0, 0],
          svg: `<svg viewBox="0 0 180 3" width="180" height="3" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="180" y2="0" stroke="black" stroke-width="1"/><line x1="0" y1="2" x2="180" y2="2" stroke="black" stroke-width="1"/></svg>`,
        },
        {
          stack: this.genLabel('print.to', clientLang),
        },
      ]
      const row = shipment.sentThrough
        ? [
          {
            colSpan: 2,
            text: shipment.sentFrom,
          },
          '',
          {
            colSpan: 2,
            text: shipment.sentThrough,
          },
          '',
          {
            colSpan: 2,
            text: shipment.sentDestination,
          },
        ]
        : [
          {
            colSpan: 2,
            text: shipment.sentFrom,
          },
          '',
          {
            text: shipment.sentDestination,
          },
        ]
      return {
        widths,
        body: [
          shipment.sentThrough ? row1 : row2,
          row,
        ],
      }
    },
    genShipmentBody (shipment, customs, clientLang) {
      const result = []
      if (shipment.activeType === ShipmentType.MARINE) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.quanitiyOfContainers', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.containersCount,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.billOfLadingNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.billOfLadingNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.containersAndSealsNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.vessel', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.ship || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.marine.exportDate ? this.$d(this.$parseDate(shipment.marine.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          '',
          '',
        ])
      } else if (shipment.activeType === ShipmentType.AIR) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang),
          },
          {
            stack: this.genLabel('print.quanitiyOfCartons', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.numbersOfPkg,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.airWaybillNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.airWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.flight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.air.flight || '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.RAILWAY) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.qtyOfContainersPlatforms', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.containersCount,
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.crmNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.carriageNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.train', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.train || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.railway.exportDate ? this.$d(this.$parseDate(shipment.railway.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          '',
          '',
        ])
      } else if (shipment.activeType === ShipmentType.CAR) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.vehicle', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.vehicleNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.crmNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.trailer', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.semitrailerNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.car.exportDate ? this.$d(this.$parseDate(shipment.car.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.MIXED) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          '',
          '',
        ])
        result.push([
          {
            stack: this.genLabel('print.fblNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.internationalWaybillNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.vehicleTrailerFlight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.containersNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.vessel', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.ship || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.flight', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.flight || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.train', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.train || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.vehicle', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.vehicleNo || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.incoterms', clientLang),
          },
          {
            stack: [
              {
                text: customs.terms || '',
              },
            ],
          },
          {
            stack: this.genLabel('print.exportDate', clientLang),
          },
          {
            stack: [
              {
                text: shipment.mixed.exportDate ? this.$d(this.$parseDate(shipment.mixed.exportDate), 'short', clientLang) : '',
              },
            ],
          },
        ])
      } else if (shipment.activeType === ShipmentType.EXPRESS) {
        result.push([
          {
            stack: this.genLabel('print.methodOfDespatch', clientLang),
          },
          {
            stack: this.genLabel(`shipmentType.${shipment.activeType}`, clientLang, { secondary: true }),
          },
          {
            stack: this.genLabel('print.quanitiyOfCartons', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.numbersOfPkg || '',
              },
            ],
          },
        ])
        result.push([
          {
            stack: this.genLabel('print.trackingNo', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.postalNo,
              },
            ],
          },
          {
            stack: this.genLabel('print.deliveryCompany', clientLang),
          },
          {
            stack: [
              {
                text: shipment.express.deliveryService || '',
              },
            ],
          },
        ])
      }
      // Static
      result.push([
        {
          stack: this.genLabel('print.shippingMarks', clientLang),
        },
        {
          stack: this.genLabel('print.accordingToContract', clientLang, { secondary: true }),
        },
        {
          stack: this.genLabel('print.exportReference', clientLang),
        },
        {
          stack: this.genLabel('print.accordingToContract', clientLang, { secondary: true }),
        },
      ])
      return result
    },
    genItemBody (clientLang) {
      let index = 0
      const items = []
      const invoices = this.spec.invoices || []
      invoices.forEach(invoice => {
        const products = invoice.products || []
        products.forEach(product => {
          index++
          const clientPrice = (product.cost && product.cost.clientPrice) || 0
          const clientAmount = (product.cost && product.cost.clientAmount) || 0
          let name = product.name || ''
          if (product.article) {
            name += ` / ${product.article}`
          }
          if (product.info && product.info.description) {
            name += `\n${product.info.description}`
          }
          const unit = product.unit || 'pcs'
          const unitText = this.genLabel(`unit.${unit}`, clientLang, { flat: true, secondary: true })
          const item = [
            { text: `${index}`, alignment: 'center' },
            name,
            // TODO: dynamic product unit
            { text: `${product.qty || 0} ${unitText}`, alignment: 'right' },
            { text: this.$n(clientPrice, 'currency', 'en'), alignment: 'right' },
            { text: this.$n(clientAmount, 'currency', 'en'), alignment: 'right' },
          ]
          items.push(item)
        })
      })
      return items
    },
    genAmountBody (clientLang) {
      const lastPrepaymentDate = this.getLastPrepaymentDate()
      const border = lastPrepaymentDate
        ? [false, false, false, true]
        : [false, false, false, false]
      const result = [
        [
          '',
          {
            border,
            text: this.genLabel('print.balanceDue', clientLang, { flat: true }),
            alignment: 'right',
            fontSize: 14,
          },
          {
            border,
            text: this.$n(this.spec.totalClientDebt || 0, 'currency', 'en'),
            alignment: 'right',
            fontSize: 14,
          },
        ],
      ]
      if (lastPrepaymentDate) {
        const date = this.$d(this.$parseDate(lastPrepaymentDate), 'short', clientLang)
        result.push([
          '',
          {
            text: this.genLabel('print.depositeDue', clientLang, { flat: true, args: { date } }),
            alignment: 'right',
          },
          {
            text: this.$n(this.spec.totalPrepay, 'currency', 'en'),
            alignment: 'right',
          },
        ])
      }
      return result
    },
    genAmountInWords (clientLang) {
      const defaultLang = this.$i18n.fallbackLocale
      const isDefaultLang = clientLang === defaultLang
      const result = []
      if (this.spec.amountInWords) {
        result.push([
          {
            text: `${this.$t('print.amountInWords', defaultLang)}: ${this.spec.amountInWords.toUpperCase()}`,
            alignment: 'right',
          },
        ])
      }
      if (!isDefaultLang && this.spec.amountInWordsClientLang) {
        result.push([
          {
            text: `${this.$t('print.amountInWords', clientLang)}}: ${this.spec.amountInWordsClientLang}`,
            alignment: 'right',
          },
        ])
      }
      return result.length > 0
        ? {
          table: {
            widths: ['*'],
            body: result,
          },
          layout: {
            defaultBorder: false,
          },
          margin: [0, 0, 0, 30],
        }
        : null
    },
    doPrint (requisite, client, shipment, customs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs
      const defaultLang = this.$i18n.fallbackLocale
      const clientLang = client.language || defaultLang
      const specCreatedAt = this.$parseDate(this.spec.createdAt)
      const specDueDate = this.$parseDate(this.spec.createdAt)
      specDueDate.setTime(specDueDate.getTime() + 7 * 86400000)
      const dd = {
        header: (currentPage, pageCount, pageSize) => {
          return [
            {
              columns: [
                {
                  width: '50%',
                  text: clientLang === 'ru' ? '04021' : '',
                  margin: [4, 0, 4, 0],
                },
                {
                  width: '50%',
                  text: '', // 'Logotype / Логотип',
                  alignment: 'right',
                  margin: [4, 0, 4, 0],
                },
              ],
              margin: [40, 20, 40, 0],
            },
          ]
        },
        footer: (currentPage, pageCount) => {
          return [
            {
              columns: [
                {
                  width: '50%',
                  margin: [4, 0, 4, 0],
                  text: 'This document created automtically by zennnn.com',
                },
                {
                  width: '50%',
                  margin: [4, 0, 4, 0],
                  text: this.genLabel('print.sheet', clientLang, {
                    flat: true,
                    secondary: true,
                    args: {
                      p: currentPage,
                      t: pageCount,
                    },
                  }),
                  alignment: 'right',
                },
              ],
              fontSize: 9,
              italics: true,
              color: '#5e5e5e',
              margin: [40, 10, 40, 0],
            },
          ]
        },
        content: [
          // Requisite block
          {
            table: {
              widths: [110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.seller', clientLang),
                  },
                  requisite.name,
                ],
                [
                  {
                    stack: this.genLabel('print.addressTelFax', clientLang),
                  },
                  this.genValues(requisite.legalAddress, requisite.phone, requisite.fax),
                ],
                [
                  {
                    stack: this.genLabel('print.emailWeb', clientLang),
                  },
                  this.genValues(requisite.email, requisite.website),
                ],
                [
                  {
                    stack: this.genLabel('print.vatNo', clientLang),
                  },
                  requisite.itn || '',
                ],
                [
                  {
                    stack: this.genLabel('print.beneficiyBank', clientLang),
                  },
                  requisite.bankName,
                ],
                [
                  {
                    stack: this.genLabel('print.bankAddress', clientLang),
                  },
                  requisite.bankAddress,
                ],
                [
                  {
                    stack: this.genLabel('print.accountNumberSwift', clientLang),
                  },
                  this.genValues(requisite.bankAccountNumber, requisite.swift),
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 20],
          },
          // Spec info block
          {
            table: {
              widths: [110, '*', 85, 85],
              body: [
                [
                  {
                    fontSize: 22,
                    text: 'INVOICE',
                    bold: true,
                  },
                  {
                    stack: this.genLabel('print.invoiceNo', clientLang, { value: this.spec.specNo }),
                  },
                  {
                    alignment: 'right',
                    stack: this.genLabel('print.invoiceDate', clientLang),
                  },
                  {
                    alignment: 'right',
                    text: this.$d(this.getLastPrepaymentDate() || new Date(), 'short', clientLang),
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 8],
          },
          // Bill to block
          {
            table: {
              widths: [110, '*'],
              body: this.genBillToBody(client, clientLang),
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === 2 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 0, 0, 20],
          },
          // Shipment delivery info
          {
            table: this.genDeliveryInfoTable(shipment, clientLang),
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 20],
          },
          // Shipment
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: this.genShipmentBody(shipment, customs, clientLang),
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 8],
          },
          // Shipment Country of Origin
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.countryOfOrigin', clientLang),
                  },
                  {
                    stack: this.genLabel(`countries.${customs.countryOfOrigin}.iso-3`, clientLang, { fallback: Countries[customs.countryOfOrigin], secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.pkgListNo', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.spec.specNo,
                      },
                    ],
                  },
                ],
              ],
              margin: [0, 0, 0, 20],
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 0, 0, 20],
          },
          // Items
          {
            table: {
              widths: [40, '*', 90, 90, 90],
              body: [
                [
                  {
                    stack: this.genLabel('print.itemNo', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.itemDescription', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.itemQuantityUnit', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                  {
                    stack: this.genLabel('print.itemRatePrice', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                  {
                    stack: this.genLabel('print.itemAmount', clientLang, { secondary: true }),
                    alignment: 'right',
                  },
                ],
                ...this.genItemBody(clientLang),
              ],
            },
            headerRows: 1,
            layout: {
              hLineWidth: function (i, node) {
                return (i === 1 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
          },
          // Items Amounts
          {
            table: {
              widths: [80, 80, '*', 220, 90],
              body: [
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.subtotal', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(this.spec.finalCost || 0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.discount', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(customs.discount || 0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  {
                    rowSpan: 2,
                    stack: this.genLabel('print.invoiceCurrency', clientLang),
                  },
                  {
                    rowSpan: 2,
                    stack: this.genLabel('print.currency.usd', clientLang),
                  },
                  '',
                  {
                    text: this.genLabel('print.vat', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.shipping', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(customs.cost || 0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.total', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(this.spec.amount || 0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.withholdingTax', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
                [
                  '',
                  '',
                  '',
                  {
                    text: this.genLabel('print.paid', clientLang, { flat: true }),
                    alignment: 'right',
                  },
                  {
                    text: this.$n(0, 'currency', 'en'),
                    alignment: 'right',
                  },
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 20],
          },
          // Amount
          {
            table: {
              widths: ['*', '55%', 90],
              body: this.genAmountBody(clientLang),
            },
            layout: {
              defaultBorder: false,
            },
            margin: [0, 0, 0, 20],
          },
          // Amount in Words
          this.genAmountInWords(clientLang),
          // Contract
          {
            table: {
              widths: [110, '*', 110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.contractNo', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.spec.specNo,
                      },
                    ],
                  },
                  {
                    stack: this.genLabel('print.contractDate', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.$d(specCreatedAt, 'short', clientLang),
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.terms', clientLang),
                  },
                  {
                    stack: this.genLabel('print.NET7', clientLang, { secondary: true }),
                  },
                  {
                    stack: this.genLabel('print.dateDue', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: this.$d(specDueDate, 'short', clientLang),
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.paymentMethods', clientLang),
                  },
                  {
                    stack: this.genLabel('print.TTaccordingToContract', clientLang, { secondary: true }),
                  },
                  '',
                  '',
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return (i === 0 || i === node.table.body.length) ? 1 : 0
              },
              vLineWidth: function (i, node) {
                return 0
              },
            },
            margin: [0, 0, 0, 10],
          },
          // Contract confirmation text
          {
            stack: this.genLabel('print.confirmation', clientLang),
            margin: [4, 0, 4, 20],
          },
          // Sign
          // TODO: manager name transcript
          {
            table: {
              widths: [110, '*'],
              body: [
                [
                  {
                    stack: this.genLabel('print.manager', clientLang),
                  },
                  {
                    stack: [
                      {
                        text: client.ownerFullName,
                      },
                    ],
                  },
                ],
                [
                  {
                    stack: this.genLabel('print.sign', clientLang),
                  },
                  '',
                ],
              ],
            },
            layout: {
              defaultBorder: false,
            },
          },
        ],
        defaultStyle: {
          fontSize: 10,
        },
      }
      pdfMake.createPdf(dd).open()
    },
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
        await this.$apollo.mutate({
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
        const { data } = await this.$apollo.query({
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
        const result = await this.$apollo.mutate({
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
        const result = await this.$apollo.mutate({
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
        const result = await this.$apollo.mutate({
          mutation: SEND_LINK_ACCESS_TO_EMAIL,
          variables: {
            specId: this.specId,
            email,
          },
        })
        this.emailAccessInput = ''
        this.$notify({
          color: 'green',
          text: this.$t('message.emailSent', { email }),
          timeout: 6000,
        })
        return result
      } catch (error) {
        this.$notify({
          color: 'red',
          text: this.$t('message.failedToSent'),
          timeout: 6000,
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
            color: 'green',
            text: this.$t('message.linkCopied'),
            timeout: 6000,
          })
        } else {
          throw new Error('Unsuccessful.')
        }
      } catch (error) {
        this.$logger.info('Copy link error: ', error)
        this.$notify({
          color: 'orange',
          text: this.$t('message.linkNotCopied'),
          timeout: 6000,
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
        const { data } = await this.$apollo.query({
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
          text: 'Настройки доступа по ссылке обновлены.',
          timeout: 6000,
        })
      } catch (error) {
        throw new Error(error)
      }
    },
    async openLinkAccess () {
      try {
        const result = await this.$apollo.mutate({
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
        const result = await this.$apollo.mutate({
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
    printPDF () {
      pdfMake.vfs = pdfFonts.pdfMake.vfs
      const dd = {
        content: [
          {
            stack: [
              {
                text: [
                  { text: 'Спецификация No. ' },
                  { text: 'A0097-2020-02-02', bold: true },
                ],
              },
              'к Договору поставки',
            ],
            fontSize: 16,
            margin: [30, 20],
          },
          {
            columns: [
              { text: 'Новороссийск, Россия' },
              { text: '02 февраля 2020 г.', alignment: 'right' },
            ],
            alignment: 'justify',
            margin: [30, 10],
          },
          {
            text: [
              { text: '1.   ' },
              { text: 'Предмет поставки' },
            ],
            style: 'item-heading',
          },
          // TODO: dynamicly width of line equals width of table
          // {
          //   canvas: [
          //     {
          //       type: 'line',
          //       x1: 0,
          //       y1: 0,
          //       x2: 500,
          //       y2: 0,
          //       lineWidth: 1,
          //       lineColor: 'lightgray',
          //     },
          //   ],
          // },
          {
            table: {
              headerRows: 1,
              alignment: 'center',
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: '#', style: 'item-table-header' },
                  { text: 'Наименование товара', style: 'item-table-header' },
                  { text: 'Кол-во', style: 'item-table-header' },
                  { text: 'Ед.\n изм.', style: 'item-table-header' },
                  { text: 'Цена за ед.\n товара без НДС', style: 'item-table-header' },
                  { text: 'НДС за ед.\n (20%)', style: 'item-table-header' },
                  { text: 'Цена за ед.\n товара с НДС', style: 'item-table-header' },
                  { text: 'Стоимость товара\n с НДС', style: 'item-table-header' },
                ],
                [
                  { text: '1', fontSize: 10 },
                  {
                    text: [
                      { text: 'Chair\n', bold: true },
                      { text: 'PL-G0988-G0988-G0988 kfjgfd dfjgksdfjg' },
                    ],
                    fontSize: 10,
                  },
                  { text: '1 500', style: 'item-table' },
                  { text: 'pc', fontSize: 10 },
                  { text: '440,00', style: 'item-table' },
                  { text: '88,00', style: 'item-table' },
                  { text: '528,00', style: 'item-table' },
                  { text: '792 000,00 P', style: 'item-table' },
                ],
                [
                  { text: '2', fontSize: 10 },
                  {
                    text: [
                      { text: 'Chair\n', bold: true },
                      { text: 'PL-G0988' },
                    ],
                    fontSize: 10,
                  },
                  { text: '1 500', style: 'item-table' },
                  { text: 'pc', fontSize: 10 },
                  { text: '440,00', style: 'item-table' },
                  { text: '88,00', style: 'item-table' },
                  { text: '528,00', style: 'item-table' },
                  { text: '792 000,00 P', style: 'item-table' },
                ],
                [
                  { text: '3', fontSize: 10 },
                  {
                    text: [
                      { text: 'Chair\n', bold: true },
                      { text: 'PL-G0988' },
                    ],
                    fontSize: 10,
                  },
                  { text: '1 500', style: 'item-table' },
                  { text: 'pc', fontSize: 10 },
                  { text: '440,00', style: 'item-table' },
                  { text: '88,00', style: 'item-table' },
                  { text: '528,00', style: 'item-table' },
                  { text: '792 000,00 P', style: 'item-table' },
                ],
                [
                  { text: '', colSpan: 5 },
                  {}, {}, {}, {},
                  { text: 'Total:', style: 'item-table', bold: true },
                  { text: '2 620 446, 00 P', colSpan: 2, style: 'item-table', bold: true },
                ],
              ],
            },
            layout: 'lightHorizontalLines',
          },
          {
            text: 'Сумма прописью: два миллиона шестьсот двадцать тысяч четыреста сорок шесть рублей 00 копеек.',
            italics: true,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 15],
          },
          {
            text: [
              { text: '2.   ' },
              { text: 'Условия оплат' },
            ],
            style: 'item-heading',
          },
          {
            style: 'item-paragraph',
            columns: [
              '2.1.',
              {
                text: 'Cтоимость железнодорожного тарифв, а также иные расходы, связанные с доставкой «Товара» Покупателю включены в цену «Товара».',
                width: 'auto',
              },
            ],
          },
          {
            style: 'item-paragraph',
            columns: [
              '2.2.',
              {
                text: 'Lorem ipsum dolor amet mustache knausgaard +1, blue bottle waistcoat tbh semiotics artisan synth stumptown gastropub cornhole celiac swag. Brunch raclette vexillologist post-ironic glossier ennui XOXO mlkshk godard pour-over blog tumblr humblebrag. Blue bottle put a bird on it twee prism biodiesel brooklyn. Blue bottle ennui tbh succulents.',
                width: 'auto',
              },
            ],
          },
          {
            text: [
              { text: '3.   ' },
              { text: 'Реквизиты сторон' },
            ],
            style: 'item-heading',
          },
          {
            columns: [
              {
                type: 'none',
                ul: [
                  {
                    columns: [
                      {
                        text: 'Supplier:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Novaday Union Limeted',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Legal Address:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Unit 1010, 10/F Miramax Tower, 132 Nathan Road, Tsim Sha Tsul, Kowloon, Hong Hong',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Postcode:',
                        style: 'requisite-columns',
                      },
                      {
                        text: '_____',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Phone:',
                        style: 'requisite-columns',
                      },
                      {
                        text: '0086 186 20 00 0 00',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Supplier\'s Bank:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'HSBC',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Bank Address:',
                        style: 'requisite-columns',
                      },
                      {
                        text: '4/F HSBC, Tsim Sha Tsui Branch, 82-84 Nathan Road, Kowloon, Hong Hong',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                ],
              },
              {
                type: 'none',
                ul: [
                  {
                    columns: [
                      {
                        text: 'Client:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Horns & Hooves LLC, Newrussian office',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Legal Address:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Upperdock st. 41, office 15, Vladivostok, Russia',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Postcode:',
                        style: 'requisite-columns',
                      },
                      {
                        text: '690000',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Mailing Address:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Moscow city, Minskaya st. 1G, office 777',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Client\'s Bank:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Clients Bank LLC',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Bank Address:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'Moscow',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Грузополучатель:',
                        style: 'requisite-columns',
                      },
                      {
                        text: 'ООО «Пупа и Лупа»',
                        style: 'requisite-columns',
                      },
                    ],
                  },
                  {
                    columns: [
                      {
                        text: 'Адрес доставки:',
                        style: 'requisite-columns',
                        pageBreak: 'before',
                      },
                      {
                        text: '628380, Ханты-Мансийский Автономный округ - Югра, г. Пыть-Ях, Центральная промышленная зона',
                        style: 'requisite-columns',
                        pageBreak: 'before',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        styles: {
          'item-table-header': {
            fontSize: 9,
            alignment: 'center',
            margin: [0, 2],
          },
          'item-table': {
            fontSize: 10,
            alignment: 'right',
          },
          'item-heading': {
            bold: true,
            fontSize: 16,
            margin: [0, 20, 0, 10],
          },
          'item-paragraph': {
            columnGap: 10,
            margin: [0, 0, 0, 10],
          },
          'requisite-columns': {
            fontSize: 10,
            margin: [0, 2],
          },
        },
      }
      pdfMake.createPdf(dd).open()
    },
    async updateSpec (input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
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
      this.$apollo.queries.listOrgContracts.refetch()
    },
  },
}
</script>

<style lang="postcss">
.text-field_nd {
  min-width: unset!important;
}
.text-area_nd textarea {
  padding-top: 4px!important;
  padding-bottom: 4px!important;
}
.text-field_nd .text-field__slot,
.text-area_nd .text-area__slot {
  border: none!important;
  border-radius: 4px;
  background-color: #222222;
}
.select_nd .select__slot {
  background-color: #222222;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: transparent!important;
}
.text-field_nd.text-field--focused .text-field__slot,
.text-area_nd.text-area--focused .text-area__slot {
  background-color: #1e1e1e!important;
  box-shadow: 0 0 0 1px #5a8199;
}
.select_nd.select--active .select__slot {
  background-color: #1e1e1e!important;
  border-color: #5a8199!important;
  border-bottom-left-radius: 0!important;
  border-bottom-right-radius: 0!important;
}
.select_nd .v-menu__content {
  border: 1px solid #5a8199;
}
.select_nd .select-picker {
  padding-top: 0!important;
  padding-bottom: 0!important;
}
.select_nd .select-picker__item {
  background-color: #1e1e1e!important;
  height: 32px;
}
.select_nd .select-picker__item:not(.select-picker__item--disabled):hover {
  background-color: #353535!important;
}
.text-field_nd input,
.text-area_nd textarea,
.select_nd input {
  color: #5a8199!important;
}
.text-field_nd input:focus,
.text-area_nd textarea:focus,
.select_nd input:focus {
  color: #ffffff!important;
}

.text-field_nd input:disabled,
.text-area_nd textarea:disabled,
.select_nd input:disabled,
.text-field_nd input:disabled::placeholder,
.text-area_nd textarea:disabled::placeholder,
.select_nd input:disabled::placeholder {
  color: #2f2f2f!important;
}

</style>

<style lang="postcss" scoped>
.spec-summary {
  padding: 50px 0 50px;
}

.spec-summary__wrapper {
  @apply flex justify-between;
}

.spec-summary__info {
  max-width: 320px;
}

.spec-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.spec-summary__cost__card {
  padding: 18px 14px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 16px;
}
@screen sm {
  .spec-summary__cost__card {
    font-size: 18px;
    padding: 40px 60px;
  }
}

.spec-summary__actions {
  width: 100%;
  padding-top: 16px;
  padding-bottom: 20px;
}
.spec-summary__actions > button {
  display: flex;
}
.spec-summary__actions > button:not(:last-child) {
  margin-bottom: 25px;
}

@screen lg {
  .spec-summary__actions {
    width: 180px;
  }
  .spec-summary__cost {
    @apply mx-4;
  }
  .spec-summary__info {
    width: 320px;
  }
}
.spec-summary__container {
  width: 210px;
  @apply relative;
}
.spec-summary__container__label {
  @apply absolute inset-0 w-full h-full font-bold text-2xl text-white;
  @apply flex items-center justify-center;
}
/* TODO image import on component */
.spec-summary__container__image {
  @apply absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat;
}
.spec-summary__container__image--full {
  background-image: url("/img/container-full.png");
}
.spec-summary__container__image--full-sm {
  background-image: url("/img/container-full-40.png");
}
.spec-summary__container__image--shipped {
  background-image: url("/img/container-shipped.png");
}

.spec-summary__info ul.leaders span:first-child,
.spec-summary__info ul.leaders span + span {
  @apply bg-chaos-black;
}
@screen md {
  .spec-summary__info ul.leaders span:first-child,
  .spec-summary__info ul.leaders span + span {
    background: #1e1e1e;
  }
}
.spec-summary__cost ul.leaders span:first-child,
.spec-summary__cost ul.leaders span + span {
  background-color: #272727;
}

.spec-summary .leaders {
  line-height: 1.625rem;
  padding: 0;
  overflow-x: hidden;
  list-style: none}
.spec-summary .leaders li:after {
  float: left;
  width: 0;
  white-space: nowrap;
  content:
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "}
.spec-summary .leaders span:first-child {
  padding-right: 0.33em;}
.spec-summary .leaders span + span {
  float: right;
  padding-left: 0.33em;
  position: relative;
  z-index: 1
}
.spec-summary .leaders__num {
  @apply text-white font-bold
}
</style>
