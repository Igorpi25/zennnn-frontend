import { h, TransitionGroup } from 'vue'

import './Messages.css'

/**
 * Props
 * @param {Array} props.value The messages to render.
 * @param {boolean} props.error The error color preset.
 */
export default (props, { slots }) => {
  const messages = props.value || []

  const genChildren = () => {
    return h(TransitionGroup, {
      name: 'message-transition',
      tag: 'div',
      class: 'messages__wrapper',
    }, {
      default: () => messages.map(genMessage),
    })
  }

  const genMessage = (message, key) => {
    return h('div', {
      class: 'messages__message',
      key,
    }, slots.default ? slots.default({ message, key }) : message)
  }

  return h('div', {
    class: {
      messages: true,
      'messages--error': props.error || props.error === '',
    },
  }, genChildren())
}
