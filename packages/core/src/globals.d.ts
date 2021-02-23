declare global {
  interface WheelEvent {
    path?: EventTarget[]
  }

  function parseInt(s: string | number, radix?: number): number
  function parseFloat(string: string | number): number
}

export {}
