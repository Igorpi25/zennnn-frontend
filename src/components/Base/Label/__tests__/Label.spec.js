import { mount } from '@vue/test-utils'
import Label from '../Label'

jest.mock('../../../../utils/uid')

describe('Label.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Label, {
        ...options,
      })
    }
  })

  // Render

  it('should render component with default slot and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with id and value prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        id: 'label-id',
        value: 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with for prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        for: 'input-id',
        value: 'Label',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with append slot and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Label',
        append: () => 'Append slot',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // TODO: need use attachTo for set max-width to parent
  it.todo('should show wrapped content on pointer enter')

  // TODO: need use attachTo for set background to parent
  it.todo('should set correct background-color on pointer enter')
})
