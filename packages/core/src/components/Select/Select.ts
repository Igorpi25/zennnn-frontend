import {
  h,
  ref,
  reactive,
  computed,
  nextTick,
  withDirectives,
  watch,
  onBeforeMount,
  defineComponent,
} from 'vue'

import { useI18n } from 'vue-i18n'

import {
  useFilterProps,
  useFilter,
  useClientRect,
  Mask,
  setCursor,
  getPropertyFromItem,
} from 'vue-supp'

import { ziChevronDown, ziSearch, ziCloseDelete, ziChecked } from '@zennnn/icons'

import { useInputProps, useInput } from '../../composables/useInput'
import { useInputControlProps, useInputControl } from '../../composables/useInputControl'
import { useInputValidationProps, useInputValidation } from '../../composables/useInputValidation'
import { useInputMessage } from '../../composables/useInputMessage'

import uid from '../../utils/uid'
import defaultFilter from '../../utils/defaultFilter'

import Icon from '../Icon'
import { Menu, MenuItem } from '../Menu'

import './Select.css'

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

interface MenuRef {
  id: string
  isActive: boolean
  isVisible: boolean
  activeItem: HTMLElement
  focusMenu: () => void
  setItemRef: (el: Element, i: number) => void
  goToNextItem: () => void
  goToPrevItem: () => void
  goToItem: (index: number) => void
  closeMenu: () => void
  selectItem: (value: any) => void
}

export default defineComponent({
  name: 'Select',

  props: {
    ...useInputProps(),
    ...useInputValidationProps(),
    ...useInputControlProps(),
    ...useFilterProps(),
    searchable: Boolean,
    modelValue: {
      type: [String, Number, Date, Object],
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
      // default: 304,
    },
    distance: {
      type: Number,
      default: 0,
    },
    openOnFocus: Boolean,
    returnObject: Boolean,
    // hasArrowIcon renamed to showArrow
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
    // need set 'flex-shrink-0' on phone input
    controlInputClass: {
      type: String,
      default: '',
    },
    hasItemsFilter: {
      type: Boolean,
      default: false,
    },
    itemsFilter: {
      type: Function,
      default: (item: any, queryText: string) => {
        return Object.values(item).some(text => defaultFilter(text, queryText))
      },
    },
    itemsFilterTabDown: Function,
    contentOnIntersect: Boolean,
    ariaLabel: String,
    ariaAutocomplete: String,
    // TODO: add composables and split to Autocomplete component
    selectable: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update:modelValue', 'update:search', 'update:error', 'click:clear', 'focus', 'blur', 'keydown', 'mousedown', 'mouseup'],

  setup (props, { slots, emit }) {
    const { t } = useI18n()

    const id: string = uid('select-')
    const listboxId: string = uid('listbox-')

    const rootElement = ref<HTMLElement>()
    const menuRef = ref<MenuRef>()

    const selectedItem = ref(null)
    const isMenuActive = ref<boolean>(false)

    const filter = ref<string>('')
    const filterInputElement = ref<HTMLElement>()
    const filterControlElement = ref<HTMLElement>()

    const {
      inputElement,
      internalValue,
      isFocused,
      badInput,
      hasPrependSlot,
      hasAppendSlot,
      focus,
      blur,
      genIcon,
      genPrependSlot,
      genAppendSlot,
      genLabel,
      genClearIcon,
    } = useInput(props, { slots, emit, id })

    const {
      search,
      searchIsDirty,
      getText,
      getValue,
    } = useFilter(props, { emit })

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
      onControlClick,
      onControlMouseDown,
      onControlMouseUp,
    } = useInputControl(props, { emit, inputElement, isFocused, isDisabled })

    const clientRectProps = reactive({
      element: controlElement,
      hasResizeListener: true,
    })
    const {
      clientRect,
      updateClientRect,
    } = useClientRect(clientRectProps)

    const {
      genInputMessages,
    } = useInputMessage(props, {
      controlElement,
      isFocused,
      isPatternMismatch,
      hasMessages,
      hasError,
      messagesToDisplay,
      showDetails,
      dimensions: clientRect,
    })

    const classes = computed(() => {
      return {
        select: true,
        'select--focused': isFocused.value,
        'select--disabled': isDisabled.value,
        'select--readonly': isReadonly.value,
        'select--is-menu-active': isMenuActive.value,
        'select--single-line': props.singleLine,
        'select--has-error': ((hasMessages.value && hasError.value) || isPatternMismatch.value) && showDetails.value,
      }
    })

    const openOnFocus = computed(() => props.openOnFocus || !props.searchable)

    const isActive = computed(() => {
      return isFocused.value || isMenuActive.value
    })

    const isSearching = computed(() => {
      return searchIsDirty.value &&
        search.value !== getText(selectedItem.value)
    })

    const items = computed(() => {
      return props.items.map((item: any, i: number) => {
        return {
          ...item,
          $id: `${listboxId}-option-${i + 1}`,
        }
      })
    })

    const filteredItems = computed(() => {
      if (props.noFilter) return items.value
      const hasSearch = isSearching.value && search.value != null
      const hasItemsFilter = props.hasItemsFilter && filter.value
      if (!hasSearch && !hasItemsFilter) return items.value
      const filtered = hasSearch
        ? items.value.filter(item => {
            const value = getPropertyFromItem(item, props.itemText)
            const text = value != null ? String(value) : ''
            const queryText = String(search.value)
            return props.filter(item, queryText, text)
          })
        : items.value
      return hasItemsFilter
        ? filtered.filter(item => props.itemsFilter(item, filter.value))
        : filtered
    })

    watch(filteredItems, (val, oldVal) => {
      if (val === oldVal) return
      menuRef.value?.goToItem(-1)
    })

    watch(isFocused, (val) => {
      val && openOnFocus.value && openMenu()
    })

    watch(isMenuActive, (val) => {
      val || updateSelf()
    })

    watch(() => props.modelValue, (val) => {
      setInternalValue(val)
    })

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

    const toggleMenu = () => {
      if (isDisabled.value) return
      if (isMenuActive.value) {
        closeMenu()
      } else {
        openMenu()
      }
    }

    const openMenu = () => {
      if (isDisabled.value || isReadonly.value) return
      isMenuActive.value = true
      // update dimensions, has problem on attached like modal
      updateClientRect()
    }

    const closeMenu = () => {
      isMenuActive.value = false
    }

    const select = (val: any) => {
      selectedItem.value = val
      const value = props.returnObject ? val : getValue(val)
      emit('update:modelValue', value)
      setSearch()
    }

    const setSelectedItem = (val: any) => {
      if (!val) {
        selectedItem.value = items.value.find(item => getValue(item) === internalValue.value)
      } else {
        selectedItem.value = val
      }
    }

    const setSearch = () => {
      // Wait for nextTick so selectedItem
      // has had time to update
      nextTick(() => {
        if (
          !search.value ||
          !isMenuActive.value
        ) {
          search.value = getText(selectedItem.value)
        }
      })
    }

    const updateSelf = () => {
      if (!searchIsDirty.value &&
        !internalValue.value
      ) return

      if (search.value !== internalValue.value) {
        setSearch()
      }
    }

    const genFilteredText = (text: string | null | undefined) => {
      text = text || ''

      if (!search.value) return text

      const { start, middle, end } = getMaskedCharacters(text)

      return h('span', [start, genHighlight(middle), end])
    }

    const genHighlight = (text: string) => {
      return h('span', {
        class: 'listbox__option__mask',
      }, text)
    }

    const getMaskedCharacters = (text: string) => {
      const searchInput = (search.value || '').toString().toLocaleLowerCase()
      const index = text.toLocaleLowerCase().indexOf(searchInput)

      if (index < 0) return { start: '', middle: text, end: '' }

      const start = text.slice(0, index)
      const middle = text.slice(index, index + searchInput.length)
      const end = text.slice(index + searchInput.length)
      return { start, middle, end }
    }

    const onFocus = (e: Event) => {
      if (document.activeElement !== inputElement.value) {
        inputElement.value?.focus()
      }
      updateClientRect()
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

      if (props.searchable) {
        let value = target.value || ''

        if (props.pattern) {
          isPatternMismatch.value = target.validity && target.validity.patternMismatch
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
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const menu = menuRef.value!
      if (e.key === 'Esc' || e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (!isMenuActive.value) {
          openMenu()
        } else if (menu.activeItem) {
          menu.activeItem.click()
        }
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        if (!props.searchable) {
          e.preventDefault()
          toggleMenu()
        }
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
          if (props.hasItemsFilter) {
            if (menu.activeItem && e.shiftKey) {
              menu.activeItem.click()
              updateSelf()
            } else if (e.shiftKey) {
              closeMenu()
            } else {
              e.preventDefault()
              e.stopPropagation()
              filterInputElement.value?.focus()
            }
          } else if (menu.activeItem) {
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
          select__input: true,
          'select__input--solo': props.solo,
          'cursor-pointer': !props.searchable && !isDisabled.value && !isReadonly.value,
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
        readonly: isReadonly.value || !props.searchable,
        disabled: isDisabled.value,
        onFocus: onFocus,
        onBlur: onBlur,
        onInput: onInput,
        onKeyDown: onKeyDown,
        onClick: () => {
          if (!props.searchable && !isDisabled.value && !isReadonly.value) {
            openMenu()
          }
        },
      }
      if (props.size) data.size = props.size
      if (props.pattern) data.pattern = props.pattern
      if (props.mask) {
        return withDirectives(
          h('input', data),
          [
            [Mask, props.mask],
          ],
        )
      }
      return h('input', data)
    }

    const genSelect = () => {
      return h('div', {
        class: {
          select__control__input: true,
          [props.controlInputClass.trim()]: true,
        },
      }, genSelectInput())
    }

    const genControl = () => {
      return h('div', {
        ref: controlElement,
        class: {
          select__control: true,
          'select__control--solo': props.solo,
          'select__control--dense': props.dense,
          'select__control--empty': props.solo && !internalValue.value,
          'select__control--not-prepend': !hasPrependSlot.value,
          'select__control--not-append': !hasAppendSlot.value && !hasState.value && !props.clearable && !props.showArrow,
          'select__control--is-active': isActive.value,
          'select__control--is-menu-active': isMenuActive.value,
          'select__control--open-on-focus': openOnFocus.value,
          'pl-8': props.selectable && !props.searchable && isMenuActive.value,
          [props.controlClass.trim()]: true,
        },
        onClick: onControlClick,
        onMousedown: onControlMouseDown,
        onMouseup: onControlMouseUp,
      }, [
        genPrependOuterSlot(),
        genPrependSlot(),
        genSelect(),
        genAppendSlot(),
        genStateIcon(),
        genClearIcon(),
        genArrow(),
        genAppendOuterSlot(),
      ])
    }

    const genPrependOuterSlot = () => {
      return slots['prepend-outer'] ? slots['prepend-outer']() : undefined
    }

    const genAppendOuterSlot = () => {
      return slots['append-outer'] ? slots['append-outer']() : undefined
    }

    const genFilterControl = () => {
      if (!props.hasItemsFilter) return undefined
      const isFilterDirty = filter.value.toString().length > 0
      return h('div', {
        ref: filterControlElement,
        class: {
          select__control: true,
          'select__control--solo': props.solo,
          'select__control--dense': props.dense,
          'sticky top-0 bg-white dark:bg-gray-900 rounded-b-none border-b border-blue-500 mb-2 px-2': true,
        },
      }, [
        h('div', {
          class: 'flex items-center flex-shrink-0',
          onClick: () => {
            if (document.activeElement === filterInputElement.value) return
            filterInputElement.value?.focus()
          },
          onMousedown: (e: MouseEvent) => {
            // Prevent input from being blurred
            if (e.target !== filterInputElement.value) {
              e.preventDefault()
              e.stopPropagation()
            }
          },
        }, genIcon(ziSearch, 'w-6 text-gray-200 dark:text-gray-300 mr-2')),
        h('div', {
          class: 'select__control__input',
        }, h('input', {
          ref: filterInputElement,
          value: filter.value,
          placeholder: t('placeholder.startTyping'),
          class: {
            select__input: true,
            'select__input--solo': props.solo,
            [props.inputClass.trim()]: true,
          },
          type: 'text',
          inputmode: 'text',
          onInput: (e: Event) => {
            const target = e.target as HTMLInputElement
            filter.value = target.value || ''
          },
          onKeyDown: (e: KeyboardEvent) => {
            const menu = menuRef.value!
            if (e.key === 'Esc' || e.key === 'Escape') {
              e.preventDefault()
              inputElement.value?.focus({ preventScroll: true })
            } else if (e.key === 'Enter') {
              e.preventDefault()
              if (menu.activeItem) {
                menu.activeItem.click()
                inputElement.value?.focus({ preventScroll: true })
              }
            } else if (e.key === 'ArrowUp' || e.key === 'Up') {
              e.preventDefault()
              menu.goToPrevItem()
            } else if (e.key === 'ArrowDown' || e.key === 'Down') {
              e.preventDefault()
              menu.goToNextItem()
            } else if (e.key === 'Tab') {
              if (e.shiftKey) {
                e.preventDefault()
                e.stopPropagation()
                inputElement.value?.focus({ preventScroll: true })
              } else if (!isFilterDirty) {
                e.preventDefault()
                e.stopPropagation()
                if (menu.activeItem) {
                  menu.activeItem.click()
                  updateSelf()
                } else if (props.itemsFilterTabDown) {
                  props.itemsFilterTabDown()
                } else {
                  inputElement.value?.focus({ preventScroll: true })
                }
              }
            }
          },
        })),
        h('button', {
          disabled: !isFilterDirty,
          class: {
            'w-6 h-6 flex items-center justify-center focus:outline-none': true,
            'text-gray-200 focus:text-gray-300 hover:text-gray-300 dark:focus:text-gray-100 dark:hover:text-gray-100': true,
            invisible: !isFilterDirty,
          },
          'aria-label': 'clear icon',
          onClick: (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            filterInputElement.value?.focus({ preventScroll: true })
            filter.value = ''
          },
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault()
              e.stopPropagation()
              inputElement.value?.focus({ preventScroll: true })
            }
          },
        }, genIcon(ziCloseDelete)),
      ])
    }

    const genMenu = () => {
      return h(Menu, {
        ref: menuRef,
        modelValue: isMenuActive.value,
        value: internalValue.value,
        activator: controlElement.value,
        attach: props.attach,
        transition: null,
        bottom: true,
        arrow: false,
        closeOnClick: true,
        closeOnContentClick: false,
        openOnClick: false,
        openOnHover: false,
        disableKeys: true,
        width: clientRect.value?.width,
        distance: props.distance,
        tabindex: '-1',
        id: listboxId,
        allowOverflow: true,
        height: props.height,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
        disabled: isDisabled.value || isReadonly.value,
        boxClass: classNames(
          'select-box shadow-none dark:shadow-none rounded-t-none',
          props.solo || props.dense ? 'select-box--dense' : '',
          isSearching.value && !slots.item ? 'listbox--searching' : '',
          props.boxClass.trim(),
        ),
        contentClass: classNames(
          'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-t-none',
          props.contentClass.trim(),
        ),
        includeElements: props.hasItemsFilter ? [controlElement.value, filterControlElement.value] : [controlElement.value],
        role: 'listbox',
        'onUpdate:modelValue': (val: boolean) => {
          isMenuActive.value = val
        },
        'onUpdate:value': (val: any) => {
          select(val)
        },
      }, {
        default: () => {
          return genMenuItems()
        },
      })
    }

    const genMenuItems = () => {
      const itemClassNames = classNames(
        'listbox__option',
        props.solo || props.dense ? 'h-8' : 'h-10',
        props.selectable ? 'pl-0' : '',
      )
      let index = 0
      const items: any[] = filteredItems.value.map((item) => {
        if (item.divider) {
          return genDivider(index)
        }
        const value = getValue(item)
        return h(MenuItem, {
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
            inputElement.value && inputElement.value.focus({ preventScroll: true })
            nextTick(closeMenu)
          },
        }, {
          default: (slotProps: any) => {
            return slots.item
              ? h('div', undefined, slots.item({ item, ...slotProps }))
              : h('div', undefined, [
                props.selectable
                  ? h('div', {
                      class: 'w-8 flex justify-center flex-shrink-0',
                    }, getValue(selectedItem.value) === getValue(item)
                      ? h(Icon, { size: 24 }, { default: () => ziChecked })
                      : undefined)
                  : undefined,
                h('div', { class: 'truncate' }, genFilteredText(getText(item))),
              ])
          },
        })
      })
      if (props.items.length === 0) {
        items.push(genNoData())
      } else if (filteredItems.value.length === 0) {
        items.push(genNoResult())
      }
      slots['prepend-item'] && items.unshift(slots['prepend-item']())
      slots['append-item'] && items.push(slots['append-item']())
      props.hasItemsFilter && items.unshift(genFilterControl())
      return items
    }

    const genArrow = () => {
      if (!props.showArrow) return undefined
      return h('button', {
        tabindex: '-1',
        disabled: isDisabled.value,
        class: [
          'w-6 h-6 flex items-center justify-center focus:outline-none',
          'origin-center transform transition-transform duration-200 ease-in-out',
          isDisabled.value ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-400 focus:text-blue-400',
          { 'rotate-180': isMenuActive.value },
        ],
        onClick: (e: MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isMenuActive.value) inputElement.value?.focus()
          toggleMenu()
        },
        onMousedown: (e: MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
        },
        onMouseup: (e: MouseEvent) => {
          e.stopPropagation()
        },
      }, genIcon(ziChevronDown))
    }

    const genDivider = (index: number) => {
      return h('div', { key: `divider-${index}`, class: 'border-b border-blue-500' })
    }

    const genNoData = () => {
      return slots['no-data']
        ? slots['no-data']()
        : h('div', {
          class: classNames(
            'flex items-center px-4',
            props.solo || props.dense ? 'h-8' : 'h-10',
          ),
          onMousedown: (e: MouseEvent) => { e.preventDefault() },
        }, h('div', {
          class: 'truncate',
        }, props.noDataText || t('select.noData')))
    }

    const genNoResult = () => {
      return slots['no-result']
        ? slots['no-result']()
        : h('div', {
          class: classNames(
            'flex items-center px-4',
            props.solo || props.dense ? 'h-8' : 'h-10',
          ),
          onMousedown: (e: MouseEvent) => { e.preventDefault() },
        }, h('div', {
          class: 'truncate',
        }, props.noResultText || t('select.noResult')))
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

  render () {
    return h('div', {
      ref: 'rootElement',
      class: this.classes,
    }, [
      this.genLabel(),
      this.genInputMessages(),
      this.genControl(),
      this.genMenu(),
    ])
  },
})
