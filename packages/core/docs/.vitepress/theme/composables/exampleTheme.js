import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export function useExampleTheme (elRef, file) {
  let observer
  const dark = ref(false)
  const attachRefs = ref([])
  const isAttachable = computed(() => {
    return /Tooltip|Menu|Modal|DatePicker/.test(file)
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
          const ids = []
          for (const el of activatorEls) {
            const id = el.getAttribute('aria-controls')
            id && ids.push(id)
          }
          if (ids.length > 0) {
            ids.forEach(id => {
              const el = document.getElementById(id).parentNode
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
  
  function toggleDark () {
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
