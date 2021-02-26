import { ref, computed, watch, onMounted, onUnmounted, Ref } from 'vue'

export function useExampleTheme (elRef: Ref<HTMLElement>, file: string) {
  let observer
  const dark = ref<boolean>(false)
  const attachRefs = ref<HTMLElement[]>([])
  const isAttachable = computed(() => {
    return /Tooltip|Menu|Modal|DatePicker|Select/.test(file)
  })

  watch(dark, () => {
    if (isAttachable.value) {
      toggleDark()
    }
  })
  onMounted(() => {
    if (!isAttachable.value) return
    const targetNode = document.getElementById('app')
    const callback = function (mutationsList) {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'childList' &&
          mutation.addedNodes.length === 1 &&
          mutation.addedNodes[0].nodeType === 1 &&
          elRef.value
        ) {
          const activatorEls = elRef.value.querySelectorAll('[aria-haspopup="true"]')
          const ids: string[] = []
          for (const el of activatorEls) {
            const id = (el as HTMLElement).getAttribute('aria-controls')
            id && ids.push(id)
          }
          if (ids.length > 0) {
            ids.forEach((id: string) => {
              const el = (document.getElementById(id).parentNode) as HTMLElement
              if (el) {
                attachRefs.value.push(el)
              }
            })
            toggleDark()
          }
        }
      }
    }
    observer = new MutationObserver(callback)
    observer.observe(targetNode, { childList: true })
  })
  onUnmounted(() => {
    observer && observer.disconnect()
  })
  
  function toggleDark (): void {
    for (const el of attachRefs.value) {
      if (dark.value) {
        el.classList.add('dark', 'text-gray-100')
      } else {
        el.classList.remove('dark', 'text-gray-100')
      }
    }
  }

  return {
    dark,
  }
}
