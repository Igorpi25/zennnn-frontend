<template>
  <div
    class="py-1"
    :style="{ color: light ? '#494949' : '#aaa' }"
  >
    <div class="flex">
      <div class="w-8 flex items-center">
        <Icon size="28">
          {{ icons.mdiAccountCircle }}
        </Icon>
      </div>
      <div>
        <div class="font-medium h-4">
          {{ item.senderName || '' }}
        </div>
        <div class="pt-1">
          {{ item.comment }}
        </div>
        <div
          v-if="item.updatedAt"
          class="leading-none text-gray-light" style="font-size:10px;"
        >
          {{ $d($parseDate(item.updatedAt), 'time') }}, {{ $d($parseDate(item.updatedAt), 'short') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mdiAccountCircle } from '@mdi/js'

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
  data () {
    return {
      icons: {
        mdiAccountCircle,
      },
    }
  },
}
</script>
