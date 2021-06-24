import { VNode } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {} // eslint-disable-line
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
