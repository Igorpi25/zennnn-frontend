import { watch, onBeforeUnmount, nextTick } from 'vue'

import type { Ref } from 'vue'

function hasScrollbar(el?: HTMLElement) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return false

  const style = window.getComputedStyle(el)
  return (
    ['auto', 'scroll'].includes(style.overflowY!) &&
    el.scrollHeight > el.clientHeight
  )
}

export function useLockscreen(isActive: Ref<boolean>) {
  let scrollbarWidth = 0
  let rootHasScrollbar = false
  let bodyPaddingRight = '0'
  let computedBodyPaddingRight = 0

  function hideScroll() {
    rootHasScrollbar = hasScrollbar(document.documentElement)
    if (rootHasScrollbar) {
      bodyPaddingRight = document.documentElement.style.paddingRight
      computedBodyPaddingRight = parseInt(
        document.documentElement.style.paddingRight,
        10
      )
    }
    scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth
    if (scrollbarWidth > 0 && rootHasScrollbar) {
      document.documentElement.style.paddingRight =
        computedBodyPaddingRight + scrollbarWidth + 'px'
    }
    document.documentElement.classList.add('overflow-hidden')
  }

  function showScroll() {
    document.documentElement.classList.remove('overflow-hidden')
    if (scrollbarWidth > 0 && rootHasScrollbar) {
      document.documentElement.style.paddingRight = bodyPaddingRight
    }
  }

  onBeforeUnmount(() => {
    showScroll()
  })

  watch(isActive, (val) => {
    nextTick(() => {
      val ? hideScroll() : showScroll()
    })
  })

  return {
    hideScroll,
    showScroll,
  }
}
