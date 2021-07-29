import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziUser } from '@zennnn/icons'
import { Icon } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const { d } = useI18n()

    return () => (
      <div class="text-gray-400 dark:text-gray-100">
        <div class="flex items-center pb-2">
          <div class="w-8 h-8 flex items-center flex-shrink-0 mr-2.5">
            <div class="w-full h-full rounded-full flex items-center justify-center border border-gray-200">
              <Icon class="text-gray-200">{ziUser}</Icon>
            </div>
          </div>
          <div class="font-semibold flex-grow text-gray-900 dark:text-white">
            {props.item.senderName || ''}
          </div>
          <div></div>
          {props.item.updatedAt && (
            <div class="text-sm">
              {d(parseDate(props.item.updatedAt), 'time')},
              {d(parseDate(props.item.updatedAt), 'short')}
            </div>
          )}
        </div>
        <div class="leading-tight pl-8 ml-2.5">{props.item.comment}</div>
      </div>
    )
  },
})
