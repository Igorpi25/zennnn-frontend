<template>
  <div :class="[light ? 'text-gray-400' : 'text-gray-100']">
    <div class="flex items-center pb-2">
      <div class="w-8 h-8 flex items-center flex-shrink-0 mr-sm">
        <div
          class="
            w-full
            h-full
            rounded-full
            flex
            items-center
            justify-center
            border border-gray-200
          "
        >
          <Icon class="text-gray-200">
            {{ icons.ziUser }}
          </Icon>
        </div>
      </div>
      <div
        :class="[
          'font-semibold flex-grow',
          light ? 'text-gray-900' : 'text-white',
        ]"
      >
        {{ item.senderName || '' }}
      </div>
      <div></div>
      <div v-if="item.updatedAt" class="text-sm">
        {{ $d($parseDate(item.updatedAt), 'time') }},
        {{ $d($parseDate(item.updatedAt), 'short') }}
      </div>
    </div>
    <div class="leading-tight pl-8 ml-sm">
      {{ item.comment }}
    </div>
  </div>
</template>

<script>
import { ziUser } from '@zennnn/icons'
import { Icon } from '@zennnn/core'

export default {
  name: 'CommentCard',
  components: {
    Icon,
  },
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
  data() {
    return {
      icons: {
        ziUser,
      },
    }
  },
}
</script>
