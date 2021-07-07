import {
  h,
  ref,
  watch,
  provide,
  inject,
  defineComponent,
  ComputedRef,
} from 'vue'

import uid from '../../utils/uid'

type ErrorBag = Record<string, boolean>
type Watchers = {
  id: string
  valid: () => void
  shouldValidate: () => void
}
interface FormInput {
  id: string
  hasError: ComputedRef<boolean>
  shouldValidate: ComputedRef<boolean>
  reset: () => void
  resetValidation: () => void
  validate: (force: boolean, value?: any) => boolean
}
interface FormApi {
  disabled: boolean
  readonly: boolean
  register: (input: FormInput) => void
  unregister: (input: FormInput) => void
  validate: () => void
  reset: () => void
  resetErrorBag: () => void
  resetValidation: () => void
}

export const FormContext = Symbol('FormContext')

export const useFormContext = (): FormApi | null => {
  const context = inject(FormContext, null)

  return context
}

export default defineComponent({
  name: 'Form',

  props: {
    valid: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    lazyValidation: Boolean,
  },

  emits: ['update:valid', 'submit'],

  setup(props, { emit }) {
    const id: string = uid('form-')
    const rootElement = ref<HTMLElement>()
    const inputs = ref<any[]>([]) // TODO: better typing
    const watchers = ref<Watchers[]>([])
    const errorBag = ref<ErrorBag>({})

    watch(
      errorBag,
      (val) => {
        const errors = Object.values(val).includes(true)

        emit('update:valid', !errors)
      },
      { deep: true, immediate: true }
    )

    const watchInput = (input: FormInput): Watchers => {
      const watcher = (input: FormInput): (() => void) => {
        return watch(
          input.hasError,
          (val) => {
            errorBag.value[input.id] = val
          },
          { immediate: true }
        )
      }

      const _watchers: Watchers = {
        id: input.id,
        valid: () => undefined,
        shouldValidate: () => undefined,
      }

      if (props.lazyValidation) {
        // Only start watching inputs if we need to
        _watchers.shouldValidate = watch(input.shouldValidate, (val) => {
          if (!val) return

          // Only watch if we're not already doing it
          if (Object.prototype.hasOwnProperty.call(errorBag.value, input.id))
            return

          _watchers.valid = watcher(input)
        })
      } else {
        _watchers.valid = watcher(input)
      }

      return _watchers
    }

    const validate = () => {
      return inputs.value.filter((input) => !input.validate(true)).length === 0
    }

    const reset = () => {
      inputs.value.forEach((input) => input.reset())
      resetErrorBag()
    }

    const resetErrorBag = () => {
      if (props.lazyValidation) {
        // Account for timeout in validatable
        setTimeout(() => {
          errorBag.value = {}
        }, 0)
      }
    }

    const resetValidation = () => {
      inputs.value.forEach((input) => input.resetValidation())
      resetErrorBag()
    }

    const register = (input: FormInput) => {
      inputs.value.push(input)
      watchers.value.push(watchInput(input))
    }

    const unregister = (input: FormInput) => {
      const found = inputs.value.find((i) => i.id === input.id)

      if (!found) return

      const unwatch = watchers.value.find((i) => i.id === found.id)
      if (unwatch) {
        unwatch.valid()
        unwatch.shouldValidate()
      }

      watchers.value = watchers.value.filter((i) => i.id !== found.id)
      inputs.value = inputs.value.filter((i) => i.id !== found.id)
      delete errorBag.value[found.id]
    }

    const api = {
      disabled: props.disabled,
      readonly: props.readonly,
      register,
      unregister,
      validate,
      reset,
      resetErrorBag,
      resetValidation,
    }

    provide(FormContext, api)

    return {
      id,
      inputs,
      errorBag,
      rootElement,
      validate,
      reset,
      resetErrorBag,
      resetValidation,
    }
  },

  render() {
    return h(
      'form',
      {
        ref: 'rootElement',
        id: this.id,
        novalidate: true,
        onSubmit: (e: Event) => {
          e.preventDefault()
          e.stopPropagation()
          this.$emit('submit', e)
        },
      },
      this.$slots.default?.()
    )
  },
})
