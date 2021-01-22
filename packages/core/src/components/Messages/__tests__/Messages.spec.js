import { mount } from '@vue/test-utils'
import { h } from 'vue'
import Messages from '../Messages'

describe('Messages.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Messages, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        value: ['foo', 'bar'],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ value: [] })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have messages--error class on error prop and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        error: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with default slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        value: ['foo', 'bar'],
      },
      slots: {
        default: ({ message, key }) => {
          return h('span', { class: 'custom-class' }, `${key} - ${message}`)
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})