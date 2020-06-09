<template>
  <div class="flex-grow flex flex-col">
    <!-- / HEADER -->
    <Header />
    <!-- <header class="border-b border-gray-75">
      <div class="h-20 flex items-center container container--sm">
        <router-link
          :to="{ name: 'home' }"
          class="flex-shrink-0 select-none focus:outline-none mr-2 sm:mr-6"
        >
          <img src="@/assets/img/logo-light.svg" alt="Logo" style="height: 18px">
        </router-link>
        <i class="zi-chevron-up text-2xl text-gray-75 transform rotate-90" />
        <div class="ml-2 sm:ml-6">
          {{ tr.title }}
        </div>
        <div class="flex-grow flex items-center justify-end">
          <router-link
            :to="{ name: 'signin' }"
            class="hidden sm:block text-blue-500 select-none focus:outline-none focus:text-blue-600 hover:text-blue-600 mr-3 sm:mr-8"
          >
            {{ $t('signup.signin') }}
          </router-link>
          <Button
            outlined
            :to="{ name: 'signup' }"
            merge-class="border-blue-500 hover:text-blue-600"
          >
            {{ $t('signup.submit') }}
          </Button>
        </div>
      </div>
    </header> -->
    <!-- HEADER / -->
    <!-- / MAIN -->
    <main class="container container--sm flex-grow py-16">
      <h1
        class="text-40 font-bold mb-6"
      >
        {{ tr.title }}
      </h1>
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg py-4 px-6 max-w-screen-md">
        <div class="flex-1 flex items-center">
          <div class="w-16 h-16 rounded-full overflow-hidden">
            <img v-if="profile.picture" :src="profile.picture" alt="Avatar">
          </div>
          <div>
            <div class="text-lg">{{ `${profile.givenName} ${profile.familyName}` }}</div>
            <div class="text-gray-100">{{ profile.email }}</div>
          </div>
        </div>
        <div v-if="!hasNotSubscription" class="flex-1 max-w-xs">
          <div>
            <div class="border-l border-gray-75 pl-6">
               <div class="text-lg">{{ profile.account && profile.account.plan }}</div>
              <div class="text-gray-100">{{ tr.tariffTitle }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!hasNotSubscription" class="text-right max-w-screen-md py-2 px-3">
        <div>
          <v-dialog v-model="changeDialog">
            <template v-slot:activator="{ on }">
              <button
                class="select-none focus:outline-none text-blue-500 focus:text-blue-600 hover:text-blue-600"
                v-on="on"
              >
                {{ tr.changePlan }}
              </button>
            </template>
            <div class="bg-white p-4">
              <PriceList
                :selected.sync="changeProduct"
                :select-text="tr.selectText"
                :contact-text="tr.contactText"
                :current-product-id="profile.account && profile.account.planProduct"
                :current-text="tr.currentText"
                is-logged-in
                selectable
              />
              <div class="border-b border-gray-75 my-16" />
              <div class="text-black max-w-screen-md">
                <h3 class="text-2xl pb-4">
                  {{ tr.selectPaymentType }}:
                </h3>
                <div
                  :class="{ 'border-blue-500': changePaymentType === 'monthly' }"
                  class="h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4 mb-4"
                  @click="changePaymentType = 'monthly'"
                >
                  <RadioInput v-model="changePaymentType" value="monthly" label="monthly" hide-details>
                    <span class="ml-4">{{ tr.monthly }}</span>
                  </RadioInput>
                  <div />
                  <div class="flex items-center w-full max-w-sm">
                    <span class="font-bold">{{ changeProduct.mPrice }}</span>
                    <span v-if="changeProduct.mPriceInCurrency" class="pl-1">~</span>
                    <span v-if="changeProduct.mPriceInCurrency" class="pl-1">{{ changeProduct.mPriceInCurrency }}</span>
                    <span class="pl-1">{{ tr.inMonth }}</span>
                  </div>
                </div>
                <div
                  :class="{ 'border-blue-500': changePaymentType === 'annually' }"
                  class="h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4"
                  @click="changePaymentType = 'annually'"
                >
                  <RadioInput v-model="changePaymentType" value="annually" label="annually" hide-details>
                    <span class="ml-4">{{ tr.annual }}</span>
                  </RadioInput>
                  <div />
                  <div class="flex items-center w-full max-w-sm">
                    <span class="font-bold">{{ changeProduct.aPriceTotal }}</span>
                    <span v-if="changeProduct.aPriceInCurrency" class="pl-1">~</span>
                    <span class="pl-1">{{ changeProduct.aPriceInCurrency || changeProduct.aPrice }}</span>
                    <span class="pl-1">{{ tr.inMonth }}</span>
                    <div class="h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 ml-6 px-2">
                      экономия 50%
                    </div>
                  </div>
                </div>
                <div class="flex justify-between text-2xl pt-10 pr-4 mr-xs">
                  <div>{{ tr.total }}:</div>
                  <div />
                  <div class="flex items-center w-full max-w-sm">
                    <span class="font-bold">{{ changePaymentType === 'annually' ? changeProduct.aPriceTotal : changeProduct.mPrice }}</span>
                    <span v-if="changeProduct.mPriceInCurrency || changeProduct.aPriceInCurrency" class="pl-1">~</span>
                    <span class="pl-1">{{ changePaymentType === 'annually' ? changeProduct.aPriceInCurrency || changeProduct.aPrice : currentProduct.mPriceInCurrency }}</span>
                    <span class="pl-1">{{ tr.inMonth }}</span>
                  </div>
                </div>
              </div>
              <div class="border-b border-gray-75 mt-16 mb-10" />
              <div class="text-right h-12">
                <Button
                  v-show="changeProduct[changePaymentType === 'monthly' ? 'mId' : 'aId'] !== profile.account.planPrice"
                  :loading="changeLoading"
                  @click="changeSubscription"
                >
                  {{ tr.change }}
                </Button>
              </div>
            </div>
          </v-dialog>
        </div>
        <div>
          <button
            class="select-none focus:outline-none text-blue-500 focus:text-blue-600 hover:text-blue-600"
            @click="cancelSubscription"
          >
            {{ tr.cancelSubscription }}
          </button>
        </div>
      </div>
      <template v-if="hasNotSubscription">
        <div class="pt-12">
          <PriceList
            :selected.sync="currentProduct"
            :select-text="tr.selectText"
            :contact-text="tr.contactText"
            is-logged-in
            selectable
          />
        </div>
        <div class="border-b border-gray-75 my-16" />
        <div class="text-black max-w-screen-md">
          <h3 class="text-2xl pb-4">
            {{ tr.selectPaymentType }}:
          </h3>
          <div
            :class="{ 'border-blue-500': currentPaymentType === 'monthly' }"
            class="h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4 mb-4"
            @click="currentPaymentType = 'monthly'"
          >
            <RadioInput v-model="currentPaymentType" value="monthly" label="monthly" hide-details>
              <span class="ml-4">{{ tr.monthly }}</span>
            </RadioInput>
            <div />
            <div class="flex items-center w-full max-w-sm">
              <span class="font-bold">{{ currentProduct.mPrice }}</span>
              <span v-if="currentProduct.mPriceInCurrency" class="pl-1">~</span>
              <span v-if="currentProduct.mPriceInCurrency" class="pl-1">{{ currentProduct.mPriceInCurrency }}</span>
              <span class="pl-1">{{ tr.inMonth }}</span>
            </div>
          </div>
          <div
            :class="{ 'border-blue-500': currentPaymentType === 'annually' }"
            class="h-14 flex items-center justify-between rounded-md cursor-pointer border-2 border-transparent p-4"
            @click="currentPaymentType = 'annually'"
          >
            <RadioInput v-model="currentPaymentType" value="annually" label="annually" hide-details>
              <span class="ml-4">{{ tr.annual }}</span>
            </RadioInput>
            <div />
            <div class="flex items-center w-full max-w-sm">
              <span class="font-bold">{{ currentProduct.aPriceTotal }}</span>
              <span v-if="currentProduct.aPriceInCurrency" class="pl-1">~</span>
              <span class="pl-1">{{ currentProduct.aPriceInCurrency || currentProduct.aPrice }}</span>
              <span class="pl-1">{{ tr.inMonth }}</span>
              <div class="h-8 flex items-center rounded-md font-semibold text-white bg-yellow-400 ml-6 px-2">
                экономия 50%
              </div>
            </div>
          </div>
          <div class="flex justify-between text-2xl pt-10 pr-4 mr-xs">
            <div>{{ tr.total }}:</div>
            <div />
            <div class="flex items-center w-full max-w-sm">
              <span class="font-bold">{{ currentPaymentType === 'annually' ? currentProduct.aPriceTotal : currentProduct.mPrice }}</span>
              <span v-if="currentProduct.mPriceInCurrency || currentProduct.aPriceInCurrency" class="pl-1">~</span>
              <span class="pl-1">{{ currentPaymentType === 'annually' ? currentProduct.aPriceInCurrency || currentProduct.aPrice : currentProduct.mPriceInCurrency }}</span>
              <span class="pl-1">{{ tr.inMonth }}</span>
            </div>
          </div>
        </div>
      </template>
      <div v-show="hasNotSubscription || hasIncompliteSubscription">
        <div class="border-b border-gray-75 my-16" />
        <div class="text-black max-w-screen-md">
          <h3 class="flex items-center justify-between text-2xl pb-4">
            <div>{{ tr.creditCardData }}:</div>
            <div class="flex-shrink">
              <svg width="92" height="21" viewBox="0 0 92 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.349" fill-rule="evenodd" clip-rule="evenodd" d="M87.385 20.5H5.0773C2.52807 20.5 0.461914 18.4338 0.461914 15.8846V5.11538C0.461914 2.56615 2.52807 0.5 5.0773 0.5H87.385C89.9342 0.5 92.0004 2.56615 92.0004 5.11538V15.8846C92.0004 18.4338 89.9342 20.5 87.385 20.5ZM91.2311 5.11538C91.2311 2.99154 89.5088 1.26923 87.385 1.26923H5.0773C2.95345 1.26923 1.23114 2.99154 1.23114 5.11538V15.8846C1.23114 18.0085 2.95345 19.7308 5.0773 19.7308H87.385C89.5088 19.7308 91.2311 18.0085 91.2311 15.8846V5.11538Z" fill="#424770"/>
                <path opacity="0.502" fill-rule="evenodd" clip-rule="evenodd" d="M47.1544 14.6823H46.1506L46.9275 12.7638L45.3813 8.86231H46.4421L47.4136 11.5177L48.3929 8.86231H49.4536L47.1544 14.6823ZM43.3006 13.0069C42.9529 13.0069 42.5959 12.8777 42.2729 12.6262V12.91H41.2367V7.08923H42.2729V9.13769C42.5959 8.89461 42.9529 8.76538 43.3006 8.76538C44.3852 8.76538 45.1298 9.63923 45.1298 10.8862C45.1298 12.1323 44.3852 13.0069 43.3006 13.0069ZM43.0821 9.65538C42.799 9.65538 42.5152 9.77692 42.2729 10.02V11.7523C42.5152 11.9946 42.799 12.1162 43.0821 12.1162C43.6652 12.1162 44.0698 11.6146 44.0698 10.8862C44.0698 10.1577 43.6652 9.65538 43.0821 9.65538ZM37.0421 12.6262C36.7267 12.8777 36.3706 13.0069 36.0144 13.0069C34.9375 13.0069 34.1852 12.1323 34.1852 10.8862C34.1852 9.63923 34.9375 8.76538 36.0144 8.76538C36.3706 8.76538 36.7267 8.89461 37.0421 9.13769V7.08923H38.0867V12.91H37.0421V12.6262ZM37.0421 10.02C36.8075 9.77692 36.5244 9.65538 36.2413 9.65538C35.6498 9.65538 35.2452 10.1577 35.2452 10.8862C35.2452 11.6146 35.6498 12.1162 36.2413 12.1162C36.5244 12.1162 36.8075 11.9946 37.0421 11.7523V10.02ZM30.8736 11.1692C30.9383 11.7846 31.4244 12.2054 32.1036 12.2054C32.4767 12.2054 32.889 12.0677 33.3098 11.8246V12.6915C32.849 12.9015 32.3875 13.0069 31.9336 13.0069C30.7113 13.0069 29.8536 12.1162 29.8536 10.8538C29.8536 9.63154 30.6952 8.76538 31.8529 8.76538C32.9136 8.76538 33.6336 9.59923 33.6336 10.7885C33.6336 10.9023 33.6336 11.0315 33.6175 11.1692H30.8736ZM31.8129 9.56615C31.3106 9.56615 30.9221 9.93923 30.8736 10.4977H32.6383C32.6059 9.94692 32.2744 9.56615 31.8129 9.56615ZM28.1452 10.2062V12.91H27.109V8.86231H28.1452V9.26692C28.4367 8.94308 28.7929 8.76538 29.1406 8.76538C29.2544 8.76538 29.3675 8.77308 29.4806 8.80538V9.72846C29.3675 9.69615 29.2383 9.68 29.1167 9.68C28.7767 9.68 28.4121 9.86615 28.1452 10.2062ZM23.5229 11.1692C23.5875 11.7846 24.0729 12.2054 24.7529 12.2054C25.1252 12.2054 25.5383 12.0677 25.959 11.8246V12.6915C25.4975 12.9015 25.0359 13.0069 24.5829 13.0069C23.3606 13.0069 22.5029 12.1162 22.5029 10.8538C22.5029 9.63154 23.3444 8.76538 24.5021 8.76538C25.5621 8.76538 26.2829 9.59923 26.2829 10.7885C26.2829 10.9023 26.2829 11.0315 26.2667 11.1692H23.5229ZM24.4613 9.56615C23.9598 9.56615 23.5713 9.93923 23.5229 10.4977H25.2875C25.2552 9.94692 24.9229 9.56615 24.4613 9.56615ZM19.9036 12.91L19.0775 10.1577L18.2598 12.91H17.329L15.9367 8.86231H16.9729L17.7906 11.6146L18.6083 8.86231H19.5467L20.3644 11.6146L21.1821 8.86231H22.2183L20.8344 12.91H19.9036ZM13.5721 13.0069C12.3498 13.0069 11.4836 12.1246 11.4836 10.8862C11.4836 9.63923 12.3498 8.76538 13.5721 8.76538C14.7944 8.76538 15.6529 9.63923 15.6529 10.8862C15.6529 12.1246 14.7944 13.0069 13.5721 13.0069ZM13.5721 9.63154C12.9652 9.63154 12.5444 10.1415 12.5444 10.8862C12.5444 11.6308 12.9652 12.1408 13.5721 12.1408C14.1713 12.1408 14.5921 11.6308 14.5921 10.8862C14.5921 10.1415 14.1713 9.63154 13.5721 9.63154ZM9.0221 10.91H8.09133V12.91H7.05518V7.34H9.0221C10.1559 7.34 10.9652 8.07692 10.9652 9.12923C10.9652 10.1815 10.1559 10.91 9.0221 10.91ZM8.87671 8.18231H8.09133V10.0685H8.87671C9.47594 10.0685 9.89671 9.68769 9.89671 9.12923C9.89671 8.56308 9.47594 8.18231 8.87671 8.18231ZM85.9359 11.3085H81.6598C81.7575 12.3323 82.5075 12.6338 83.359 12.6338C84.2259 12.6338 84.909 12.4508 85.5044 12.1508V13.91C84.9113 14.2392 84.1275 14.4762 83.0836 14.4762C80.9559 14.4762 79.4652 13.1438 79.4652 10.51C79.4652 8.28538 80.7298 6.51923 82.8075 6.51923C84.8821 6.51923 85.9652 8.28461 85.9652 10.5215C85.9652 10.7331 85.9459 11.1908 85.9359 11.3085ZM82.7936 8.3C82.2475 8.3 81.6406 8.71231 81.6406 9.69615H83.899C83.899 8.71308 83.3298 8.3 82.7936 8.3ZM75.9298 14.4762C75.1652 14.4762 74.6982 14.1538 74.3844 13.9238L74.3798 16.3954L72.1959 16.86L72.1952 6.66461H74.1182L74.2321 7.20385C74.5336 6.92231 75.0867 6.51923 75.9429 6.51923C77.4767 6.51923 78.9213 7.90077 78.9213 10.4438C78.9213 13.2192 77.4921 14.4762 75.9298 14.4762ZM75.4206 8.45385C74.9198 8.45385 74.6052 8.63692 74.3775 8.88692L74.3906 12.1323C74.6029 12.3623 74.9082 12.5469 75.4206 12.5469C76.2282 12.5469 76.7698 11.6677 76.7698 10.4915C76.7698 9.34923 76.2198 8.45385 75.4206 8.45385ZM69.0382 6.66461H71.2306V14.32H69.0382V6.66461ZM69.0382 4.22L71.2306 3.75385V5.53308L69.0382 5.99923V4.22ZM66.7006 9.13V14.32H64.5175V6.66461H66.4059L66.5429 7.31C67.0544 6.37 68.0752 6.56077 68.3659 6.66538V8.67308C68.0882 8.58308 67.2167 8.45231 66.7006 9.13ZM62.019 11.6346C62.019 12.9215 63.3975 12.5208 63.6767 12.4092V14.1869C63.3859 14.3469 62.8582 14.4762 62.1444 14.4762C60.8482 14.4762 59.8752 13.5215 59.8752 12.2285L59.8852 5.22154L62.0175 4.76769L62.019 6.66461H63.6775V8.52692H62.019V11.6346ZM59.2967 12.0069C59.2967 13.5792 58.0452 14.4762 56.229 14.4762C55.4759 14.4762 54.6529 14.33 53.8406 13.9808V11.8954C54.5736 12.2938 55.5075 12.5931 56.2313 12.5931C56.7183 12.5931 57.069 12.4623 57.069 12.0585C57.069 11.0162 53.749 11.4085 53.749 8.99077C53.749 7.44461 54.9298 6.51923 56.7013 6.51923C57.4252 6.51923 58.1483 6.63 58.8721 6.91846V8.97615C58.2075 8.61692 57.3636 8.41385 56.6998 8.41385C56.2421 8.41385 55.9575 8.54615 55.9575 8.88692C55.9575 9.87 59.2967 9.40231 59.2967 12.0069Z" fill="#424770"/>
              </svg>
            </div>

          </h3>
          <form id="subscription-form" @submit.prevent.stop>
            <div
              id="card-element"
              :class="[isCardElementFocused ? 'shadow-blue-500' : 'shadow-gray-75']"
              class="h-12 bg-white rounded transition-colors duration-150 ease-in-out px-4 py-3 mb-1"
            />
            <div
              id="card-errors"
              role="alert"
              :class="[cardElementError ? 'opacity-100' : 'opacity-0']"
              class="opacity-0 text-red-500 leading-tight transition-opacity duration-100 ease-in px-1"
              style="min-height: 20px"
            >
              {{ cardElementError }}
            </div>
          </form>
        </div>
        <div class="border-b border-gray-75 mt-10 mb-16" />
        <div class="text-black max-w-screen-md">
          <h3 class="text-2xl pb-6">
            {{ tr.paymentInfo }}:
          </h3>
          <div class="flex flex-wrap">
            <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
              <Select
                v-model="country"
                :search.sync="countriesSearch"
                :items="countries"
                :label="tr.countryLabel"
                :placeholder="tr.countryLabel"
                searchable
                item-value="value"
                item-text="text"
                content-class="bg-white shadow-gray-75"
                input-class="placeholder-gray-100 text-gray-900"
                label-class="text-black"
              />
            </div>
            <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
              <TextField
                v-model="city"
                :label="tr.cityLabel"
                :placeholder="tr.cityPlaceholder"
                content-class="bg-white shadow-gray-75"
                input-class="placeholder-gray-100 text-gray-900"
                label-class="text-black"
              />
            </div>
            <div class="w-full sm:w-1/2 sm:pr-3 pb-6">
              <TextField
                v-model="street"
                :label="tr.streetLabel"
                :placeholder="tr.streetPlaceholder"
                content-class="bg-white shadow-gray-75"
                input-class="placeholder-gray-100 text-gray-900"
                label-class="text-black"
              />
            </div>
            <div class="w-full sm:w-1/2 sm:pl-3 pb-6">
              <TextField
                v-model="postcode"
                :label="tr.postcodeLabel"
                :placeholder="tr.postcodePlaceholder"
                content-class="bg-white shadow-gray-75"
                input-class="placeholder-gray-100 text-gray-900"
                label-class="text-black"
              />
            </div>
          </div>
        </div>
        <div class="border-b border-gray-75 mt-10 mb-10" />
        <div class="flex justify-between max-w-screen-md pb-10">
          <Button
            outlined
            merge-class="border-gray-100"
            style="min-width: 120px"
            @click="$router.go(-1)"
          >
            {{ tr.back }}
          </Button>
          <Button
            :loading="loading"
            style="min-width: 120px"
            @click="onCardFormSubmit"
          >
            {{ tr.buy }}
          </Button>
        </div>
      </div>
      <div v-if="listPaymentMethods">
        <div class="border-b border-gray-75 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ tr.paymentMethod }}:
        </h3>
        <div class="max-w-screen-md">
          <table>
            <tbody>
              <tr
                v-for="item in listPaymentMethods"
                :key="item.id"
                class="py-4"
              >
                <td class="px-3">{{ item.card.brand }} ending in {{ item.card.last4 }}</td>
                <td class="px-3">{{ item.card.exp_month.toString().padStart(2, '0') }}/{{ item.card.exp_year }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="listPaymentInvoices" class="pb-10">
        <div class="border-b border-gray-75 mt-16 mb-16" />
        <h3 class="text-2xl pb-6">
          {{ tr.invoices }}:
        </h3>
        <div class="max-w-screen-md">
          <table>
            <tbody>
              <tr
                v-for="item in listPaymentInvoices"
                :key="item.id"
                class="py-4"
              >
                <td class="px-3">{{ item.number }}</td>
                <td class="px-3">{{ $d($parseDate(item.period_start * 1000)) }}</td>
                <td class="px-3">${{ $n(item.amount_due / 100) }}</td>
                <td class="px-3">{{ item.status }}</td>
                <td class="px-3">
                  <a :href="item.invoice_pdf" target="_brank" class="focus:ouline-none text-gray-200 hover:text-blue-500 focus:text-blue-500">
                    <i class="zi-download text-2xl" />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
    <!-- MAIN / -->
    <Footer />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import PriceList from '../components/PriceList.vue'
import Footer from '../components/Footer.vue'
import { GET_PROFILE, GET_IS_LOGGED_IN, LIST_PAYMENT_METHODS, LIST_PAYMENT_INVOICES } from '../graphql/queries'
import { CREATE_PAYMENT_SUBSCRIPTION, RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD, CHANGE_PAYMENT_SUBSCRIPTION, CANCEL_PAYMENT_SUBSCRIPTION } from '../graphql/mutations'
import { PAYMENT_DATA } from '../graphql/subscriptions'
import Countries from '../config/countries-iso3.json'

export default {
  name: 'Payment',
  components: {
    Header,
    PriceList,
    Footer,
  },
  metaInfo: {
    style: [
      { cssText: 'body { background-color: #F7F7F7!important }', type: 'text/css' },
    ],
    meta: [
      { hid: 'title', name: 'title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { hid: 'description', name: 'description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:title', property: 'og:title', content: 'Сервис для международной оптовой торговли с удаленным управлением | ZENNNN' },
      { vmid: 'og:description', property: 'og:description', content: 'Представляем вам революционной сервис международной оптовой торговли с возможностью удаленного контроля и управления закупками. Вся операционная деятельность компании в одной системе.' },
      { vmid: 'og:site_name', property: 'og:site_name', content: 'ZENNNN' },
      { vmid: 'og:url', property: 'og:url', content: `${process.env.VUE_APP_HOSTNAME}${window.location.pathname}` },
      { vmid: 'og:image', property: 'og:image', content: `${process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME}/ses/zennnn_logo_light_2x.png` },
    ],
  },
  apollo: {
    isLoggedIn: {
      query: GET_IS_LOGGED_IN,
    },
    getProfile: {
      query: GET_PROFILE,
      // fetchPolicy: 'cache-only',
      // skip () {
      //   return !this.isLoggedIn
      // },
    },
    listPaymentMethods: {
      query: LIST_PAYMENT_METHODS,
      fetchPolicy: 'no-cache',
    },
    listPaymentInvoices: {
      query: LIST_PAYMENT_INVOICES,
      fetchPolicy: 'no-cache',
    },
  },
  data () {
    return {
      tr: {
        title: 'Оплата',
        tariffTitle: 'Тариф',
        selectPaymentType: 'Выберите тип оплаты',
        monthly: 'Ежемесячно',
        annual: 'Годовой',
        total: 'Итого',
        creditCardData: 'Данные кредитной карты',
        creditCardNumberPlaceholder: 'Номер карты',
        creditCardAttrPlaceholder: 'ММ / ГГ CVC',
        paymentInfo: 'Платежная информация',
        countryLabel: 'Страна',
        countryPlaceholder: 'Укажите страну',
        cityLabel: 'Город',
        cityPlaceholder: 'Укажите город',
        streetLabel: 'Улица',
        streetPlaceholder: 'Укажите улицу',
        postcodeLabel: 'Индекс',
        postcodePlaceholder: 'Укажите индекс',
        back: 'Назад',
        buy: 'Купить',
        selectText: 'Выбрать',
        contactText: 'Связаться',
        currentText: 'Текущий',
        inMonth: 'в месяц',
        paymentMethod: 'Способы оплаты',
        invoices: 'Счета',
        changePlan: 'Сменить план',
        cancelSubscription: 'Отменить подписку',
        change: 'Сменить',
      },
      changeProduct: {},
      currentProduct: {},
      currentPrice: {},
      loading: false,
      isCardElementFocused: false,
      cardElementError: '',
      country: '',
      city: '',
      street: '',
      postcode: '',
      countriesSearch: '',
      currentTariffName: 'advanced',
      currentPaymentType: 'monthly',
      changePaymentType: 'monthly',
      changeLoading: false,
      changeDialog: false,
    }
  },
  computed: {
    hasNotSubscription () {
      return this.profile.account &&
        (!this.profile.account.subscriptionId || (this.profile.account.subscriptionStatus === 'trialing'))
    },
    hasIncompliteSubscription () {
      return this.profile.account &&
        (this.profile.account.subscriptionStatus === 'incomplete' || this.profile.account.subscriptionStatus === 'past_due')
    },
    selectedPriceId () {
      const key = this.currentPaymentType === 'monthly' ? 'mId' : 'aId'
      return this.currentProduct[key]
    },
    profile () {
      return this.getProfile || {}
    },
    countries () {
      return Object.entries(Countries).map(([k, v]) => {
        const name = this.$te(`countries.${k}`, 'en') ? this.$t(`countries.${k}`, 'en') : v
        return {
          text: this.$te(`countries.${k}`) ? this.$t(`countries.${k}`) : name,
          value: k,
          name,
        }
      })
    },
  },
  mounted () {
    this.createStripeScript()
    const observer = this.$apollo.subscribe({
      query: PAYMENT_DATA,
      fetchPolicy: 'no-cache',
    })

    observer.subscribe({
      next: ({ data }) => {
        const paymentData = data.paymentData
        const operation = paymentData.operation
        const payload = paymentData.payload
        this.$logger.info('payment', operation, payload)
        if (operation === 'invoice.payment_succeeded') {
          // this.$notify({ color: 'success', text: 'Payment success.' })
        }
        if (operation === 'invoice.payment_failed') {
          // this.$notify({ color: 'error', text: 'Payment failed.' })
        }
        // update profile
        this.$apollo.query({
          query: GET_PROFILE,
          fetchPolicy: 'network-only',
        })
      },
    })
  },
  methods: {
    createStripeScript () {
      // load the Stripe SDK
      if (window.Stripe) {
        this.initStripe()
      } else {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        script.onload = this.initStripe
        document.body.appendChild(script)
      }
    },
    initStripe () {
      this.stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY)
      this.elements = this.stripe.elements()
      const style = {
        base: {
          color: '#1E1E1E',
          fontFamily: 'MyriadPro, sans-serif',
          fontSize: '16px',
          '::placeholder': {
            color: '#AAAAAA',
          },
        },
        invalid: {
          color: '#FF212D',
          iconColor: '#FF212D',
        },
      }
      this.cardElement = this.elements.create('card', { style })
      this.cardElement.mount('#card-element')
      this.cardElement.on('change', this.showCardError)
      this.cardElement.on('focus', () => { this.isCardElementFocused = true })
      this.cardElement.on('blur', () => { this.isCardElementFocused = false })
    },
    onCardFormSubmit (e) {
      e.preventDefault()
      this.createPaymentMethod(
        this.cardElement,
        this.getProfile.account.customerId,
        this.selectedPriceId,
      )
    },
    showCardError (event) {
      this.cardElementError = event.error
        ? event.error.message : ''
    },
    async createPaymentMethod (cardElement, customerId, priceId) {
      this.loading = true
      const props = {
        type: 'card',
        card: cardElement,
      }
      const address = []
      if (this.city) address.push(['city', this.city])
      if (this.country) address.push(['country', this.country])
      if (this.street) address.push(['line1', this.street])
      if (this.postcode) address.push(['postal_code', this.postcode])
      if (address.length > 0) {
        const billingDetails = { address: {} }
        address.forEach(([key, value]) => {
          billingDetails.address[key] = value
        })
        props.billing_details = billingDetails
      }
      const result = await this.stripe.createPaymentMethod(props)
      if (result.error) {
        this.showCardError(result)
        this.loading = false
      } else {
        if (this.hasIncompliteSubscription) {
          this.retryInvoiceWithNewPaymentMethod({
            customerId,
            paymentMethodId: result.paymentMethod.id,
            invoiceId: this.profile.account.latestInvoiceId,
          })
        } else {
          this.createSubscription({
            customerId,
            paymentMethodId: result.paymentMethod.id,
            priceId,
          })
        }
      }
    },
    async retryInvoiceWithNewPaymentMethod ({ customerId, paymentMethodId, invoiceId }) {
      try {
        this.loading = true
        const { data } = await this.$apollo.mutate({
          mutation: RETRY_INVOICE_WITH_NEW_PAYMENT_METHOD,
          variables: {
            customerId,
            paymentMethodId,
            invoiceId,
          },
          fetchPolicy: 'no-cache',
        })
        const response = data.retryInvoiceWithNewPaymentMethod
        if (response.error) {
          // The card had an error when trying to attach it to a customer.
          throw response
        }
        // Normalize the response to contain the object returned by Stripe.
        // Add the addional details we need.
        const result = {
          paymentMethodId,
          invoice: response,
          isRetry: true,
          priceId: this.selectedPriceId,
        }
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        const customActionResult = await this.handlePaymentThatRequiresCustomerAction(result)
        // No more actions required. Provision your service for the user.
        this.onSubscriptionComplete(customActionResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        this.showCardError(error)
      } finally {
        this.loading = false
      }
    },
    async createSubscription ({ customerId, paymentMethodId, priceId }) {
      try {
        this.loading = true
        const { data } = await this.$apollo.mutate({
          mutation: CREATE_PAYMENT_SUBSCRIPTION,
          variables: {
            customerId,
            paymentMethodId,
            priceId,
          },
          fetchPolicy: 'no-cache',
        })
        const response = data.createPaymentSubscription
        if (response.error) {
          // The card had an error when trying to attach it to a customer.
          throw response
        }
        // Normalize the response to contain the object returned by Stripe.
        // Add the addional details we need.
        const result = {
          paymentMethodId,
          priceId,
          subscription: response,
        }
        // Some payment methods require a customer to be on session
        // to complete the payment process. Check the status of the
        // payment intent to handle these actions.
        const customActionResult = await this.handlePaymentThatRequiresCustomerAction(result)
        // If attaching this card to a Customer object succeeds,
        // but attempts to charge the customer fail, you
        // get a requires_payment_method error.
        const requiresPaymentMethodResult = await this.handleRequiresPaymentMethod(customActionResult)
        // No more actions required. Provision your service for the user.
        this.onSubscriptionComplete(requiresPaymentMethodResult)
      } catch (error) {
        // An error has happened. Display the failure to the user here.
        // We utilize the HTML element we created.
        this.showCardError(error)
      } finally {
        this.loading = false
      }
    },
    async changeSubscription () {
      this.changeLoading = true
      try {
        const key = this.changePaymentType === 'monthly' ? 'mId' : 'aId'
        const priceId = this.changeProduct[key]
        await this.$apollo.mutate({
          mutation: CHANGE_PAYMENT_SUBSCRIPTION,
          variables: {
            priceId,
          },
          fetchPolicy: 'no-cache',
        })
        // update profile
        this.$apollo.query({
          query: GET_PROFILE,
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$notify({ type: 'error', text: error.message })
      } finally {
        this.changeDialog = false
        this.changeLoading = false
      }
    },
    async cancelSubscription (priceId) {
      await this.$apollo.mutate({
        mutation: CANCEL_PAYMENT_SUBSCRIPTION,
        fetchPolicy: 'no-cache',
      })
      // update profile
      this.$apollo.query({
        query: GET_PROFILE,
        fetchPolicy: 'network-only',
      })
    },
    async handlePaymentThatRequiresCustomerAction ({ subscription, invoice, priceId, paymentMethodId, isRetry }) {
      if (subscription && subscription.status === 'active') {
        // Subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId }
      }

      // If it's a first payment attempt, the payment intent is on the subscription latest invoice.
      // If it's a retry, the payment intent will be on the invoice itself.
      const paymentIntent = invoice ? invoice.payment_intent : subscription.latest_invoice.payment_intent

      if (
        paymentIntent.status === 'requires_action' ||
        (isRetry === true && paymentIntent.status === 'requires_payment_method')
      ) {
        try {
          const result = await this.stripe
            .confirmCardPayment(paymentIntent.client_secret, {
              payment_method: paymentMethodId,
            })
          if (result.error) {
            // Start code flow to handle updating the payment details.
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc).
            throw result
          } else {
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer.
              // There's a risk of the customer closing the window before the callback.
              // We recommend setting up webhook endpoints later in this guide.
              return {
                priceId,
                subscription,
                invoice,
                paymentMethodId,
              }
            }
          }
        } catch (error) {
          this.showCardError(error)
        }
      } else {
        // No customer action needed.
        return { subscription, priceId, paymentMethodId }
      }
    },
    async handleRequiresPaymentMethod ({ subscription, paymentMethodId, priceId }) {
      if (subscription.status === 'active') {
        // subscription is active, no customer actions required.
        return { subscription, priceId, paymentMethodId }
      } else if (
        subscription.latest_invoice.payment_intent.status ===
          'requires_payment_method'
      ) {
        // Using localStorage to manage the state of the retry here,
        // feel free to replace with what you prefer.
        // Store the latest invoice ID and status.
        sessionStorage.setItem('latestInvoiceId', subscription.latest_invoice.id)
        sessionStorage.setItem(
          'latestInvoicePaymentIntentStatus',
          subscription.latest_invoice.payment_intent.status,
        )
        throw { error: { message: 'Your card was declined.' } } // eslint-disable-line no-throw-literal
      } else {
        return { subscription, priceId, paymentMethodId }
      }
    },
    onSubscriptionComplete ({ subscription }) {
      // Payment was successful.
      if (subscription && subscription.status === 'active') {
        // Change your UI to show a success message to your customer.
        // Call your backend to grant access to your service based on
        // `result.subscription.items.data[0].price.product` the customer subscribed to.
        this.$notify({ color: 'info', text: 'Operation complited.' })
      }
      this.$apollo.queries.listPaymentMethods.refetch()
      this.$apollo.queries.listPaymentInvoices.refetch()
    },
  },
}
</script>
