import { mount, VueWrapper } from '@vue/test-utils'

import Radio from '../Radio'

jest.mock('../../../utils/uid')

describe('Radio.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Radio, {
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
        modelValue: 'radio-1',
        value: 'radio-1',
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
        default: () => 'Radio label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // ---

  // TODO: onchange return 'on'
  it.todo('should emit value when input/label clicked')
})
