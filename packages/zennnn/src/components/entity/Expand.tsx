import { defineComponent, ref } from 'vue'
import { ziQuestionSign, ziChevronRight } from '@zennnn/icons'
import { ExpandTransition, Tooltip, Icon, Btn } from '@zennnn/core'

import type { PropType } from 'vue'

export default defineComponent({
  props: {
    title: String,
    description: String,
    hint: String,
    hintMaxWidth: {
      type: [String, Number] as PropType<string | number>,
      default: 332,
    },
    expanded: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, { slots, attrs }) {
    const expanded = ref(props.expanded)

    function toggleExpand() {
      expanded.value = !expanded.value
    }

    return () => (
      <>
        <div class="flex items-center pt-10" {...attrs}>
          <div class="flex-grow text-lg leading-tight">
            <span class="text-gray-900 dark:text-white uppercase font-semibold tracking-widest">
              {props.title}
            </span>
            {props.description && (
              <span class="text-gray-200 mr-1">
                <span> </span>
                <span>{props.description}</span>
              </span>
            )}
            {props.hint && (
              <Tooltip
                placement="top-start"
                distance="2"
                skidding="-16"
                origin="24px 100%"
                maxWidth="332"
                v-slots={{
                  activator: () => (
                    <Icon class="text-blue-500 align-middle">
                      {ziQuestionSign}
                    </Icon>
                  ),
                }}
              >
                <span v-html={props.hint} />
              </Tooltip>
            )}
          </div>
          <Btn icon mini text onClick={toggleExpand}>
            <Icon
              class={{
                'transition-transform': true,
                'transform rotate-90': expanded.value,
              }}
            >
              {ziChevronRight}
            </Icon>
          </Btn>
        </div>
        <ExpandTransition>
          {expanded.value && slots.default?.()}
        </ExpandTransition>
      </>
    )
  },
})
