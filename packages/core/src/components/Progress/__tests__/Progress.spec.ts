import { mount, VueWrapper } from '@vue/test-utils'
import Progress from '../Progress'

describe('Progress.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Progress, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        value: 33,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ value: -1 })
    const htmlMinus1 = wrapper.html()

    await wrapper.setProps({ value: 0 })
    const html0 = wrapper.html()

    await wrapper.setProps({ value: 100 })
    const html100 = wrapper.html()

    await wrapper.setProps({ value: 101 })
    const html101 = wrapper.html()

    expect(htmlMinus1).toBe(html0)
    expect(html100).toBe(html101)
    expect(html0).not.toBe(html100)

    await wrapper.setProps({ value: '-1' })
    const htmlMinus1String = wrapper.html()

    await wrapper.setProps({ value: '0' })
    const html0String = wrapper.html()

    await wrapper.setProps({ value: '100' })
    const html100String = wrapper.html()

    await wrapper.setProps({ value: '101' })
    const html101String = wrapper.html()

    expect(htmlMinus1String).toBe(html0String)
    expect(html100String).toBe(html101String)
    expect(html0String).not.toBe(html100String)
  })

  it('should render component with rotate prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: { value: 33, rotate: 44 },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with size prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: { value: 33, size: 16 },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with width prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: { value: 33, width: 1 },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with indeterminate prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: { indeterminate: true },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with default slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: { value: 33 },
      slots: {
        default: () => '33',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
