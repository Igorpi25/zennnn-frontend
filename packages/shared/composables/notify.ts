import {
  ref,
  defineComponent,
  createVNode,
  render,
  TransitionGroup,
  inject,
} from 'vue'

import { Alert } from '@zennnn/core'

import type { InjectionKey } from 'vue'

export type NotifyColors = 'primary' | 'error' | 'warn' | 'success' | 'info'

export interface Notify {
  id: number
  // color or type
  color?: string
  type?: string
  // text or message
  text?: string
  message?: string
  close?: boolean
  timeout?: number
  iconClass?: string
  icon?: string
}

export type NotifyOptions = Omit<Notify, 'id'>

type NotifyInstanceFn = (payload: string | NotifyOptions) => void

interface NotifyInstanceAdv {
  clear: () => void
  error: (text: string, options?: NotifyOptions) => void
  warn: (text: string, options?: NotifyOptions) => void
  success: (text: string, options?: NotifyOptions) => void
  info: (text: string, options?: NotifyOptions) => void
}

export type NotifyInstance = NotifyInstanceFn & NotifyInstanceAdv

interface NotifyInstanceOptions {
  timeout?: number
  zIndex?: number
}

export const NotifySymbol: InjectionKey<NotifyInstance> =
  Symbol.for('app:notify')

let id = 0
const DEFAULT_Z_INDEX = 999
const DEFAULT_TIMEOUT = 6000

export const createNotify = (options: NotifyInstanceOptions = {}) => {
  const _items = ref<Notify[]>([])

  const _timeout = options.timeout || DEFAULT_TIMEOUT
  const _zIndex = options.zIndex || DEFAULT_Z_INDEX

  const showError = (text: string, options?: NotifyOptions) =>
    showNotify('error', text, options)
  const showWarn = (text: string, options?: NotifyOptions) =>
    showNotify('warn', text, options)
  const showSuccess = (text: string, options?: NotifyOptions) =>
    showNotify('success', text, options)
  const showInfo = (text: string, options?: NotifyOptions) =>
    showNotify('info', text, options)

  const showNotify = (
    type = 'primary',
    text = '',
    options = {} as NotifyOptions
  ) => {
    notify({ color: type, text, ...options })
  }

  const notify = (payload: string | NotifyOptions) => {
    // Default values
    let item = { id: ++id, color: 'primary', text: '', close: true } as Notify
    if (typeof payload === 'string' || payload instanceof String) {
      item.text = payload as string
    } else {
      item = Object.assign(item, payload)
    }

    addItem(item)
  }

  const addItem = (item: Notify) => {
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

  const removeItem = (id: number) => {
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

  const genItem = (item: Notify) => {
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
      'onUpdate:modelValue': (val: boolean) => {
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
        enterFromClass: '-translate-y-4 opacity-0',
        moveClass: 'duration-500',
        leaveActiveClass: 'transition duration-200 ease-out',
        leaveToClass: '-translate-y-4 opacity-0',
      },
      {
        default: () => genItems(),
      }
    )

    render(containerVNode, document.createElement('div'))

    document.body.appendChild(containerVNode.el as HTMLElement)
  }

  const instance = notify

  Object.assign(instance, {
    clear: clearItems,
    error: showError,
    warn: showWarn,
    success: showSuccess,
    info: showInfo,
  })

  renderContainer()

  return instance
}

export function useNotify() {
  const notify = inject(NotifySymbol)

  if (!notify) throw new Error('Could not find notify injection')

  return notify
}
