import { mount } from '@vue/test-utils'
import Icon from '../Icon'

describe('Icon.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Icon, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render specified tag when using tag prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: { tag: 'span' },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set size class from helper prop and match snapshot', () => {
    const iconFactory = size => mountFunction({
      props: { [size]: true },
    })

    const small = iconFactory('small')
    expect(small.html()).toMatchSnapshot()

    const medium = iconFactory('base')
    expect(medium.html()).toMatchSnapshot()

    const large = iconFactory('large')
    expect(large.html()).toMatchSnapshot()
  })

  it('should have correct size style on size prop', () => {
    const wrapper = mountFunction({
      props: {
        size: 20,
      },
      slots: {
        default: () => 'M18 12a6 6 0 11-12 0 6 6 0 0112 0z',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
