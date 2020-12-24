import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

import Tooltip from '../Tooltip'

import { wait } from '../../../../utils/wait'

jest.mock('../../../../utils/uid')

describe('Tooltip.js', () => {
  let mountFunction

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'

    mountFunction = (options = {}) => {
      return mount(Tooltip, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => Array.from(Array(3).keys()).map(() => 'Content').join(' '),
        activator: () => h('button', 'Activator'),
      },
    })

    await wrapper.setProps({ modelValue: true })
    await wait(50)

    expect(wrapper.html()).toMatchSnapshot()
    expect(document.body.innerHTML).toMatchSnapshot()
  })

  it('should not attach content and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        attach: false,
      },
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with min/max width and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        attach: false,
        minWidth: 100,
        maxWidth: 200,
      },
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with zIndex prop and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        attach: false,
        zIndex: 10,
      },
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should open on mousenter and close on mouseleave', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('mouseenter')
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('mouseleave')
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should open on focus and close on blur', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('focus')
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('blur')
    expect(wrapper.vm.isActive).toBe(false)
  })
})
