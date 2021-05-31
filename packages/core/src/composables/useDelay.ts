import { PropType } from 'vue'

const IN_BROWSER = typeof window !== 'undefined'

export interface DelayProps {
  closeDelay?: number | string
  openDelay?: number | string
}

export const useDelayProps = () => {
  return {
    closeDelay: [Number, String] as PropType<number | string>,
    openDelay: [Number, String] as PropType<number | string>,
  }
}

export function useDelay(props: DelayProps, cb?: (value: boolean) => void) {
  const delays: Partial<Record<keyof DelayProps, number>> = {}
  const runDelayFactory = (prop: keyof DelayProps) => (): Promise<boolean> => {
    // istanbul ignore next
    if (!IN_BROWSER) return Promise.resolve(true)

    const active = prop === 'openDelay'

    delays.closeDelay && window.clearTimeout(delays.closeDelay)
    delete delays.closeDelay

    delays.openDelay && window.clearTimeout(delays.openDelay)
    delete delays.openDelay

    return new Promise((resolve) => {
      const delay = parseInt(props[prop] ?? 0, 10)

      delays[prop] = window.setTimeout(() => {
        cb?.(active)
        resolve(active)
      }, delay)
    })
  }

  return {
    runCloseDelay: runDelayFactory('closeDelay'),
    runOpenDelay: runDelayFactory('openDelay'),
  }
}
