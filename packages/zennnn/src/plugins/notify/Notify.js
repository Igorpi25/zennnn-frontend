import { ref, defineComponent, createVNode, render, TransitionGroup } from 'vue'

import { Alert } from '@zennnn/core'

let id = 0
const DEFAULT_Z_INDEX = 999
const DEFAULT_TIMEOUT = 6000

export const createNotify = (options = {}) => {
  const _items = ref([])

  const _timeout = options.timeout || DEFAULT_TIMEOUT
  const _zIndex = options.zIndex || DEFAULT_Z_INDEX

  const showError = (text, options) => showNotify('error', text, options)
  const showWarn = (text, options) => showNotify('warn', text, options)
  const showSuccess = (text, options) => showNotify('success', text, options)
  const showInfo = (text, options) => showNotify('info', text, options)

  const showNotify = (type = 'primary', text = '', options = {}) => {
    notify({ id: ++id, color: type, text, ...options })
  }

  const notify = (payload) => {
    // Default values
    let item = { id: ++id, color: 'primary', text: '', close: true }
    const isString = typeof payload === 'string' || payload instanceof String
    if (isString) {
      item.text = payload
    } else {
      item = Object.assign(item, payload)
    }

    addItem(item)
  }

  const addItem = (item) => {
    _items.value.push(item)

    const timeout =
      typeof item.timeout === 'number' && isFinite(item.timeout)
        ? item.timeout
        : _timeout
    if (timeout) {
      setTimeout(() => {
        removeItem(item.id)
      }, timeout)
    }
  }

  const removeItem = (id) => {
    const index = _items.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      _items.value.splice(index, 1)
    }
  }

  const clearItems = () => {
    _items.value = []
  }

  const genItems = () => {
    return _items.value.map((item) => {
      return genItem(item)
    })
  }

  const genItem = (item) => {
    return createVNode(defineComponent(Alert), {
      key: item.id,
      modelValue: true,
      class: 'pointer-events-auto shadow-md mb-3',
      minWidth: 220,
      color: item.type || item.color,
      text: item.message || item.text,
      icon: item.icon,
      iconClass: item.iconClass,
      close: item.close,
      'onUpdate:modelValue': (val) => {
        if (!val) removeItem(item.id)
      },
    })
  }

  const renderContainer = () => {
    const containerVNode = createVNode(
      TransitionGroup,
      {
        tag: 'div',
        class:
          'fixed top-0 inset-x-0 flex flex-col-reverse items-center pointer-events-none pt-8 px-3',
        style: {
          zIndex: _zIndex,
        },
        enterActiveClass: 'transition duration-200 ease-out',
        enterFromClass: 'transform -translate-y-4 opacity-0',
        moveClass: 'transform duration-500',
        leaveActiveClass: 'transition duration-200 ease-out',
        leaveToClass: 'transform -translate-y-4 opacity-0',
      },
      {
        default: () => genItems(),
      }
    )

    render(containerVNode, document.createElement('div'))

    document.body.appendChild(containerVNode.el)
  }

  const instance = {
    show: notify,
    clear: clearItems,
    error: (text, options) => showNotify('error', text, options),
    warn: (text, options) => showNotify('warn', text, options),
    success: (text, options) => showNotify('success', text, options),
    info: (text, options) => showNotify('info', text, options),
  }

  return {
    instance,
    install(app) {
      renderContainer()

      app.config.globalProperties.$notify = notify
      app.config.globalProperties.$notify.error = showError
      app.config.globalProperties.$notify.warn = showWarn
      app.config.globalProperties.$notify.success = showSuccess
      app.config.globalProperties.$notify.info = showInfo
      app.config.globalProperties.$notify.clear = clearItems
    },
  }
}
