<template>
  <div class="content">
    <Header :paper-org-name="spec.orgName" :org="orgId" />
    <div class="container mb-12">
      <div class="pt-8 pb-16">
        <div
          class="flex flex-col sm:flex-row items-center justify-between pb-6"
        >
          <!-- TODO: change tag to h1, need refactor base h1 style -->
          <div class="font-semibold leading-6 pr-2.5 py-2">
            <h2 class="text-2xl inline-block align-middle mr-2.5">
              <span>{{ $t('paper.shippingTitle') }}</span
              >&nbsp; <span>{{ spec.specNo }}</span
              >&nbsp; <span>{{ $t('preposition.from') }}</span
              >&nbsp;
              <span>{{ $d($parseDate(spec.createdAt), 'short') }}</span>
            </h2>
            <div
              v-if="spec.shipped"
              class="
                inline-block
                text-xs
                align-middle
                mr-2.5
                px-2.5
                bg-cold-blue-400
                text-white
                rounded-50
              "
            >
              {{ $t('paper.shipped') }}
            </div>
          </div>
          <div class="ml-auto flex">
            <div class="pr-2">
              <button
                disabled
                class="
                  w-full
                  inline-block
                  rounded-md
                  border border-transparent
                  pointer-events-none
                "
              >
                <div
                  class="
                    h-10
                    w-10
                    flex
                    items-center
                    justify-center
                    text-light-gray-400
                  "
                >
                  <Icon>
                    {{ icons.ziUserPlus }}
                  </Icon>
                </div>
              </button>
            </div>
            <div class="pr-2">
              <button
                :disabled="printLoading"
                :class="{ 'hover:border-blue-500': !printLoading }"
                class="
                  relative
                  w-full
                  inline-block
                  bg-light-gray-100
                  rounded-md
                  border border-transparent
                  select-none
                  focus:outline-none
                  focus:border-blue-500
                  transition-colors
                  duration-100
                  ease-out
                "
                @click="printPdf"
              >
                <div
                  v-if="printLoading"
                  class="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    text-blue-500
                  "
                >
                  <Progress indeterminate size="20" width="2" />
                </div>
                <div
                  :class="[
                    'h-10 w-10 flex items-center justify-center',
                    { 'opacity-0': printLoading },
                  ]"
                >
                  <Icon class="text-blue-500">
                    {{ icons.ziPrint }}
                  </Icon>
                </div>
              </button>
            </div>
            <div class="pr-2">
              <button
                :disabled="downloadLoading"
                :class="{ 'hover:border-blue-500': !downloadLoading }"
                class="
                  relative
                  w-full
                  inline-block
                  bg-light-gray-100
                  rounded-md
                  border border-transparent
                  select-none
                  focus:outline-none
                  focus:border-blue-500
                  transition-colors
                  duration-100
                  ease-out
                "
                @click="downloadPdf"
              >
                <div
                  v-if="downloadLoading"
                  class="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    text-blue-500
                  "
                >
                  <Progress indeterminate size="20" width="2" />
                </div>
                <div
                  :class="[
                    'h-10 w-10 flex items-center justify-center',
                    { 'opacity-0': downloadLoading },
                  ]"
                >
                  <i class="text-blue-500 text-2xl">
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.1665 3.29161C3.1665 1.82275 4.37687 0.618042 5.84452 0.618042H12.95C13.1533 0.618042 13.3405 0.707819 13.473 0.847343L17.9666 5.56129C18.0758 5.68341 18.1665 5.85823 18.1665 6.05898V16.7281C18.1665 18.1971 16.9561 19.4018 15.4885 19.4018H5.84452C4.37686 19.4018 3.1665 18.1971 3.1665 16.7281V3.29161ZM5.84452 2.06718C5.17403 2.06718 4.61564 2.62666 4.61564 3.29161V16.7281C4.61564 17.3966 5.17741 17.9527 5.84452 17.9527H15.4885C16.1595 17.9527 16.7174 17.3971 16.7174 16.7281V6.7748H14.4458C13.2204 6.7748 12.2297 5.79025 12.2297 4.56315V2.06718H5.84452ZM13.1097 2.06718L16.7174 5.89486H14.4458C13.7095 5.89486 13.1097 5.30264 13.1097 4.56315V2.06718ZM9.94184 6.49025C9.94184 6.09093 10.2673 5.76568 10.6664 5.76568C11.0655 5.76568 11.391 6.09093 11.391 6.49025V10.572L12.7145 9.15242C12.9823 8.86313 13.4449 8.83872 13.7384 9.11593C14.0266 9.38382 14.0505 9.84554 13.7733 10.1388L13.7722 10.1399L11.194 12.9073C11.0603 13.048 10.8728 13.1367 10.6664 13.1367C10.46 13.1367 10.2727 13.048 10.139 12.9075L10.1368 12.9052L7.56515 10.14L7.56399 10.1388C7.28478 9.8436 7.31324 9.38731 7.59738 9.11732C7.89252 8.83686 8.34971 8.86501 8.62008 9.14954L8.62218 9.15175L9.94184 10.5707V6.49025ZM6.32103 14.7308C6.32103 14.3315 6.64653 14.0062 7.0456 14.0062H14.2874C14.6891 14.0062 15.0164 14.3296 15.0164 14.7308C15.0164 15.1299 14.691 15.4554 14.2919 15.4554H7.0456C6.64648 15.4554 6.32103 15.1299 6.32103 14.7308Z"
                        fill="currentColor"
                      />
                    </svg>
                  </i>
                </div>
              </button>
            </div>
            <div class="pr-2">
              <Comments
                :items="spec.comments"
                :spec-id="specId"
                :placement="$breakpoint.lgAndUp ? 'left-start' : 'right-start'"
                is-paper
              >
                <template v-slot:activator>
                  <button
                    class="
                      w-full
                      inline-block
                      bg-light-gray-100
                      rounded-md
                      border border-transparent
                      select-none
                      focus:outline-none
                      focus:border-blue-500
                      hover:border-blue-500
                      transition-colors
                      duration-100
                      ease-out
                    "
                  >
                    <div
                      class="
                        h-10
                        w-10
                        flex
                        items-center
                        justify-center
                        relative
                      "
                    >
                      <div
                        v-if="hasNewComments"
                        :class="[
                          'absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 bg-light-gray-100 border-light-gray-100 transition-colors duration-100 ease-out -mt-0.5 -mr-1',
                        ]"
                      >
                        <div class="w-full h-full bg-purple-500 rounded-full" />
                      </div>
                      <Icon class="text-blue-500">
                        {{ icons.ziChat }}
                      </Icon>
                    </div>
                  </button>
                </template>
              </Comments>
            </div>
            <div class="pr-2">
              <button
                class="
                  w-full
                  inline-block
                  bg-light-gray-100
                  rounded-md
                  border border-transparent
                  select-none
                  focus:outline-none
                  focus:border-blue-500
                  hover:border-blue-500
                  transition-colors
                  duration-100
                  ease-out
                "
                @click="toggleExpandAll"
              >
                <div class="h-10 w-10 flex items-center justify-center">
                  <Icon class="text-blue-500">
                    {{
                      expanded.length === 0 ? icons.ziExpand : icons.ziCollapse
                    }}
                  </Icon>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="pb-12 mb-1">
          <div v-for="item in items" :key="item.id" class="pb-1">
            <div
              :class="{ 'rounded-b-md': !expanded.includes(item.id) }"
              class="
                h-12
                flex
                items-center
                px-3
                sm:px-5
                rounded-t-md
                select-none
                cursor-pointer
                bg-light-gray-300
              "
              @click="expand(item.id)"
            >
              <div
                class="flex-shrink-0 w-3 h-3 mr-3 sm:mr-5 rounded-full"
                :class="[
                  item.invoiceStatus === InvoiceStatus.IN_STOCK
                    ? 'bg-green-500'
                    : item.invoiceStatus === InvoiceStatus.IN_PRODUCTION
                    ? 'bg-yellow-500'
                    : item.invoiceStatus === InvoiceStatus.IN_PROCESSING
                    ? 'bg-pink-500'
                    : 'bg-gray-100',
                ]"
              />
              <div class="select-text">
                <div class="text-gray-400 font-semibold leading-tight">
                  <span>{{ item.invoiceNo || '-' }}</span
                  >&nbsp;
                  <span class="text-sm">{{ $t('preposition.from') }}</span
                  >&nbsp;
                  <span>{{
                    item.createdAt
                      ? $d($parseDate(item.createdAt), 'short')
                      : '-'
                  }}</span
                  >&nbsp; <span>/</span>&nbsp;
                  <span class="text-sm">{{
                    $t('paper.expectedShipment').toLowerCase()
                  }}</span
                  >&nbsp;
                  <span>{{
                    item.shippingDate
                      ? $d($parseDate(item.shippingDate), 'short')
                      : '-'
                  }}</span>
                </div>
              </div>
              <div class="ml-auto">
                <button
                  class="
                    select-none
                    focus:outline-none
                    text-blue-500
                    focus:text-blue-400
                    hover:text-blue-400
                    transition-colors
                    duration-100
                    ease-out
                  "
                >
                  <Icon
                    class="transition-transform"
                    :class="{
                      'transform rotate-90': expanded.includes(item.id),
                    }"
                  >
                    {{ icons.ziChevronRight }}
                  </Icon>
                </button>
              </div>
            </div>

            <PaperInvoice
              v-if="expanded.includes(item.id)"
              :spec-id="specId"
              :invoice="item"
              :currency="currency"
              :scroll-left="invoiceScrollLeft"
              :scroll-invoice-id="invoiceScrollId"
              @change:scrollLeft="setScrollLeft"
            />
          </div>
        </div>

        <!-- Info -->
        <div>
          <div class="flex flex-wrap lg:flex-nowrap pb-10">
            <!-- Cargo Info -->
            <div class="w-full flex-grow lg:w-auto pb-10 lg:pb-0 lg:pr-3">
              <h4 class="text-xl font-semibold leading-6 mb-4">
                {{ $t('paper.cargoInfo') }}
              </h4>

              <!-- Summary -->
              <div class="flex flex-wrap sm:flex-nowrap -mx-2 pb-4">
                <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
                  <div
                    class="
                      flex flex-col
                      justify-between
                      bg-light-gray-100
                      rounded-md
                      py-4
                      px-5
                      leading-6
                      h-full
                    "
                  >
                    <div class="flex text-gray-100 pb-2">
                      <Icon class="mr-2">
                        {{ icons.ziCalendar }}
                      </Icon>
                      <span>
                        {{ $t('paper.estimateDate') }}
                      </span>
                    </div>
                    <div class="text-lg text-center font-semibold">
                      {{
                        spec.estimateShippingDate
                          ? $d($parseDate(spec.estimateShippingDate), 'short')
                          : this.$t('placeholder.emptyDate')
                      }}
                    </div>
                  </div>
                </div>
                <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
                  <div
                    class="
                      flex flex-col
                      justify-between
                      bg-light-gray-100
                      rounded-md
                      py-4
                      px-5
                      leading-6
                      h-full
                    "
                  >
                    <div class="flex text-gray-100 pb-2">
                      <Icon class="mr-2">
                        {{ icons.ziVolume }}
                      </Icon>
                      <span>
                        {{ $t('paper.totalVolume') }}
                      </span>
                    </div>
                    <div class="text-lg text-center font-semibold">
                      {{ $n(spec.totalVolume || 0) }} {{ $t('measure.m3') }}
                    </div>
                  </div>
                </div>
                <div class="w-1/2 sm:w-1/4 px-2">
                  <div
                    class="
                      flex flex-col
                      justify-between
                      bg-light-gray-100
                      rounded-md
                      py-4
                      px-5
                      leading-6
                      h-full
                    "
                  >
                    <div class="flex text-gray-100 pb-2">
                      <Icon class="mr-2">
                        {{ icons.ziBoxes }}
                      </Icon>
                      <span>
                        {{ $t('paper.totalPackages') }}
                      </span>
                    </div>
                    <div class="text-lg text-center font-semibold">
                      {{ $n(spec.qtyOfPackages || 0) }}
                    </div>
                  </div>
                </div>
                <div class="w-1/2 sm:w-1/4 px-2">
                  <div
                    class="
                      flex flex-col
                      justify-between
                      bg-light-gray-100
                      rounded-md
                      py-4
                      px-5
                      leading-6
                      h-full
                    "
                  >
                    <div class="flex text-gray-100 pb-2">
                      <Icon class="mr-2">
                        {{ icons.ziVolume }}
                      </Icon>
                      <span>
                        {{ $t('paper.totalWeight') }}
                      </span>
                    </div>
                    <div class="text-lg text-center font-semibold">
                      {{ $n(spec.totalWeight || 0) }} {{ $t('measure.kg') }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Containers -->
              <div
                class="
                  relative
                  sm:flex
                  bg-light-gray-100
                  rounded-md
                  overflow-hidden
                "
              >
                <div class="flex-grow py-7.5 leading-4">
                  <div
                    v-for="(container, i) of containers"
                    :key="i"
                    class="
                      flex flex-col
                      xl:flex-row
                      items-center
                      justify-center
                    "
                  >
                    <div v-if="container.full" class="text-sm text-gray-200">
                      <div>
                        {{
                          `${$tc('paper.container', container.full, {
                            n: container.full,
                          })} ${container.size.replace(
                            '_',
                            ''
                          )}'${container.mode.replace('_', '')}`
                        }}
                      </div>
                      <div
                        :class="[
                          'spec-container relative my-2',
                          {
                            'spec-container--lg':
                              container.size === '_40' ||
                              container.size === '_45',
                          },
                        ]"
                      >
                        <div class="spec-container__progress w-full h-full">
                          <div style="width: 100%" class="relative w-0 h-full">
                            <div
                              class="
                                absolute
                                top-0
                                left-0
                                bg-blue-500
                                w-full
                                h-full
                              "
                            />
                          </div>
                        </div>
                        <div class="absolute inset-0">
                          <img
                            v-if="container.size === '_20'"
                            src="../assets/icons/c20_2x.png"
                            alt="40'"
                          />
                          <img
                            v-else
                            src="../assets/icons/c40_2x.png"
                            alt="20'"
                          />
                        </div>
                      </div>
                      <div>
                        <span>{{ $t('paper.containerLoaded') }}</span
                        >&nbsp;
                        <span class="inline-block w-10 font-bold"> 100% </span>
                      </div>
                    </div>
                    <div
                      v-if="container.full"
                      class="flex items-center px-5 py-3"
                    >
                      <Icon class="text-gray-100">
                        {{ icons.ziPlus }}
                      </Icon>
                    </div>
                    <div class="text-sm text-gray-200">
                      <div>
                        {{
                          `${container.size.replace(
                            '_',
                            ''
                          )}'${container.mode.replace('_', '')}`
                        }}
                      </div>
                      <div
                        :class="[
                          'spec-container relative my-2',
                          {
                            'spec-container--lg':
                              container.size === '_40' ||
                              container.size === '_45',
                          },
                        ]"
                      >
                        <div class="spec-container__progress h-full">
                          <div
                            :style="{ width: (container.loaded || 0) + '%' }"
                            class="relative w-0 h-full"
                          >
                            <div
                              class="
                                absolute
                                top-0
                                left-0
                                bg-blue-500
                                w-full
                                h-full
                              "
                            />
                          </div>
                        </div>
                        <div class="absolute inset-0">
                          <img
                            v-if="container.size === '_20'"
                            src="../assets/icons/c20_2x.png"
                            alt="40'"
                          />
                          <img
                            v-else
                            src="../assets/icons/c40_2x.png"
                            alt="20'"
                          />
                        </div>
                      </div>
                      <div>
                        <span>{{ $t('paper.containerLoaded') }}</span
                        >&nbsp;
                        <span class="inline-block w-10 font-bold">
                          {{ container.loaded || 0 }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="spec.shipped"
                  class="spec-shipped flex-shrink-0 relative bg-light-gray-400"
                >
                  <div
                    class="
                      absolute
                      inset-0
                      flex
                      h-full
                      items-center
                      border-light-gray-100
                      pointer-events-none
                    "
                  >
                    <div class="spec-shipped__arrow"></div>
                  </div>
                  <div class="h-full flex items-center justify-center">
                    <div class="text-center py-2 sm:px-0">
                      <svg
                        class="mx-auto mt-5 mb-4 text-cold-blue-400"
                        width="57"
                        height="57"
                        viewBox="0 0 57 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.5 28.397C0.5 12.9331 13.036 0.397034 28.5 0.397034C43.964 0.397034 56.5 12.9331 56.5 28.397C56.5 43.861 43.964 56.397 28.5 56.397C13.036 56.397 0.5 43.861 0.5 28.397ZM28.5 4.54518C15.327 4.54518 4.64815 15.224 4.64815 28.397C4.64815 41.57 15.327 52.2489 28.5 52.2489C41.673 52.2489 52.3518 41.57 52.3518 28.397C52.3518 15.224 41.673 4.54518 28.5 4.54518Z"
                          fill="#2F80ED"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M44.2118 19.9962L26.0712 37.6498L15.8184 27.5301L19.5063 23.7936L26.0972 30.2989L40.5504 16.2338L44.2118 19.9962Z"
                          fill="#2F80ED"
                        />
                      </svg>
                      <div class="text-sm">
                        {{ $t('paper.shipped') }}
                      </div>
                      <div class="text-sm text-gray-100">
                        <!-- TODO: add shippingDate -->
                        {{
                          spec.shippingDate
                            ? $d($parseDate(spec.shippingDate), 'short')
                            : ''
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Info -->
            <div class="w-full flex-shrink-0 text-base lg:max-w-sm lg:pl-3">
              <h4 class="text-xl font-semibold leading-6 mb-4">
                {{ $t('paper.financialInfo') }}
              </h4>
              <div class="bg-light-gray-100 rounded-md leading-5 p-5">
                <div class="flex rounded-md bg-white pl-4 pr-3 py-3 mb-1">
                  <div class="flex-grow text-gray-100">
                    {{ $t('paper.costOfGood') }}
                  </div>
                  <div class="text-right">
                    {{ $n(spec.finalCost || 0, 'fixed') }}
                    {{ $t(`currency.${currency}.symbol`) }}
                  </div>
                </div>
                <div class="flex rounded-md bg-white pl-4 pr-3 py-3 mb-1">
                  <div class="flex-grow text-gray-100">
                    {{ $t('paper.totalPrepay') }}
                  </div>
                  <div class="text-right">
                    {{ $n(spec.totalPrepay || 0, 'fixed') }}
                    {{ $t(`currency.${currency}.symbol`) }}
                  </div>
                </div>
                <div class="rounded-md bg-white pl-4 pr-3 py-3 mb-1">
                  <div class="flex pb-2">
                    <div class="flex-grow text-gray-100">
                      {{ $t('paper.finalToPay') }}
                    </div>
                    <div
                      :class="[
                        'text-right',
                        { 'text-red-500': spec.totalClientDebt > 0 },
                      ]"
                    >
                      {{ $n(spec.totalClientDebt || 0, 'fixed') }}
                      {{ $t(`currency.${currency}.symbol`) }}
                    </div>
                  </div>
                  <div class="flex">
                    <div class="flex-grow text-gray-100">
                      {{
                        $t('paper.exchangeRate', {
                          currency: $t(`currency.${currency}.iso-4217`),
                          exchange: $t(`currency.USD.iso-4217`),
                        })
                      }}
                    </div>
                    <div class="text-right">
                      {{ $n(spec.currencyRate || 0) }}
                      {{ $t(`currency.USD.symbol`) }}
                    </div>
                  </div>
                </div>
                <div class="flex rounded-md bg-white pl-4 pr-3 py-3">
                  <div class="flex-grow text-gray-100">
                    {{
                      $t('paper.totalToPay', {
                        currency: $t('currency.USD.iso-4217'),
                      })
                    }}
                  </div>
                  <div class="text-right">
                    {{ $n(spec.total || 0, 'fixed') }}
                    {{ $t(`currency.USD.symbol`) }}
                  </div>
                </div>
              </div>
              <div
                v-if="spec.terms || spec.sentFrom"
                class="bg-light-gray-100 rounded-md text-center px-5 mt-4 py-6"
              >
                <span v-if="spec.terms"> {{ spec.terms }}&nbsp; </span>
                <span>
                  {{ spec.sentFrom || '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="bg-light-gray-100 rounded-md p-3 select-none">
            <div class="flex flex-wrap md:flex-nowrap">
              <div class="w-full md:w-auto p-2">
                <button
                  style="min-width: 85px"
                  disabled
                  class="
                    w-full
                    inline-block
                    rounded-md
                    border border-light-gray-400
                    pointer-events-none
                  "
                >
                  <div class="h-12 flex items-center px-3 text-light-gray-400">
                    <Icon class="mr-2">
                      {{ icons.ziUserPlus }}
                    </Icon>
                    <span class="whitespace-nowrap leading-tight">
                      {{ $t('paper.share') }}
                    </span>
                  </div>
                </button>
              </div>
              <div class="w-full md:w-auto p-2">
                <button
                  :disabled="printLoading"
                  :class="{ 'hover:border-blue-500': !printLoading }"
                  style="min-width: 85px"
                  class="
                    relative
                    w-full
                    inline-block
                    rounded-md
                    border border-light-gray-400
                    select-none
                    focus:outline-none
                    focus:border-blue-500
                    transition-colors
                    duration-100
                    ease-out
                  "
                  @click="printPdf"
                >
                  <div
                    v-if="printLoading"
                    class="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      text-blue-500
                    "
                  >
                    <Progress indeterminate size="24" width="2" />
                  </div>
                  <div
                    :class="[
                      'h-12 flex items-center px-3',
                      { 'opacity-0': printLoading },
                    ]"
                  >
                    <Icon class="text-gray-100 mr-2">
                      {{ icons.ziPrint }}
                    </Icon>
                    <span class="text-blue-500 whitespace-nowrap leading-tight">
                      {{ $t('paper.print') }}
                    </span>
                  </div>
                </button>
              </div>
              <div class="w-full md:w-auto p-2">
                <button
                  :disabled="downloadLoading"
                  :class="{ 'hover:border-blue-500': !downloadLoading }"
                  style="min-width: 85px"
                  class="
                    relative
                    w-full
                    inline-block
                    rounded-md
                    border border-light-gray-400
                    select-none
                    focus:outline-none
                    focus:border-blue-500
                    transition-colors
                    duration-100
                    ease-out
                  "
                  @click="downloadPdf"
                >
                  <div
                    v-if="downloadLoading"
                    class="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      text-blue-500
                    "
                  >
                    <Progress indeterminate size="24" width="2" />
                  </div>
                  <div
                    :class="[
                      'h-12 flex items-center px-3',
                      { 'opacity-0': downloadLoading },
                    ]"
                  >
                    <i class="text-gray-100 text-xl mr-2">
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.1665 3.29161C3.1665 1.82275 4.37687 0.618042 5.84452 0.618042H12.95C13.1533 0.618042 13.3405 0.707819 13.473 0.847343L17.9666 5.56129C18.0758 5.68341 18.1665 5.85823 18.1665 6.05898V16.7281C18.1665 18.1971 16.9561 19.4018 15.4885 19.4018H5.84452C4.37686 19.4018 3.1665 18.1971 3.1665 16.7281V3.29161ZM5.84452 2.06718C5.17403 2.06718 4.61564 2.62666 4.61564 3.29161V16.7281C4.61564 17.3966 5.17741 17.9527 5.84452 17.9527H15.4885C16.1595 17.9527 16.7174 17.3971 16.7174 16.7281V6.7748H14.4458C13.2204 6.7748 12.2297 5.79025 12.2297 4.56315V2.06718H5.84452ZM13.1097 2.06718L16.7174 5.89486H14.4458C13.7095 5.89486 13.1097 5.30264 13.1097 4.56315V2.06718ZM9.94184 6.49025C9.94184 6.09093 10.2673 5.76568 10.6664 5.76568C11.0655 5.76568 11.391 6.09093 11.391 6.49025V10.572L12.7145 9.15242C12.9823 8.86313 13.4449 8.83872 13.7384 9.11593C14.0266 9.38382 14.0505 9.84554 13.7733 10.1388L13.7722 10.1399L11.194 12.9073C11.0603 13.048 10.8728 13.1367 10.6664 13.1367C10.46 13.1367 10.2727 13.048 10.139 12.9075L10.1368 12.9052L7.56515 10.14L7.56399 10.1388C7.28478 9.8436 7.31324 9.38731 7.59738 9.11732C7.89252 8.83686 8.34971 8.86501 8.62008 9.14954L8.62218 9.15175L9.94184 10.5707V6.49025ZM6.32103 14.7308C6.32103 14.3315 6.64653 14.0062 7.0456 14.0062H14.2874C14.6891 14.0062 15.0164 14.3296 15.0164 14.7308C15.0164 15.1299 14.691 15.4554 14.2919 15.4554H7.0456C6.64648 15.4554 6.32103 15.1299 6.32103 14.7308Z"
                          fill="currentColor"
                        />
                      </svg>
                    </i>

                    <span class="text-blue-500 whitespace-nowrap leading-tight">
                      {{ $t('paper.download') }}
                    </span>
                  </div>
                </button>
              </div>
              <div class="w-full md:w-auto p-2 md:ml-auto">
                <Comments
                  :activator="$refs.bottomSpecCommentsActivator"
                  :items="spec.comments"
                  :spec-id="specId"
                  :placement="
                    $breakpoint.lgAndUp ? 'left-start' : 'right-start'
                  "
                  is-paper
                >
                  <template v-slot:activator>
                    <button
                      min-width="85"
                      class="
                        w-full
                        inline-block
                        rounded-md
                        border border-light-gray-400
                        select-none
                        focus:outline-none
                        focus:border-blue-500
                        hover:border-blue-500
                        transition-colors
                        duration-100
                        ease-out
                      "
                    >
                      <div class="h-12 flex items-center px-3">
                        <span
                          class="text-blue-500 whitespace-nowrap leading-tight"
                        >
                          {{ $t('paper.comment') }}
                        </span>
                      </div>
                    </button>
                  </template>
                </Comments>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-12 absolute bottom-0 w-full text-center">
      <Copyright />
    </div>
  </div>
</template>

<script>
import deepmerge from 'deepmerge'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  useApolloClient,
  useMutation,
  useQuery,
  useResult,
} from '@vue/apollo-composable'

import {
  ziUserPlus,
  ziPrint,
  ziChat,
  ziExpand,
  ziCollapse,
  ziChevronRight,
  ziCalendar,
  ziVolume,
  ziBoxes,
  ziWeight,
  ziPlus,
} from '@zennnn/icons'
import { Icon, Progress } from '@zennnn/core'

import {
  PAPER_STORE_KEY_PREFIX,
  DEFAULT_CURRENCY,
  PAPER_ORG_ID_STORE_KEY,
} from '../config'

import { Typename, Operation, InvoiceStatus } from '../graphql/enums'
import { GET_PAPER_SPEC, GET_PROFILE } from '../graphql/queries'
import {
  SET_SPEC_EXPANDED_INVOICES,
  ADD_SPEC_EXPANDED_INVOICES,
  // REMOVE_SPEC_EXPANDED_INVOICES,
} from '../graphql/mutations'
import { PAPER_SPEC_DELTA } from '../graphql/subscriptions'
import {
  PAPER_SPEC_FRAGMENT,
  PAPER_INVOICE_FRAGMENT,
  PAPER_PRODUCT_FRAGMENT,
  PAPER_SPEC_INVOICES_FRAGMENT,
  PAPER_INVOICE_PRODUCTS_FRAGMENT,
} from '../graphql/fragments'
import { getSpecExpandedInvoices } from '../graphql/resolvers'

import printInvoice from '../components/printInvoice'

import Header from '../components/Header'
import Copyright from '../components/Copyright'
import Comments from '../components/Comments'
import PaperInvoice from '../components/PaperInvoice'

export default {
  name: 'Paper',
  components: {
    Icon,
    Progress,
    Header,
    Copyright,
    Comments,
    PaperInvoice,
  },
  setup() {
    const route = useRoute()
    const specId = route.params.specId
    const isBooted = ref(false)
    const expanded = ref([])

    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const { result: result1 } = useQuery(GET_PROFILE, null, {
      fetchPolicy: 'network-only',
    })
    const getProfile = useResult(result1)

    const { result: result2, onResult } = useQuery(GET_PAPER_SPEC, () => ({
      id: specId,
    }))
    const getPaperSpec = useResult(result2)
    onResult(({ data, loading }) => {
      if (!loading && !isBooted.value) {
        const spec = (data && data.getPaperSpec) || {}
        updateExpanded(spec)
      }
    })

    // Methods
    const updateExpanded = async (spec) => {
      const specId = spec && spec.id
      if (!specId || isBooted.value) return
      isBooted.value = true
      const _expanded = await getSpecExpandedInvoices(
        specId,
        PAPER_STORE_KEY_PREFIX
      )
      if (!_expanded) {
        const invoices = spec.invoices || []
        const ids = invoices.map((el) => el.id)
        if (ids.length > 0) {
          expanded.value = ids
          await setExpandedInvoices({
            specId: specId,
            ids: expanded.value,
            prefix: PAPER_STORE_KEY_PREFIX,
          })
        }
      } else {
        expanded.value = _expanded || []
      }
    }

    const { mutate: setExpandedInvoices } = useMutation(
      SET_SPEC_EXPANDED_INVOICES
    )

    const { mutate: addExpandedInvoices } = useMutation(
      ADD_SPEC_EXPANDED_INVOICES
    )

    const { mutate: removeExpandedInvoices } = useMutation(
      ADD_SPEC_EXPANDED_INVOICES
    )

    return {
      icons: {
        ziUserPlus,
        ziPrint,
        ziChat,
        ziExpand,
        ziCollapse,
        ziChevronRight,
        ziCalendar,
        ziVolume,
        ziBoxes,
        ziWeight,
        ziPlus,
      },
      apolloClient,
      specId,
      isBooted,
      expanded,
      getProfile,
      getPaperSpec,
      updateExpanded,
      setExpandedInvoices,
      addExpandedInvoices,
      removeExpandedInvoices,
    }
  },
  data() {
    return {
      printLoading: false,
      downloadLoading: false,
      InvoiceStatus,
      invoiceScrollId: '',
      invoiceScrollLeft: 0,
      menuCurrency: false,
      sessionOrgId: '',
    }
  },
  computed: {
    profile() {
      return this.getProfile || {}
    },
    orgId() {
      return (
        this.sessionOrgId || (this.profile.account && this.profile.account.org)
      )
    },
    hasNewComments() {
      const comments = this.spec.comments || []
      return comments.some((item) => !item.clientViewed)
    },
    spec() {
      return this.getPaperSpec || {}
    },
    currency() {
      return this.spec.currency || DEFAULT_CURRENCY
    },
    client() {
      const firstName = (this.spec.client && this.spec.client.firstName) || {}
      const lastName = (this.spec.client && this.spec.client.lastName) || {}
      return firstName + ' ' + lastName || {}
    },
    items() {
      return this.spec.invoices || []
    },
    containers() {
      return this.spec.containers || []
    },
  },
  watch: {
    items(val, oldVal) {
      const value = val || []
      const oldValue = oldVal || []
      // on invoice removed clear from expanded
      if (oldValue.length > value.length) {
        const removedIds = []
        oldValue.forEach((v) => {
          if (!value.some((el) => el.id === v.id)) {
            removedIds.push(v.id)
          }
        })
        this.removeExpandedInvoices({
          specId: this.specId,
          ids: removedIds,
          prefix: PAPER_STORE_KEY_PREFIX,
        })
      }
    },
  },
  created() {
    const overviewOrgId = sessionStorage.getItem(PAPER_ORG_ID_STORE_KEY)
    this.sessionOrgId = overviewOrgId || ''
    sessionStorage.removeItem(PAPER_ORG_ID_STORE_KEY)
  },
  mounted() {
    const commentsMerge = (target, source) => {
      const destination = target.slice()
      source.forEach((s) => {
        const index = target.findIndex((el) => el.id === s.id)
        if (index === -1) {
          destination.push(s)
        } else {
          destination.splice(index, 1, Object.assign(target[index], s))
        }
      })
      return destination
    }

    const apolloClient = this.apolloClient

    const observer = apolloClient.subscribe({
      query: PAPER_SPEC_DELTA,
      variables: {
        specId: this.specId,
      },
      fetchPolicy: 'no-cache',
    })

    observer.subscribe({
      next: ({ data }) => {
        const delta = data.paperSpecDelta
        const operation = delta.operation
        const typename = delta.payload.__typename

        this.$logger.info(`[${typename}]: ${JSON.stringify(data)}`)

        // PRODUCT

        if (operation === Operation.INSERT_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
            fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
            fragmentName: 'PaperInvoiceProductsFragment',
          })

          if (
            !parentInvoice.products.some((el) => el.id === delta.payload.id)
          ) {
            parentInvoice.products.push(delta.payload)

            setTimeout(() => {
              apolloClient.writeFragment({
                id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
                fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
                fragmentName: 'PaperInvoiceProductsFragment',
                data: parentInvoice,
              })
            }, 0)
          }
        }

        if (operation === Operation.UPDATE_PRODUCT) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'images') {
                const merge = (_, source) => {
                  return source || []
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
            fragment: PAPER_PRODUCT_FRAGMENT,
            fragmentName: 'PaperProductFragment',
          })
          const data =
            delta.payload.__typename === Typename.PAPER_PRODUCT
              ? deepmerge(cacheData, delta.payload, mergeOptions)
              : deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_PRODUCT}:${delta.payload.id}`,
            fragment: PAPER_PRODUCT_FRAGMENT,
            fragmentName: 'PaperProductFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_PRODUCT) {
          const parentInvoice = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
            fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
            fragmentName: 'PaperInvoiceProductsFragment',
          })

          const index = parentInvoice.products.findIndex(
            (p) => p.id === delta.payload.id
          )

          if (index !== -1) {
            parentInvoice.products.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_INVOICE}:${delta.parentId}`,
              fragment: PAPER_INVOICE_PRODUCTS_FRAGMENT,
              fragmentName: 'PaperInvoiceProductsFragment',
              data: parentInvoice,
            })
          }
        }

        // INVOICE

        if (operation === Operation.INSERT_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
            fragment: PAPER_SPEC_INVOICES_FRAGMENT,
            fragmentName: 'PaperSpecInvoicesFragment',
          })

          if (!parentSpec.invoices.some((el) => el.id === delta.payload.id)) {
            parentSpec.invoices.push(delta.payload)

            apolloClient.writeFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        if (operation === Operation.UPDATE_INVOICE) {
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
            fragment: PAPER_INVOICE_FRAGMENT,
            fragmentName: 'PaperInvoiceFragment',
          })
          const data =
            delta.payload.__typename === Typename.PAPER_INVOICE
              ? Object.assign({}, cacheData, delta.payload)
              : Object.assign({}, cacheData, delta.payload.fields)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_INVOICE}:${delta.payload.id}`,
            fragment: PAPER_INVOICE_FRAGMENT,
            fragmentName: 'PaperInvoiceFragment',
            data,
          })
        }

        if (operation === Operation.DELETE_INVOICE) {
          const parentSpec = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
            fragment: PAPER_SPEC_INVOICES_FRAGMENT,
            fragmentName: 'PaperSpecInvoicesFragment',
          })

          const index = parentSpec.invoices.findIndex(
            (p) => p.id === delta.payload.id
          )

          if (index !== -1) {
            parentSpec.invoices.splice(index, 1)
            apolloClient.writeFragment({
              id: `${Typename.PAPER_SPEC}:${delta.parentId}`,
              fragment: PAPER_SPEC_INVOICES_FRAGMENT,
              fragmentName: 'PaperSpecInvoicesFragment',
              data: parentSpec,
            })
          }
        }

        // SPEC

        if (operation === Operation.UPDATE_SPEC) {
          const mergeOptions = {
            customMerge: (key) => {
              if (key === 'comments') {
                return commentsMerge
              }
              if (key === 'containers') {
                const merge = (_, source) => {
                  return source || []
                }
                return merge
              }
            },
          }
          const cacheData = apolloClient.readFragment({
            id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
            fragment: PAPER_SPEC_FRAGMENT,
            fragmentName: 'PaperSpecFragment',
          })
          const data =
            delta.payload.__typename === Typename.PAPER_SPEC
              ? deepmerge(cacheData, delta.payload, mergeOptions)
              : deepmerge(cacheData, delta.payload.fields, mergeOptions)
          apolloClient.writeFragment({
            id: `${Typename.PAPER_SPEC}:${delta.payload.id}`,
            fragment: PAPER_SPEC_FRAGMENT,
            fragmentName: 'PaperSpecFragment',
            data,
          })
        }
      },
      error: (error) => {
        this.$logger.warn('Error: ', error)
      },
    })
  },
  methods: {
    async downloadPdf() {
      try {
        this.downloadLoading = true
        const requisite = this.spec.requisite || {}
        const client = this.spec.client || {}
        const shipment = this.spec.shipment || {}
        const customs = this.spec.customs || {}
        const isDraft = !this.spec.readyToPrint
        await printInvoice(
          this.spec,
          requisite,
          client,
          shipment,
          customs,
          'download',
          isDraft
        )
      } catch (error) {
        this.$notify({
          color: 'error',
          text: `Error creating PDF: ${error.message}`,
        })
        throw new Error(error)
      } finally {
        this.downloadLoading = false
      }
    },
    async printPdf() {
      try {
        this.printLoading = true
        const requisite = this.spec.requisite || {}
        const client = this.spec.client || {}
        const shipment = this.spec.shipment || {}
        const customs = this.spec.customs || {}
        const isDraft = !this.spec.readyToPrint
        await printInvoice(
          this.spec,
          requisite,
          client,
          shipment,
          customs,
          'print',
          isDraft
        )
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
    setScrollLeft(scrollLeft, invoiceId) {
      this.invoiceScrollId = invoiceId
      this.invoiceScrollLeft = scrollLeft
    },
    expand(id) {
      if (this.expanded.includes(id)) {
        const index = this.expanded.indexOf(id)
        this.expanded.splice(index, 1)
        this.removeExpandedInvoices({
          specId: this.specId,
          ids: [id],
          prefix: PAPER_STORE_KEY_PREFIX,
        })
      } else {
        this.expanded.push(id)
        this.addExpandedInvoices({
          specId: this.specId,
          ids: [id],
          prefix: PAPER_STORE_KEY_PREFIX,
        })
      }
    },
    toggleExpandAll() {
      if (this.expanded.length === 0) {
        this.expandAll()
      } else {
        this.collapseAll()
      }
    },
    collapseAll() {
      this.expanded = []
      this.setExpandedInvoices({
        specId: this.specId,
        ids: [],
        prefix: PAPER_STORE_KEY_PREFIX,
      })
    },
    expandAll() {
      const invoices = this.items
      const ids = invoices.reduce((acc, curr) => {
        return [...acc, curr.id]
      }, [])
      this.expanded = ids
      this.setExpandedInvoices({
        specId: this.specId,
        ids,
        prefix: PAPER_STORE_KEY_PREFIX,
      })
    },
  },
}
</script>

<style scoped lang="postcss">
.spec-container {
  width: 140px;
  height: 56px;
}
.spec-container--lg {
  width: 245px;
}
.spec-container__progress {
  padding: 3px 5px;
}
.spec-container__progress > div {
  will-change: width;
  transition: width 0.4s cubic-bezier(0.61, 1, 0.88, 1);
}

.spec-shipped {
  width: 100%;
}
.spec-shipped__arrow {
  border-color: transparent;
  border-style: solid;
  content: '';
  position: absolute;
  pointer-events: none;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  top: 0;
  left: 50%;
  border-width: 15px 15px 0 15px;
  border-top-color: inherit;
}

@screen sm {
  .spec-shipped {
    width: 148px;
  }
  .spec-shipped__arrow {
    border-color: transparent;
    transform: translateY(-50%);
    top: 50%;
    left: 0;
    border-width: 15px 0 15px 15px;
    border-left-color: inherit;
  }
}
</style>
