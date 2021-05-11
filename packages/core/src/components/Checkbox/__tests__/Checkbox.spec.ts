import { mount, VueWrapper } from '@vue/test-utils'

import Checkbox from '../Checkbox'

jest.mock('../../../utils/uid')

describe('Checkbox.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Checkbox, {
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

  it('should render component with indeterminate prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        indeterminate: true,
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
        default: () => 'Checkbox label',
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

    const input = wrapper.get('input')
    await input.setValue('false')
    await input.setValue('true')

    // on click emitted native click
    await input.trigger('click')
    await wrapper.get('label').trigger('click')
    expect(wrapper.emitted().click.length).toEqual(3)

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
    await input.setValue()
    await input.setValue('Test')

    // on click emitted native click
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
    await input.setValue('false')
    await input.setValue('true')

    expect(wrapper.emitted().change[0]).toEqual(['on'])
    expect(wrapper.emitted().change[1]).toEqual(['off'])
  })

  it('should emit array value on multiple prop', async () => {
    const wrapper = mountFunction({
      props: {
        value: 'Test',
        multiple: true,
      },
    })

    await wrapper.get('input').setValue()

    expect(wrapper.emitted().change[0]).toEqual([['Test']])
  })

  it('should emit array value with modelValue is array', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: [],
        value: 'Test',
      },
    })

    await wrapper.get('input').setValue()

    expect(wrapper.emitted().change[0]).toEqual([['Test']])
  })

  it('should toggle value in array on multiple prop', async () => {
    const wrapper = mountFunction({
      props: {
        modelValue: ['Test'],
        value: 'Test',
        multiple: true,
      },
    })

    await wrapper.get('input').setValue(['Test'])

    expect(wrapper.emitted().change[0]).toEqual([[]])
  })
})
