import {
  h,
  ref,
  computed,
  nextTick,
  withDirectives,
  watch,
  onBeforeMount,
  defineComponent,
} from 'vue'
import { useFilterProps, useFilter, Mask } from 'vue-supp'
import { ziChecked } from '@zennnn/icons'
import { useInputProps, useInput } from '../../composables/useInput'
import {
  useInputClearProps,
  useInputClear,
} from '../../composables/useInputClear'
import {
  useInputControlProps,
  useInputControl,
} from '../../composables/useInputControl'
import {
  useInputValidationProps,
  useInputValidation,
} from '../../composables/useInputValidation'
import { useInputMessage } from '../../composables/useInputMessage'
import { useSelect } from '../../composables/useSelect'
import { useDelayProps } from '../../composables/useDelay'
import uid from '../../utils/uid'
import Icon from '../Icon'
import { Menu, MenuItem } from '../Menu'

import type { PropType } from 'vue'

const classNames = (...classes: unknown[]) => classes.filter(Boolean).join(' ')

export default defineComponent({
  name: 'Select',

  props: {
    ...useInputProps(),
    ...useInputClearProps(),
    ...useInputValidationProps(),
    ...useInputControlProps(),
    ...useFilterProps(),
    ...useDelayProps(),
    modelValue: {
      type: [String, Number, Date, Object] as PropType<
        string | number | Date | object | null
      >,
      default: null,
    },
    mask: String,
    singleLine: Boolean,
    solo: Boolean,
    dense: Boolean,
    type: {
      type: String,
      default: 'text',
    },
    inputmode: {
      type: String,
      default: 'text',
    },
    minlength: String,
    maxlength: String,
    autocomplete: {
      type: String,
      default: 'off',
    },
    size: [Number, String],
    attach: {
      type: [Boolean, String],
      default: true,
    },
    height: [String, Number],
    minHeight: [String, Number],
    maxHeight: [Number, String],
    distance: {
      type: Number,
      default: 0,
    },
    returnObject: Boolean,
    showArrow: {
      type: Boolean,
      default: true,
    },
    boxClass: String,
    contentClass: String,
    contentOnIntersect: Boolean,
    ariaLabel: String,
    ariaAutocomplete: String,
    placeholder: String,
    onSelect: Function as PropType<(val: any) => void>,
    onClearClick: Function as PropType<(e: MouseEvent) => void>,
    onFocus: Function as PropType<(e: Event) => void>,
    onBlur: Function as PropType<(e: Event) => void>,
    onKeydown: Function as PropType<(e: KeyboardEvent) => void>,
    onMousedown: Function as PropType<(e: MouseEvent) => void>,
    onMouseup: Function as PropType<(e: MouseEvent) => void>,
  },

  slots: [
    'label',
    'prepend',
    'append',
    'prependItem',
    'appendItem',
    'item',
    'prependOuter',
    'appendOuter',
    'noData',
    'noResult',
  ],

  emits: [
    'select',
    'update:modelValue',
    'update:search',
    'update:error',
    'clearClick',
    'focus',
    'blur',
    'keydown',
    'mousedown',
    'mouseup',
  ],

  setup(props, { slots, emit }) {
    const id: string = uid('select-')
    const listboxId: string = uid('listbox-')

    const rootElement = ref<HTMLElement>()

    const {
      inputElement,
      internalValue,
      isFocused,
      badInput,
      isDirty,
      focus,
      blur,
      genLabel,
    } = useInput(props, { slots, emit, id })

    const { getText, getValue } = useFilter(props)

    const {
      showDetails,
      isDisabled,
      isReadonly,
      hasState,
      hasError,
      hasMessages,
      messagesToDisplay,
      isPatternMismatch,
      genStateIcon,
    } = useInputValidation(props, { emit, id, internalValue, isFocused })

    const {
      controlElement,
      hasPrependSlot,
      hasAppendSlot,
      onControlClick,
      onControlMouseDown,
      onControlMouseUp,
      genPrependSlot,
      genAppendSlot,
    } = useInputControl(props, {
      emit,
      slots,
      inputElement,
      isFocused,
      isDisabled,
    })

    const { genInputMessages } = useInputMessage(props, {
      inputElement,
      isFocused,
      isPatternMismatch,
      hasMessages,
      hasError,
      messagesToDisplay,
      showDetails,
    })

    const { genClearInput } = useInputClear(props, {
      inputElement,
      isDirty,
      emit,
      emitChange: () => {
        select(null)
        closeMenu()
      },
      setInternalValue: (val) => setInternalValue(val),
    })

    const {
      menuRef,
      selectedItem,
      isMenuActive,
      items,
      toggleMenu,
      openMenu,
      closeMenu,
      genPrependOuterSlot,
      genAppendOuterSlot,
      genArrow,
      genDivider,
      genNoData,
    } = useSelect(props, {
      internalValue,
      inputElement,
      isDisabled,
      isReadonly,
      listboxId,
      slots,
    })

    const classes = computed(() => ({
      input: true,
      'input--focused': isFocused.value,
      'input--disabled': isDisabled.value,
      'input--dirty': internalValue.value,
      'input--has-error':
        ((hasMessages.value && hasError.value) || isPatternMismatch.value) &&
        showDetails.value,
      select: true,
      'select--is-menu-active': isMenuActive.value,
    }))

    const hasPrepend = computed(() => hasPrependSlot.value)

    const hasAppend = computed(
      () =>
        hasAppendSlot.value ||
        hasState.value ||
        props.clearable ||
        props.showArrow
    )

    const isActive = computed(() => isFocused.value || isMenuActive.value)

    watch(isFocused, (val) => {
      val && openMenu()
    })

    watch(
      () => props.modelValue,
      (val) => {
        setInternalValue(val)
      }
    )

    onBeforeMount(() => {
      // override initial set of model value
      internalValue.value = getValue(props.modelValue)
      setSelectedItem(props.returnObject ? props.modelValue : undefined)
    })

    function setInternalValue(val: any) {
      internalValue.value = getValue(val)
      setSelectedItem(props.returnObject ? val : undefined)
    }

    function select(val: any) {
      selectedItem.value = val
      const value = props.returnObject ? val : getValue(val)
      emit('update:modelValue', value)
      emit('select', value)
    }

    function setSelectedItem(val: any) {
      if (!val) {
        selectedItem.value = items.value.find(
          (item) => getValue(item) === internalValue.value
        )
      } else {
        selectedItem.value = val
      }
    }

    function onFocus(e: Event) {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      if (!isFocused.value) {
        isFocused.value = true

        e && emit('focus', e)
      }
      if (typeof window !== 'undefined' && e && e.target && !isDisabled.value) {
        const target = e.target as HTMLInputElement
        target.selectionEnd = target.selectionStart
      }
    }

    function onBlur(e: Event) {
      isFocused.value = false

      // clear pattern mismatch
      isPatternMismatch.value = false

      e && nextTick(() => emit('blur', e))
    }

    function onInput(e: Event) {
      const target = e.target as HTMLInputElement

      badInput.value = target.validity && target.validity.badInput

      if (!isMenuActive.value) openMenu()
    }

    function onEnter(e: KeyboardEvent) {
      e.preventDefault()
      const menu = menuRef.value!
      if (!isMenuActive.value) {
        openMenu()
      } else if (menu.activeItem) {
        menu.activeItem.click()
      }
    }

    function onArrowUp(e: KeyboardEvent) {
      e.preventDefault()
      const menu = menuRef.value!
      if (!isMenuActive.value) {
        openMenu()
        !internalValue.value && setTimeout(menu.goToPrevItem)
      } else {
        menu.goToPrevItem()
      }
    }

    function onArrowDown(e: KeyboardEvent) {
      e.preventDefault()
      const menu = menuRef.value!
      if (!isMenuActive.value) {
        openMenu()
        !internalValue.value && setTimeout(menu.goToNextItem)
      } else {
        menu.goToNextItem()
      }
    }

    function onTab(e: KeyboardEvent) {
      const menu = menuRef.value!
      if (isMenuActive.value) {
        if (menu.activeItem) {
          e.preventDefault()
          e.stopPropagation()
          menu.activeItem.click()
        } else {
          closeMenu()
        }
      } else {
        closeMenu()
      }
    }

    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        if (isMenuActive.value) {
          e.stopPropagation()
        }
        e.preventDefault()
        closeMenu()
      } else if (e.key === 'Enter') {
        onEnter(e)
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        toggleMenu()
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        onArrowUp(e)
      } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        onArrowDown(e)
      } else if (e.key === 'Tab') {
        onTab(e)
      }

      emit('keydown', e)
    }

    function genSelectInput() {
      const data: Record<string, unknown> = {
        id,
        ref: inputElement,
        value: getText(selectedItem.value),
        class: [
          {
            input__input: true,
            'input__input--dense': props.dense || props.solo,
            'input__input--has-prepend': hasPrepend.value,
            'input__input--has-append': hasAppend.value,
            select__input: true,
            'cursor-pointer': !isDisabled.value && !isReadonly.value,
            'pl-8': isMenuActive.value && !hasPrepend.value,
          },
          props.inputClass,
        ],
        name: props.name,
        required: props.required,
        placeholder: props.placeholder,
        type: props.type,
        autofocus: props.autofocus,
        minlength: props.minlength,
        maxlength: props.maxlength,
        inputmode: props.inputmode,
        autocomplete: props.autocomplete,
        'aria-label': props.ariaLabel,
        'aria-autocomplete': props.ariaAutocomplete,
        'aria-haspopup': true,
        'aria-expanded': isMenuActive.value ? true : undefined,
        'aria-controls': isMenuActive.value ? listboxId : undefined,
        readonly: true,
        disabled: isDisabled.value,
        onFocus: onFocus,
        onBlur: onBlur,
        onInput: onInput,
        onKeydown: onKeydown,
        onClick: () => {
          if (!isDisabled.value && !isReadonly.value) {
            openMenu()
          }
        },
      }
      if (props.size) data.size = props.size
      if (props.pattern) data.pattern = props.pattern
      if (props.mask) {
        return withDirectives(h('input', data), [[Mask, props.mask]])
      }
      return h('input', data)
    }

    function genControl() {
      return h(
        'div',
        {
          ref: controlElement,
          class: [
            {
              input__control: true,
              'input__control--solo': props.solo,
              'input__control--has-prepend': hasPrepend.value,
              'input__control--has-append': hasAppend.value,
              select__control: true,
              'select__control--is-active': isActive.value,
              'select__control--is-menu-active': isMenuActive.value,
            },
            props.controlClass,
          ],
          onClick: onControlClick,
          onMousedown: onControlMouseDown,
          onMouseup: onControlMouseUp,
        },
        [
          genPrependOuterSlot(),
          ...genPrependSlot(),
          genSelectInput(),
          genClearInput(),
          ...genAppendSlot(),
          genStateIcon(),
          genArrow(),
          genAppendOuterSlot(),
        ]
      )
    }

    function genMenu() {
      return h(
        Menu,
        {
          ref: menuRef,
          modelValue: isMenuActive.value,
          value: internalValue.value,
          activator: controlElement.value,
          attach: props.attach,
          transition: null,
          arrow: false,
          closeOnClick: true,
          closeOnContentClick: false,
          openOnClick: false,
          openOnHover: false,
          disableKeys: true,
          width: '100%',
          placement: 'bottom-start',
          distance: props.distance,
          tabindex: '-1',
          id: listboxId,
          allowOverflow: true,
          height: props.height,
          minHeight: props.minHeight,
          maxHeight: props.maxHeight,
          openDelay: props.openDelay,
          closeDelay: props.closeDelay,
          disabled: isDisabled.value || isReadonly.value,
          visibleOnReferenceHidden: true,
          boxClass: classNames(
            'select-box shadow-none dark:shadow-none rounded-t-none',
            props.solo || props.dense ? 'select-box--dense' : undefined,
            props.boxClass
          ),
          contentClass: classNames(
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-t-none',
            props.contentClass
          ),
          includeElements: [controlElement.value],
          role: 'listbox',
          'onUpdate:modelValue': (val: boolean) => {
            isMenuActive.value = val
          },
          'onUpdate:value': (val: any) => {
            select(val)
          },
        },
        {
          default: () => genMenuItems(),
        }
      )
    }

    function genMenuItems() {
      const itemClassNames = classNames(
        'listbox__option',
        props.solo || props.dense ? 'h-8' : 'h-10',
        'pl-0'
      )
      let index = 0
      const children: any[] = items.value.map((item) => {
        if (item.divider) {
          return genDivider(index)
        }
        const value = getValue(item)
        return h(
          MenuItem,
          {
            tag: 'template',
            id: item.$id,
            index: index++,
            key: value,
            disabled: item.disabled,
            value: value,
            role: 'option',
            class: itemClassNames,
            contentOnIntersect: props.contentOnIntersect,
            onClick: (e: MouseEvent) => {
              if (item.disabled) return e.preventDefault()
              menuRef.value?.selectItem(item)
              inputElement.value &&
                inputElement.value.focus({ preventScroll: true })
              nextTick(closeMenu)
            },
          },
          {
            default: (slotProps: any) => {
              return slots.item
                ? h('div', undefined, slots.item({ item, ...slotProps }))
                : h('div', undefined, [
                    h(
                      'div',
                      {
                        class: 'w-8 flex justify-center flex-shrink-0',
                      },
                      getValue(selectedItem.value) === getValue(item)
                        ? h(Icon, { size: 24 }, { default: () => ziChecked })
                        : undefined
                    ),
                    h('div', { class: 'truncate' }, getText(item)),
                  ])
            },
          }
        )
      })
      if (props.items.length === 0) {
        children.push(genNoData())
      }
      slots.prependItem && children.unshift(slots.prependItem())
      slots.appendItem && children.push(slots.appendItem())
      return children
    }

    return {
      rootElement,
      classes,
      internalValue,
      isFocused,
      isActive,
      isMenuActive,
      selectedItem,
      focus,
      blur,
      genLabel,
      genControl,
      genInputMessages,
      genMenu,
      toggleMenu,
      openMenu,
      closeMenu,
      onEnter,
      onArrowUp,
      onArrowDown,
      onTab,
    }
  },

  render() {
    return h(
      'div',
      {
        ref: 'rootElement',
        class: this.classes,
      },
      [
        this.genLabel(),
        this.genInputMessages(),
        this.genControl(),
        this.genMenu(),
      ]
    )
  },
})
