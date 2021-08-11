import { h, ref, computed } from 'vue'
import { ziChevronDown } from '@zennnn/icons'
import { useI18n } from 'vue-i18n'
import Icon from '../components/Icon'

import type { Ref, ComputedRef, Slots } from 'vue'

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

export interface SelectProps {
  modelValue: any
  items: any[]
  returnObject: boolean
  noResultText?: string
  noDataText?: string
  solo?: boolean
  dense?: boolean
  showArrow?: boolean
}

export interface SelectContext {
  internalValue: Ref<string | number | boolean | any[] | null | undefined>
  inputElement: Ref<HTMLElement | undefined>
  isDisabled: ComputedRef<boolean> | Ref<boolean>
  isReadonly: ComputedRef<boolean> | Ref<boolean>
  listboxId?: string
  slots: Slots
}

// Props
export const useSelectProps = () => {
  return {
    modelValue: {
      type: [String, Number, Date, Object],
      default: null,
    },
    returnObject: Boolean,
  }
}

export const useSelect = (
  props: SelectProps,
  {
    // internalValue,
    inputElement,
    isDisabled,
    isReadonly,
    listboxId,
    slots,
  }: // updateClientRect, // TODO: add watcher
  SelectContext
) => {
  const { t } = useI18n()

  const menuRef = ref<MenuRef>()
  const selectedItem = ref(null)
  const isMenuActive = ref<boolean>(false)

  const items = computed(() => {
    return props.items.map((item: any, i: number) => {
      const v =
        typeof item === 'string' || typeof item === 'number'
          ? { text: item, value: item }
          : item
      return {
        ...v,
        $id: `${listboxId}-option-${i + 1}`,
      }
    })
  })

  function toggleMenu() {
    if (isDisabled.value) return
    if (isMenuActive.value) {
      closeMenu()
    } else {
      openMenu()
    }
  }

  function openMenu() {
    if (isDisabled.value || isReadonly.value) return
    isMenuActive.value = true
    // update dimensions, has problem on attached like modal
    // updateClientRect()
  }

  function closeMenu() {
    isMenuActive.value = false
  }

  function genPrependOuterSlot() {
    return slots.prependOuter?.()
  }

  function genAppendOuterSlot() {
    return slots.appendOuter?.()
  }

  function genArrow() {
    if (!props.showArrow) return undefined
    return h(
      Icon,
      {
        tag: 'button',
        size: 24,
        tabindex: '-1',
        type: 'button',
        disabled: isDisabled.value,
        class: [
          'focus:outline-none origin-center transition-transform duration-200 ease-in-out',
          isDisabled.value
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-500 hover:text-blue-400 focus:text-blue-400',
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
      },
      {
        default: () => ziChevronDown,
      }
    )
  }

  function genDivider(index: number) {
    return h('div', {
      key: `divider-${index}`,
      class: 'border-b border-blue-500',
    })
  }

  function genNoData() {
    return slots.noData
      ? slots.noData()
      : h(
          'div',
          {
            class: [
              'flex items-center px-4',
              props.solo || props.dense ? 'h-8' : 'h-10',
            ],
            onMousedown: (e: MouseEvent) => {
              e.preventDefault()
            },
          },
          h(
            'div',
            {
              class: 'truncate',
            },
            props.noDataText || t('select.noData')
          )
        )
  }

  function genNoResult() {
    return slots.noResult
      ? slots.noResult()
      : h(
          'div',
          {
            class: [
              'flex items-center px-4',
              props.solo || props.dense ? 'h-8' : 'h-10',
            ],
            onMousedown: (e: MouseEvent) => {
              e.preventDefault()
            },
          },
          h(
            'div',
            {
              class: 'truncate',
            },
            props.noResultText || t('select.noResult')
          )
        )
  }

  return {
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
  }
}
