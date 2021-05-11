<template>
  <div class="overflow-x-auto grid gap-y-2 gap-x-4 auto-cols-min">
    <template
      v-for="name in colorNames"
      :key="name"
    >
      <div class="col-span-12">{{ name }}</div>
      <div
        v-for="range in ranges"
        :key="range"
      >
        <div
          :style="{ background: colors[name][range] }"
          :class="{ 'shadow-inner': !colors[name][range] }"
          class="w-12 h-10 rounded"
        >
        </div>
        <div
          :class="['text-xs pt-1', colors[name][range] ? 'text-gray-400 dark:text-gray-100' : 'opacity-30']"
        >
          {{ range }}
        </div>
        <div class="text-xs text-gray-100 dark:text-gray-300">
          {{ colors[name][range] }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const ranges = [50, 100, 200, 300, 400, 500, 550, 600, 650, 700, 800, 900]
const colors = {
  'light-gray': {
    50: '#FCFCFC',
    100: '#F8F8F8',
    200: '#F4F4F4',
    300: '#F0F0F0',
    400: '#E4E4E4',
    500: '#E0E0E0',
    550: '#DADADA',
    600: '#C4C4C4',
    700: '#BDBDBD',
    800: '#878787',
    900: '#828282',
  },
  gray: {
    100: '#AAAAAA',
    200: '#676767', // IN_DRAFT
    300: '#585858',
    400: '#404040',
    500: '#353535',
    600: '#2F2F2F',
    650: '#2A2A2A',
    700: '#282828',
    800: '#232323',
    900: '#1E1E1E',
  },
  blue: {
    400: '#83BBEE', // primary hover color
    500: '#5BAAF0', // primary color
    550: '#549EDE', // primary active color
    600: '#0476FF',
    800: '#4634B0',
    900: '#4C51BF', // custom price color
  },
  'cold-blue': {
    400: '#2F80ED', // shipped color
    500: '#345DEE', // landing color
    600: '#2F52D4', // landing hover color
  },
  pink: {
    500: '#FF005E', // error, IN_PROCESSING
    600: '#E00052',
  },
  purple: {
    500: '#EF20E6',
  },
  green: {
    400: '#13F626',
    500: '#08DC1B', // success, IN_STOCK
    600: '#07C517',
  },
  yellow: {
    300: '#EAD377', // input warning
    400: '#D7C370', // checkbox error text
    500: '#FDB600', // warning, IN_PRODUCTION
  },
  red: {
    // 500: '#FF212D',
    // 600: '#FF121F', // spec total client debt text
    500: '#FF005E', // TODO: *-pink-500 replace with *-red-500
    600: '#E62828',
    700: '#BE0000',
    900: '#3D242D', // error color
  },
}
const colorNames = Object.keys(colors)
</script>
