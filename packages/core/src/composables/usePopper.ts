import { h, ref, shallowRef, computed, onUnmounted } from 'vue'
import { createPopper } from '@popperjs/core'

import type { ComponentPublicInstance, PropType } from 'vue'
import type { VirtualElement, Instance, Options } from '@popperjs/core'

type Placement = Options['placement']
type Modifiers = Options['modifiers']

interface PopperProps {
  placement?: Placement
  left?: boolean
  top?: boolean
  right?: boolean
  bottom?: boolean
  fixed?: boolean
  allowOverflow: boolean
  arrow: boolean
  skidding: string | number
  distance: string | number
  zIndex?: number | string
  // usefull to set origin class
  boxClass?: string
  width?: string | number
}

export const usePopperProps = () => {
  return {
    placement: {
      type: String as PropType<Placement | undefined>,
      validator: (value: string) => {
        return [
          'auto',
          'auto-start',
          'auto-end',
          'top',
          'top-start',
          'top-end',
          'bottom',
          'bottom-start',
          'bottom-end',
          'right',
          'right-start',
          'right-end',
          'left',
          'left-start',
          'left-end',
        ].includes(value)
      },
    },
    left: Boolean,
    top: Boolean,
    right: Boolean,
    bottom: Boolean,
    fixed: Boolean,
    // disabled: Boolean,
    allowOverflow: {
      type: Boolean,
      default: false,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    skidding: {
      type: [String, Number],
      default: 0,
    },
    distance: {
      type: [String, Number],
      default: 0,
    },
    zIndex: [Number, String],
    boxClass: {
      type: String,
      default: '',
    },
  }
}

export const usePopper = (
  props: PopperProps,
  customModifiers: Modifiers = [],
  isVirtual = false
) => {
  const instance = shallowRef<Instance>()
  const reference = ref<Element | VirtualElement | ComponentPublicInstance>()
  const popper = ref<HTMLElement | ComponentPublicInstance>()

  const placement = computed(() => {
    return props.placement
      ? props.placement
      : props.left
      ? 'left'
      : props.right
      ? 'right'
      : props.bottom
      ? 'bottom'
      : 'top'
  })

  const strategy = computed(() => (props.fixed ? 'fixed' : 'absolute'))

  const offset = computed(() => {
    const skidding = parseInt(props.skidding) || 0
    let distance = parseInt(props.distance) || 0
    if (props.arrow && !distance) {
      distance = 8
    }
    return [skidding, distance]
  })

  const modifiers = computed(() => {
    const defaultModifiers: Modifiers = [
      {
        name: 'preventOverflow',
        options: {
          altAxis: !props.allowOverflow,
          rootBoundary: 'document',
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5,
          },
        },
      },
      {
        name: 'offset',
        options: {
          offset: offset.value,
        },
      },
      {
        name: 'flip',
        enabled: !props.allowOverflow,
        options: {
          padding: 5,
        },
      },
    ]

    if (props.arrow) {
      defaultModifiers.push(
        {
          name: 'arrow',
          options: {
            padding: 8,
          },
        },
        applyArrowHide
      )
    }

    if (props.width === '100%') {
      defaultModifiers.push(sameWidth)
    }

    const excludeModifiers = customModifiers.map((mod) => mod.name)

    return [
      ...defaultModifiers.filter(
        (mode) => !excludeModifiers.includes(mode.name)
      ),
      customModifiers,
    ] as Modifiers
  })

  function create() {
    destroy()

    if (!popper.value) return
    if (!reference.value) return

    const popperEl =
      (popper.value as ComponentPublicInstance)?.$el || popper.value
    const referenceEl =
      (reference.value as ComponentPublicInstance)?.$el || reference.value

    if (!(popperEl instanceof HTMLElement)) return
    if (!(!isVirtual && referenceEl instanceof Element)) return

    instance.value = createPopper(referenceEl, popperEl, {
      placement: placement.value,
      strategy: strategy.value,
      modifiers: modifiers.value,
    })
  }

  function destroy() {
    if (instance.value) {
      instance.value.destroy()
      instance.value = undefined
    }
  }

  onUnmounted(destroy)

  function isCursorOutside(e: MouseEvent): boolean {
    const target = e.target as Element
    const referenceEl = ((reference.value as ComponentPublicInstance)?.$el ||
      reference.value) as Element
    const popperEl = ((popper.value as ComponentPublicInstance)?.$el ||
      popper.value) as Element

    if (!referenceEl || !popperEl) return true

    // cursor over elements
    if (referenceEl.contains(target) || popperEl.contains(target)) return false

    const state = instance.value?.state

    if (!state) return true

    const interactiveBorder = 2
    const basePlacement = state.placement.split('-')[0]

    const popperRect = state.elements.popper.getBoundingClientRect()

    const offsetData = state.modifiersData?.offset

    if (!offsetData) return true

    const clientX = e.clientX || 0
    const clientY = e.clientY || 0

    const topDistance = basePlacement === 'bottom' ? offsetData.top!.y : 0
    const bottomDistance = basePlacement === 'top' ? offsetData.bottom!.y : 0
    const leftDistance = basePlacement === 'right' ? offsetData.left!.x : 0
    const rightDistance = basePlacement === 'left' ? offsetData.right!.x : 0

    const exceedsTop =
      popperRect.top - clientY + topDistance > interactiveBorder
    const exceedsBottom =
      clientY - popperRect.bottom - bottomDistance > interactiveBorder
    const exceedsLeft =
      popperRect.left - clientX + leftDistance > interactiveBorder
    const exceedsRight =
      clientX - popperRect.right - rightDistance > interactiveBorder

    return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight
  }

  function genArrow() {
    return props.arrow
      ? h('div', {
          class: 'popper__arrow',
          'data-popper-arrow': '',
        })
      : undefined
  }

  return {
    instance,
    reference,
    popper,
    create,
    destroy,
    genArrow,
    isCursorOutside,
  }
}

// Custom modifier for arrow hide
const applyArrowHide: Modifiers[0] = {
  name: 'applyArrowHide',
  enabled: true,
  phase: 'write',
  fn(data) {
    const state = data.state
    const { arrow, reference, popper } = state.elements

    const basePlacement = state.placement.split('-')[0]

    if (arrow) {
      let isCenterY = true
      if (basePlacement === 'left' || basePlacement === 'right') {
        const interactiveBorder = 2
        const offsetData = state.modifiersData.offset
        const popperRect = popper.getBoundingClientRect()
        const referenceRect = reference.getBoundingClientRect()
        const leftDistance =
          basePlacement === 'right' ? offsetData?.left?.x || 0 : 0
        const rightDistance =
          basePlacement === 'left' ? offsetData?.right?.x || 0 : 0
        const exceedsLeft = popperRect.left + leftDistance - interactiveBorder
        const exceedsRight =
          popperRect.right + rightDistance + interactiveBorder
        const arrowXPosition =
          basePlacement === 'left'
            ? referenceRect.left
            : basePlacement === 'right'
            ? referenceRect.right
            : 0
        const popperXPosition =
          basePlacement === 'left'
            ? exceedsRight
            : basePlacement === 'right'
            ? exceedsLeft
            : 0
        isCenterY =
          popperXPosition - 8 < arrowXPosition &&
          popperXPosition + 8 > arrowXPosition
      }
      if (state.modifiersData.arrow?.centerOffset !== 0 || !isCenterY) {
        arrow.setAttribute('data-hide', '')
      } else {
        arrow.removeAttribute('data-hide')
      }
    }
  },
}

// Custom modifier for same width
// https://github.com/popperjs/popper-core/issues/794#issuecomment-644034386
const sameWidth: Modifiers[0] = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  fn({ state }) {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect({ state }) {
    state.elements.popper.style.minWidth = `${
      (state.elements.reference as HTMLElement).offsetWidth
    }px`
  },
}
