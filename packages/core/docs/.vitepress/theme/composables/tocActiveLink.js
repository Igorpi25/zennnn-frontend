import { ref, onMounted, onUnmounted, onUpdated } from 'vue'

export function useTocActiveLink () {
  const activeHash = ref(null)

  const onScroll = throttleAndDebounce(setActiveLink, 300)

  function setActiveLink () {
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

  function activateLink (hash) {
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

function getLinks () {
  return [].slice.call(document.querySelectorAll('.toc a'))
}

function getAnchors (links) {
  return [].slice
    .call(document.querySelectorAll('.header-anchor'))
    .filter((anchor) => links.some((link) => link.hash === anchor.hash))
}

function getPageOffset () {
  return document.querySelector('.nav-bar').offsetHeight
}

function getAnchorTop (anchor) {
  const pageOffset = getPageOffset()
  return anchor.parentElement.offsetTop - pageOffset - 15
}

function isAnchorActive (index, anchor, nextAnchor) {
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

function throttleAndDebounce (fn, delay) {
  let timeout
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
