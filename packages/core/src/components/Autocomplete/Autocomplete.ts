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

import {
  useFilterProps,
  useFilter,
  Mask,
  setCursor,
  getPropertyFromItem,
} from 'vue-supp'

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
import { useTextHighlight } from '../../composables/useTextHighlight'
import { useDelayProps } from '../../composables/useDelay'

import uid from '../../utils/uid'

import { Menu, MenuItem } from '../Menu'

import type { PropType } from 'vue'

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default defineComponent({
  name: 'Autocomplete',

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
    maxHeight: {
      type: [Number, String],
      default: 304,
    },
    distance: {
      type: Number,
      default: 0,
    },
    openOnFocus: Boolean,
    returnObject: Boolean,
    showArrow: {
      type: Boolean,
      default: true,
    },
    boxClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    contentOnIntersect: Boolean,
    ariaLabel: String,
    ariaAutocomplete: String,
    placeholder: String,
  },

  emits: [
    'update:modelValue',
    'update:search',
    'update:error',
    'click:clear',
    'focus',
    'blur',
    'keydown',
    'mousedown',
    'mouseup',
  ],

  setup(props, { slots, emit }) {
    const id: string = uid('autocomplete-')
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

    const { search, searchIsDirty, getText, getValue } = useFilter(props)

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
      genNoResult,
    } = useSelect(props, {
      internalValue,
      inputElement,
      isDisabled,
      isReadonly,
      listboxId,
      slots,
    })

    const { genFilteredText } = useTextHighlight(search)

    const classes = computed(() => {
      return {
        input: true,
        'input--focused': isFocused.value,
        'input--disabled': isDisabled.value,
        'input--dirty': internalValue.value,
        'input--has-error':
          ((hasMessages.value && hasError.value) || isPatternMismatch.value) &&
          showDetails.value,
        autocomplete: true,
        'autocomplete--is-menu-active': isMenuActive.value,
      }
    })

    const isActive = computed(() => {
      return isFocused.value || isMenuActive.value
    })

    const isSearching = computed(() => {
      return searchIsDirty.value && search.value !== getText(selectedItem.value)
    })

    const filteredItems = computed(() => {
      if (props.noFilter || !isSearching.value || search.value == null)
        return items.value
      return items.value.filter((item: any) => {
        const value = getPropertyFromItem(item, props.itemText)
        const text = value != null ? String(value) : ''
        const queryText = String(search.value)
        return props.filter(item, queryText, text)
      })
    })

    watch(filteredItems, (val, oldVal) => {
      if (val === oldVal) return
      menuRef.value?.goToItem(-1)
    })

    watch(isFocused, (val) => {
      val && props.openOnFocus && openMenu()
    })

    watch(isMenuActive, (val) => {
      val || updateSelf()
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
      setSearch()
    })

    const setInternalValue = (val: any) => {
      internalValue.value = getValue(val)
      setSelectedItem(props.returnObject ? val : undefined)
      setSearch()
    }

    const select = (val: any) => {
      selectedItem.value = val
      const value = props.returnObject ? val : getValue(val)
      emit('update:modelValue', value)
      setSearch()
    }

    const setSelectedItem = (val: any) => {
      if (!val) {
        selectedItem.value = items.value.find(
          (item) => getValue(item) === internalValue.value
        )
      } else {
        selectedItem.value = val
      }
    }

    const setSearch = () => {
      // Wait for nextTick so selectedItem
      // has had time to update
      nextTick(() => {
        if (!search.value || !isMenuActive.value) {
          search.value = getText(selectedItem.value)
        }
      })
    }

    const updateSelf = () => {
      if (!searchIsDirty.value && !internalValue.value) return

      if (search.value !== internalValue.value) {
        setSearch()
      }
    }

    const onFocus = (e: Event) => {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      if (!isFocused.value) {
        isFocused.value = true

        e && emit('focus', e)
      }
    }

    const onBlur = (e: Event) => {
      isFocused.value = false

      // clear pattern mismatch
      isPatternMismatch.value = false

      e && nextTick(() => emit('blur', e))
    }

    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement

      badInput.value = target.validity && target.validity.badInput

      if (!isMenuActive.value) openMenu()

      let value = target.value || ''

      if (props.pattern) {
        isPatternMismatch.value =
          target.validity && target.validity.patternMismatch
        if (isPatternMismatch.value) {
          let positionFromEnd = target.value.length - target.selectionEnd!
          const v = search.value || ''
          value = v
          target.value = v
          positionFromEnd = target.value.length - positionFromEnd
          setCursor(target, positionFromEnd)
        }
      }

      search.value = value
    }

    const onKeydown = (e: KeyboardEvent) => {
      const menu = menuRef.value!
      if (e.key === 'Esc' || e.key === 'Escape') {
        if (isMenuActive.value) {
          e.stopPropagation()
        }
        e.preventDefault()
        closeMenu()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (!isMenuActive.value) {
          openMenu()
        } else if (menu.activeItem) {
          menu.activeItem.click()
        }
      } else if (
        (e.key === ' ' || e.key === 'Spacebar') &&
        !isMenuActive.value
      ) {
        e.preventDefault()
        openMenu()
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault()
        if (!isMenuActive.value) {
          openMenu()
          !internalValue.value && setTimeout(menu.goToPrevItem)
        } else {
          menu.goToPrevItem()
        }
      } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault()
        if (!isMenuActive.value) {
          openMenu()
          !internalValue.value && setTimeout(menu.goToNextItem)
        } else {
          menu.goToNextItem()
        }
      } else if (e.key === 'Tab') {
        if (isMenuActive.value) {
          if (menu.activeItem) {
            e.preventDefault()
            e.stopPropagation()
            menu.activeItem.click()
            updateSelf()
          } else {
            closeMenu()
          }
        } else {
          closeMenu()
        }
      }

      emit('keydown', e)
    }

    const genSelectInput = () => {
      const data: Record<string, unknown> = {
        id,
        ref: inputElement,
        value: search.value,
        class: {
          input__input: true,
          'input__input--dense': props.dense || props.solo,
          autocomplete__input: true,
          [props.inputClass.trim()]: true,
        },
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
        readonly: isReadonly.value,
        disabled: isDisabled.value,
        onFocus: onFocus,
        onBlur: onBlur,
        onInput: onInput,
        onKeydown: onKeydown,
      }
      if (props.size) data.size = props.size
      if (props.pattern) data.pattern = props.pattern
      if (props.mask) {
        return withDirectives(h('input', data), [[Mask, props.mask]])
      }
      return h('input', data)
    }

    const genControl = () => {
      return h(
        'div',
        {
          ref: controlElement,
          class: {
            input__control: true,
            'input__control--solo': props.solo,
            'input__control--has-prepend': hasPrependSlot.value,
            'input__control--has-append':
              hasAppendSlot.value ||
              hasState.value ||
              props.clearable ||
              props.showArrow,
            autocomplete__control: true,
            'autocomplete__control--is-active': isActive.value,
            'autocomplete__control--is-menu-active': isMenuActive.value,
            [props.controlClass.trim()]: true,
          },
          onClick: onControlClick,
          onMousedown: onControlMouseDown,
          onMouseup: onControlMouseUp,
        },
        [
          genPrependOuterSlot(),
          genPrependSlot(),
          genSelectInput(),
          genAppendSlot(),
          genStateIcon(),
          genClearInput(),
          genArrow(),
          genAppendOuterSlot(),
        ]
      )
    }

    const genMenu = () => {
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
            'autocomplete-box shadow-none dark:shadow-none rounded-t-none',
            props.solo || props.dense ? 'autocomplete-box--dense' : '',
            isSearching.value && !slots.item ? 'listbox--searching' : '',
            props.boxClass.trim()
          ),
          contentClass: classNames(
            'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-t-none',
            props.contentClass.trim()
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

    const genMenuItems = () => {
      const itemClassNames = classNames(
        'listbox__option',
        props.solo || props.dense ? 'h-8' : 'h-10'
      )
      let index = 0
      const children: any[] = filteredItems.value.map((item) => {
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
                : h(
                    'div',
                    undefined,
                    h(
                      'div',
                      { class: 'truncate' },
                      genFilteredText(getText(item))
                    )
                  )
            },
          }
        )
      })
      if (props.items.length === 0) {
        children.push(genNoData())
      } else if (filteredItems.value.length === 0) {
        children.push(genNoResult())
      }
      slots['prepend-item'] && children.unshift(slots['prepend-item']())
      slots['append-item'] && children.push(slots['append-item']())
      return children
    }

    return {
      filteredItems,
      rootElement,
      classes,
      internalValue,
      isFocused,
      isActive,
      isMenuActive,
      selectedItem,
      search,
      focus,
      blur,
      genLabel,
      genControl,
      genInputMessages,
      genMenu,
      toggleMenu,
      openMenu,
      closeMenu,
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
