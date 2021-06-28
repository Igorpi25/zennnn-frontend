import { defineComponent } from 'vue'
import Avatar from './Avatar'

export default defineComponent({
  props: {
    hideAvatar: Boolean,
    avatarSrc: String,
    avatarSize: {
      type: Number,
      default: 48,
    },
    avatarClass: String,
    hideInfo: Boolean,
    infoClass: String,
    title: String,
    subtitle: String,
    initials: String,
  },

  setup(props, { slots }) {
    return () => (
      <div class="flex">
        {!props.hideAvatar && (
          <Avatar
            size={props.avatarSize}
            src={props.avatarSrc}
            class={[
              'bg-light-gray-400 dark:bg-gray-700 text-xl',
              props.avatarClass,
            ]}
          >
            {props.initials}
          </Avatar>
        )}
        {!props.hideInfo && (
          <div
            class={['flex flex-col justify-center truncate', props.infoClass]}
          >
            <div
              class="text-gray-900 dark:text-white truncate"
              style="line-height: 19px;"
            >
              {slots.title ? slots.title() : props.title}
            </div>
            <div
              class="text-xs text-gray-200 dark:text-gray-100"
              style="line-height: 14px;"
            >
              {slots.subtitle ? slots.subtitle() : props.subtitle}
            </div>
          </div>
        )}
      </div>
    )
  },
})
