import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { wait } from 'vue-supp'

import Menu from '../Menu'
import MenuItem from '../MenuItem'

jest.mock('../../../../utils/uid')

describe('Menu.js', () => {
  let mountFunction

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'

    mountFunction = (options = {}) => {
      return mount(Menu, {
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
      props: {
        openOnHover: true,
      },
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

  it('should open on focus', async () => {
    const wrapper = mountFunction({
      props: {
        openOnFocus: true,
      },
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('focus')
    expect(wrapper.vm.isActive).toBe(true)
  })

  it('should open/close on click', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('click')
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('click')
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should open on space/enter and arrow up/down keydown', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => h('span', 'Content'),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('keydown', { key: ' ' })
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.isActive).toBe(false)
    await activator.trigger('keydown', { key: 'Enter' })
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.isActive).toBe(false)
    await activator.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.isActive).toBe(false)
    await activator.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.vm.isActive).toBe(true)
    await activator.trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.isActive).toBe(false)
  })

  it('should render with MenuItem and match snapshot', async () => {
    const items = Array.from(Array(3).keys()).map(key => {
      const i = key + 1
      return {
        name: `item${i}`,
        value: `item${i}`,
        text: `Item ${i}`,
        disabled: i === 1,
      }
    })
    const wrapper = mountFunction({
      props: {
        attach: false,
      },
      slots: {
        default: () => items.map((item, i) => h(MenuItem, {
          index: i,
          key: item.value,
          value: item.value,
          disabled: item.disabled,
        }, {
          default: () => item.text,
        })),
        activator: () => h('button', 'Activator'),
      },
    })

    const activator = wrapper.get('button')
    await activator.trigger('click')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
