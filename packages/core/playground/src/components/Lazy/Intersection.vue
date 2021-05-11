<template>
  <div class="overflow-y-auto" style="max-height: 300px">
    <Intersection
      v-for="index in 60"
      :key="index"
      :once="false"
      :quiet="false"
      class="h-8"
      transition="slide-x-transition"
    >
      <div class="flex items-center">
        {{ index }}
      </div>
    </Intersection>
  </div>
</template>
