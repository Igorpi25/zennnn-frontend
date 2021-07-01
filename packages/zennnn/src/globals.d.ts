import { VNode } from 'vue'

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }

  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {} // eslint-disable-line
  //   interface IntrinsicElements {
  //     [elem: string]: any
  //   }
  // }
}
