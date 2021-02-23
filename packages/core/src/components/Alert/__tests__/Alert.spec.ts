import { h } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { ziCheckFill } from '@zennnn/icons'

import Alert from '../Alert'
import Icon from '../../Icon'

describe('Alert.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Alert, {
        ...options,
      })
    }
  })

  // Render

  it('should render component with default slot and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with text prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "error" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        color: 'error',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "warn" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        color: 'warn',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "success" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        color: 'success',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "info" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        color: 'info',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "primary" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        color: 'primary',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with close prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        close: true,
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom class props and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        close: true,
        closeClass: 'custom-close-class',
        iconClass: 'custom-info-icon-close',
        contentClass: 'content-custom-class',
        class: 'custom-class',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with icon slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        close: true,
        text: 'Alert',
      },
      slots: {
        icon: () => h(Icon, {
          class: 'text-blue-500 pr-4',
        }, { default: () => ziCheckFill }),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component without icon and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        icon: false,
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with close slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        text: 'Alert',
      },
      slots: {
        close: () => h('button', { class: 'custom-close' }, 'Close'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit false modelValue on close icon click', async () => {
    const wrapper = mountFunction({
      props: {
        close: true,
        text: 'Alert',
      },
    })

    await wrapper.find('.alert__close').trigger('click')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([false])
  })

  it('should toggle model value', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: false,
      },
      slots: {
        default: 'Alert',
      },
    })

    expect(wrapper.html()).toBe('<!---->')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.classes('alert')).toBe(true)
  })

  it('should set min-width with minWidth prop', () => {
    const wrapper = mountFunction({
      props: {
        minWidth: 100,
      },
    })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('100px')
  })

  it('should set max-width with maxWidth prop', () => {
    const wrapper = mountFunction({
      props: {
        maxWidth: 100,
      },
    })

    expect((wrapper.element as HTMLElement).style.maxWidth).toBe('100px')
  })
})
