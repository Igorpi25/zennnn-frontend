import { ref, computed, watch } from 'vue'

import type { Ref } from 'vue'

type StackContextInstance = Record<string, Ref<string[]>>

const stackContextInstance = {} as StackContextInstance

export function useStackContext(
  props: { zIndex?: number | string },
  isActive: Ref<boolean>,
  id: string,
  stack = 'popups',
  stackMinZIndex = 10
) {
  if (!stackContextInstance[stack]) {
    stackContextInstance[stack] = ref([])
  }

  const activeIds = stackContextInstance[stack]

  const internalZIndex = ref(stackMinZIndex)

  const activeZIndex = computed(() => {
    if (props.zIndex) {
      const zi = parseInt(props.zIndex, 10) || 0
      return Math.max(zi, internalZIndex.value)
    }

    return internalZIndex.value
  })

  const topZIndex = computed(() => stackMinZIndex + activeIds.value.length)

  const isTopZIndex = computed(() => activeZIndex.value + 1 >= topZIndex.value)

  function addActiveId($id: string) {
    if (!activeIds.value.includes($id)) {
      activeIds.value.push($id)
    }
  }

  function removeActiveId($id: string) {
    activeIds.value = activeIds.value.filter((item) => item !== $id)
  }

  watch(isActive, (val) => {
    if (val) {
      internalZIndex.value = stackMinZIndex + activeIds.value.length
      addActiveId(id)
    } else {
      removeActiveId(id)
    }
  })

  return {
    activeZIndex,
    topZIndex,
    isTopZIndex,
    addActiveId,
    removeActiveId,
  }
}
