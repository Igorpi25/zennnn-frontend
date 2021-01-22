import { ref } from 'vue'

// Props
export const useInputControlProps = () => {
  return {
    controlClass: {
      type: String,
      default: '',
    },
    dependencies: Array,
  }
}

// Default
export const useInputControl = (props, { emit, inputElement, isFocused, isDisabled }) => {
  const controlElement = ref(null)
  const hasMouseDown = ref(false)

  const isContains = (target) => {
    if (!props.dependencies) return false
    return props.dependencies.some(el => el && el.contains(target))
  }

  const onControlClick = (e) => {
    if (isContains(e.target)) return

    if (isFocused.value || isDisabled.value || !inputElement.value) return
    inputElement.value.focus()
  }

  const onControlMouseDown = (e) => {
    if (isContains(e.target)) return

    // Prevent input from being blurred
    if (e.target !== inputElement.value) {
      e.preventDefault()
      e.stopPropagation()
    }
    hasMouseDown.value = true

    emit('mousedown', e)
  }

  const onControlMouseUp = (e) => {
    if (hasMouseDown.value) inputElement.value.focus()

    hasMouseDown.value = false

    emit('mouseup', e)
  }

  return {
    controlElement,
    hasMouseDown,
    onControlClick,
    onControlMouseDown,
    onControlMouseUp,
  }
}
