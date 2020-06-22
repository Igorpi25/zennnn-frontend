<template>
  <div
    :class="[light ? 'text-gray-400' : 'text-gray-100']"
  >
    <div class="flex items-center pb-2">
      <div class="w-8 h-8 flex items-center flex-shrink-0 mr-sm">
        <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
          <i class="zi-user text-2xl text-gray-200" />
        </div>
      </div>
      <div :class="['font-semibold flex-grow', light ? 'text-gray-900' : 'text-white']">
        {{ item.senderName || '' }}
      </div>
      <div>
      </div>
      <div
        v-if="item.updatedAt"
        class="text-sm"
      >
        {{ $d($parseDate(item.updatedAt), 'time') }}, {{ $d($parseDate(item.updatedAt), 'short') }}
      </div>
    </div>
    <div class="leading-tight">
      {{ item.comment }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentCard',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    light: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
