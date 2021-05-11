import { ref, onMounted, onUnmounted, onUpdated } from 'vue'

export function useTocActiveLink () {
  const activeHash = ref<string | null>(null)

  const onScroll = throttleAndDebounce(setActiveLink, 300)

  function setActiveLink (): void {
    const links = getLinks()
    const anchors = getAnchors(links)
    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i]
      const nextAnchor = anchors[i + 1]
      const [isActive, hash] = isAnchorActive(i, anchor, nextAnchor)
      if (isActive) {
        history.replaceState(null, document.title, hash ? hash : ' ')
        activateLink(hash)
        return
      }
    }
  }

  function activateLink (hash: string | null): void {
    activeHash.value = hash
  }

  onMounted(() => {
    setActiveLink()
    window.addEventListener('scroll', onScroll)
  })

  onUpdated(() => {
    // update means a route change
    activateLink(decodeURIComponent(location.hash))
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return {
    activeHash,
  }
}

function getLinks (): HTMLAnchorElement[] {
  return [].slice.call(document.querySelectorAll('.toc a'))
}

function getAnchors (links: HTMLAnchorElement[]): HTMLAnchorElement[] {
  return [].slice
    .call(document.querySelectorAll('.header-anchor'))
    .filter((anchor: HTMLAnchorElement) =>
      links.some((link) => link.hash === anchor.hash)
    ) as HTMLAnchorElement[]
}

function getPageOffset (): number {
  return (document.querySelector('.nav-bar') as HTMLElement).offsetHeight
}

function getAnchorTop (anchor: HTMLAnchorElement): number {
  const pageOffset = getPageOffset()
  return anchor.parentElement!.offsetTop - pageOffset - 15
}

function isAnchorActive (
  index: number,
  anchor: HTMLAnchorElement,
  nextAnchor: HTMLAnchorElement,
): [boolean, string | null] {
  const scrollTop = window.scrollY
  if (index === 0 && scrollTop === 0) {
    return [true, null]
  }
  if (scrollTop < getAnchorTop(anchor)) {
    return [false, null]
  }
  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, decodeURIComponent(anchor.hash)]
  }
  return [false, null]
}

function throttleAndDebounce (fn: () => void, delay: number): () => void {
  let timeout: any
  let called = false

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (!called) {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    } else {
      timeout = setTimeout(fn, delay)
    }
  }
}
