import { h, ref, computed, watch, Transition, withDirectives, vShow } from 'vue'

import type { Ref, ComputedRef } from 'vue'

export interface InputMessageProps {
  messagesOnFocused?: boolean
  patternMessage?: string
}

export interface InputMessageContext {
  inputElement: Ref<HTMLElement | undefined>
  isFocused: Ref<boolean>
  isPatternMismatch?: Ref<boolean>
  hasMessages: ComputedRef<boolean>
  hasError: ComputedRef<boolean>
  messagesToDisplay: ComputedRef<string[]>
  showDetails: ComputedRef<boolean>
}

export const useInputMessage = (
  props: InputMessageProps,
  {
    inputElement,
    isFocused,
    isPatternMismatch,
    hasMessages,
    hasError,
    messagesToDisplay,
    showDetails,
  }: InputMessageContext
) => {
  // messagesToDisplay cleared before animation end,
  // set message to display before enable
  const internalMessage = ref<string | undefined>()

  const showPatternMismatch = computed(() => {
    return isPatternMismatch && isPatternMismatch.value && props.patternMessage
  })

  const showPopupMessage = computed(() => {
    const showError =
      hasMessages.value &&
      hasError.value &&
      (!props.messagesOnFocused || (props.messagesOnFocused && isFocused.value))
    return showPatternMismatch.value || showError
  })

  watch(showPopupMessage, (val) => {
    const m = showPatternMismatch.value
      ? props.patternMessage
      : messagesToDisplay.value[0]
    if (val) {
      internalMessage.value = m
    }
  })

  const genInputMessages = () => {
    if (!showDetails.value) return undefined

    const content = withDirectives(
      h(
        'div',
        { class: 'relative h-0 w-full' },
        h(
          'div',
          { class: 'absolute inset-x-0 bottom-0 -mb-2' },
          h(
            'div',
            {
              class: 'bg-yellow-300 text-black rounded-t px-sm pt-2 pb-4',
              onClick: () => {
                if (!props.messagesOnFocused) inputElement.value?.focus()
              },
            },
            internalMessage.value
          )
        )
      ),
      [[vShow, showPopupMessage.value]]
    )

    return h(
      Transition,
      {
        enterActiveClass: 'transition-opacity ease-out-quart duration-200',
        leaveActiveClass: 'transition-opacity ease-out-quart duration-150',
        enterFromClass: 'opacity-0',
        leaveToClass: 'opacity-0',
      },
      () => content
    )
  }

  return {
    genInputMessages,
  }
}
