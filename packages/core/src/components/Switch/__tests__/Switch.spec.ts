import { mount, VueWrapper } from '@vue/test-utils'

import Switch from '../Switch'

jest.mock('../../../utils/uid')

describe('Switch.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Switch, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with disabled prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
      slots: {
        default: () => 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with name, required, readonly props and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        name: 'simple-input',
        required: true,
        readonly: true,
      },
      slots: {
        default: () => 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render checked component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        modelValue: true,
      },
      slots: {
        default: () => 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render focused component and match snapshot', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Label',
      },
    })

    await wrapper.get('input').trigger('focus')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with label prop and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        label: 'Input label',
      },
      slots: {
        default: () => 'Switch label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // ---

  it('should emit true/false when input/label clicked', async () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Label',
      },
    })

    await wrapper.get('input').trigger('click')
    await wrapper.get('label').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('change')
    expect(wrapper.emitted().change[0]).toEqual([true])
    expect(wrapper.emitted().change[1]).toEqual([false])
  })

  it('should emit specified value and return null on toggled off when clicked', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'Test',
      },
    })

    const input = wrapper.get('input')
    await input.trigger('click')
    await input.trigger('click')

    expect(wrapper.emitted().change[0]).toEqual(['Test'])
    expect(wrapper.emitted().change[1]).toEqual([null])
  })

  it('should work with custom true- and false-value', async () => {
    const wrapper = mountFunction({
      props: {
        trueValue: 'on',
        falseValue: 'off',
      },
    })

    const input = wrapper.get('input')
    await input.trigger('click')
    await input.trigger('click')

    expect(wrapper.emitted().change[0]).toEqual(['on'])
    expect(wrapper.emitted().change[1]).toEqual(['off'])
  })

  it('should toggle on arrow left and right keydown', async () => {
    const wrapper = mountFunction()

    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'ArrowRight' })
    await input.trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted().change[0]).toEqual([true])
    expect(wrapper.emitted().change[1]).toEqual([false])
  })
})
