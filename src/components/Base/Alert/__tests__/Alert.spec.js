import { h } from 'vue'
import { mount } from '@vue/test-utils'
import Alert from '../Alert'
import Icon from '../../Icon'
import { ziCheckFill } from '../../../../assets/icons'

describe('Alert.js', () => {
  let mountFunction

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
      props: {
        modelValue: true,
      },
      slots: {
        default: () => 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with text prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "error" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        color: 'error',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "warn" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        color: 'warn',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "success" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        color: 'success',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "info" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        color: 'info',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with "primary" color and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        color: 'primary',
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with close prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        close: true,
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with custom class props and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        close: true,
        closeClass: 'custom-close-class',
        infoIconClass: 'custom-info-icon-close',
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
        modelValue: true,
        close: true,
        text: 'Alert',
      },
      slots: {
        icon: () => h(Icon, {
          base: true,
          class: 'text-blue-500 pr-4',
        }, { default: () => ziCheckFill }),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component without icon and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        infoIcon: false,
        text: 'Alert',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with close slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
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
        modelValue: true,
        close: true,
        text: 'Alert',
      },
    })

    await wrapper.find('.alert__close').trigger('click')

    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([false])
  })

  it('should toggle model value', async () => {
    const wrapper = mountFunction({
      slots: {
        default: 'Alert',
      },
    })

    expect(wrapper.html()).toBe('<!---->')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.classes('alert')).toBe(true)
  })

  it('should unset default maxWidth prop', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
        maxWidth: 'none',
      },
    })

    expect(wrapper.element.style.maxWidth).toBe('none')
  })
})
