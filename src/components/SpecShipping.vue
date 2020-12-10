<template>
  <div class="w-full">
    <h4 class="text-white text-xl font-semibold leading-6 mb-4">
      {{ $t('shipping.cargoInfo') }}
    </h4>

    <!-- Summary -->
    <div class="flex flex-wrap sm:flex-nowrap -mx-2 pb-4">
      <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
        <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
          <div class="flex text-gray-200 pb-2">
            <i class="zi-calendar text-gray-300 text-2xl mr-2" />
            <span>
              {{ $t('shipping.estimateDate') }}
            </span>
          </div>
          <div class="text-white text-lg font-semibold pl-8 sm:pl-0 md:pl-8 lg:pl-0 xl:pl-8">
            {{ spec.estimateShippingDate ? $d($parseDate(spec.estimateShippingDate), 'short') : this.$t('placeholder.emptyDate') }}
          </div>
        </div>
      </div>
      <div class="w-1/2 pb-4 sm:pb-0 sm:w-1/4 px-2">
        <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
          <div class="flex text-gray-200 pb-2">
            <i class="zi-cup text-gray-200 text-2xl mr-2" />
            <span>
              {{ $t('shipping.totalVolume') }}
            </span>
          </div>
          <div class="text-white text-lg font-semibold pl-8 sm:pl-0 md:pl-8 lg:pl-0 xl:pl-8">
            {{ $n(spec.totalVolume || 0) }} {{ $t('measure.m3') }}
          </div>
        </div>
      </div>
      <div class="w-1/2 sm:w-1/4 px-2">
        <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
          <div class="flex text-gray-200 pb-2">
            <i class="zi-boxes text-gray-300 text-2xl mr-2" />
            <span>
              {{ $t('shipping.totalPackages') }}
            </span>
          </div>
          <div class="text-white text-lg font-semibold pl-8 sm:pl-0 md:pl-8 lg:pl-0 xl:pl-8">
            {{ $n(spec.qtyOfPackages || 0) }}
          </div>
        </div>
      </div>
      <div class="w-1/2 sm:w-1/4 px-2">
        <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
          <div class="flex text-gray-200 pb-2">
            <i class="zi-massa text-gray-300 text-2xl mr-2" />
            <span>
              {{ $t('shipping.totalWeight') }}
            </span>
          </div>
          <div class="text-white text-lg font-semibold pl-8 sm:pl-0 md:pl-8 lg:pl-0 xl:pl-8">
            {{ $n(spec.totalWeight || 0) }} {{ $t('measure.kg') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Containers -->
    <v-slide-y-transition hide-on-leave>
      <div
        v-if="!hideContainers"
        class="relative sm:flex bg-gray-700 rounded-md overflow-hidden"
      >
        <div class="flex-grow p-5 leading-4">
          <div
            v-for="(container, i) of containers"
            :key="i"
            class="flex flex-col xl:flex-row items-center justify-center"
          >
            <div
              v-if="container.full"
              style="min-height: 160px;"
              class="text-sm text-gray-200"
            >
              <div>
                <span class="text-white text-xl font-semibold pr-1">{{ container.full }}</span>
                <span>{{ $tc('shipping.container', container.full) }}</span>
                <span class="text-white text-xl font-semibold pl-1">{{ `${container.size.replace('_', '')}'${container.mode.replace('_', '')}` }}</span>
              </div>
              <div :class="['spec-container relative my-2', { 'spec-container--lg': container.size === '_40' || container.size === '_45' }]">
                <div class="spec-container__progress w-full h-full">
                  <div
                    style="width: 100%;"
                    class="relative w-0 h-full"
                  >
                    <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                  </div>
                </div>
                <div class="absolute inset-0">
                  <img v-if="container.size === '_20'" src="@/assets/icons/c20_2x.png" alt="40'">
                  <img v-else src="@/assets/icons/c40_2x.png" alt="20'">
                </div>
                <div class="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
                  100%
                </div>
              </div>
            </div>
            <div
              v-if="container.full"
              class="flex items-center px-4 py-2"
            >
              <i class="zi-plus text-4xl text-gray-400" />
            </div>
            <div class="text-sm text-gray-200" style="min-height: 160px;">
              <div>
                <span class="text-white text-xl font-semibold pl-1">{{ `${container.size.replace('_', '')}'${container.mode.replace('_', '')}` }}</span>
              </div>
              <div :class="['spec-container relative my-2', { 'spec-container--lg': container.size === '_40' || container.size === '_45' }]">
                <div class="spec-container__progress h-full">
                  <div
                    :style="{ width: (container.loaded || 0) + '%' }"
                    class="relative w-0 h-full"
                  >
                    <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                  </div>
                </div>
                <div class="absolute inset-0">
                  <img v-if="container.size === '_20'" src="@/assets/icons/c20_2x.png" alt="40'">
                  <img v-else src="@/assets/icons/c40_2x.png" alt="20'">
                </div>
                <div class="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
                  {{ container.loaded || 0 }}%
                </div>
              </div>
            </div>
          </div>
          <slot name="actions" />
        </div>
      </div>
    </v-slide-y-transition>

  </div>
</template>

<script>
export default {
  name: 'SpecShipping',
  props: {
    spec: {
      type: Object,
      default: () => ({}),
    },
    hideContainers: Boolean,
  },
  computed: {
    containers () {
      return this.spec.containers || []
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
  transition: width .4s cubic-bezier(0.61, 1, 0.88, 1);
}
</style>
