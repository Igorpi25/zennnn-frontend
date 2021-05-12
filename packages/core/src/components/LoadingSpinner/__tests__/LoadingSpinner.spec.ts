import { mount, VueWrapper } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(LoadingSpinner, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with size prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        size: 24,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})