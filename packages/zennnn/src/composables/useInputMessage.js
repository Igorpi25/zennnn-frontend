import { h, computed } from 'vue'
import { convertToUnit } from 'vue-supp'

import Menu from '../components/Base/Menu'

// Default
export const useInputMessage = (props, {
  controlElement,
  isFocused,
  isPatternMismatch,
  hasMessages,
  hasError,
  messagesToDisplay,
  showDetails,
  dimensions,
}) => {
  const showPatternMismatch = computed(() => {
    return isPatternMismatch && isPatternMismatch.value && props.patternMessage
  })

  const showPopupMessage = computed(() => {
    const showError = hasMessages.value && hasError.value &&
      (!props.messagesOnFocused || (props.messagesOnFocused && isFocused.value))
    return showPatternMismatch.value || showError
  })

  // TODO: popper activator can be virtual
  const genInputMessages = () => {
    if (!showDetails.value || !controlElement.value) return null

    const message = showPatternMismatch.value
      ? props.patternMessage
      : messagesToDisplay.value[0]

    return h(Menu, {
      modelValue: showPopupMessage.value,
      activator: controlElement.value,
      attach: false,
      top: true,
      arrow: false,
      closeOnClick: false,
      closeOnContentClick: false,
      openOnClick: false,
      openOnHover: false,
      disableKeys: true,
      zIndex: 'unset',
      tabindex: '-1',
      role: 'alert',
      width: dimensions.value.width,
      distance: dimensions.value.height * -1,
      allowOverflow: true,
      boxClass: 'shadow-none dark:shadow-none',
      contentClass: 'bg-yellow-300 dark:bg-yellow-300 ring-1 ring-yellow-300 text-black dark:text-black rounded px-sm py-2',
      onClick: () => {
        if (!props.messagesOnFocused) {
          focus()
        }
      },
    }, {
      default: () => {
        return h('div', {
          style: {
            minHeight: convertToUnit(dimensions.value.height),
            paddingBottom: convertToUnit(dimensions.value.height),
          },
        }, message)
      },
    })
  }

  return {
    genInputMessages,
  }
}