import { h, TransitionGroup, FunctionalComponent } from 'vue'

import './Messages.css'

const Messages: FunctionalComponent<{
  value: any[],
  error: boolean,
}> = (props, { slots }) => {
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

  const genMessage = (message: string, key: number) => {
    return h('div', {
      class: 'messages__message',
      key,
    }, slots.default?.({ message, key }) ?? message)
  }

  return h('div', {
    class: {
      messages: true,
      'messages--error': props.error,
    },
  }, genChildren())
}

export default Messages
