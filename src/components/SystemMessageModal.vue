<template>
  <div class="relative bg-gray-600">
    <div class="text-center pt-10 pb-12 px-12">
      <div class="flex justify-center pb-6">
        <i class="zi-info text-40 text-yellow-500" />
      </div>
      <div class="text-white text-lg text-center font-semibold pb-5">
        {{ title || $t('systemMessageModal.title') }}
      </div>
      <div class="text-center text-sm text-gray-100 pb-8 px-2">
        <p v-html="message" />
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>
    <span
      class="absolute top-0 right-0 mt-3 mr-4 text-gray-200 hover:text-gray-100 cursor-pointer"
      @click="$emit('close')"
    >
      <i class="zi-close text-2xl" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'SystemMessageModal',
  props: {
    title: String,
    message: String,
  },
}
</script>
