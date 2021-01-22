import { mount } from '@vue/test-utils'
import BtnToggle from '../BtnToggle'

describe('BtnToggle.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(BtnToggle, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        items: [{ text: 'Item 1', value: 'item-1' }],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with disabled item and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        items: [{ text: 'Item 1', value: 'item-1' }, { text: 'Item 2', value: 'item-2', disabled: true }],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with disabled prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
        items: [{ text: 'Item 1', value: 'item-1' }, { text: 'Item 2', value: 'item-2' }],
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // ---

  it('should have correct min-width style on minWidth prop', () => {
    const wrapper = mountFunction({
      props: {
        minWidth: 150,
        items: [{ text: 'Item 1', value: 'item-1' }],
      },
    })

    expect(wrapper.get('button').element.style.minWidth).toBe('150px')
  })

  it('should have btn-toggle__item--active class on item click', async () => {
    const wrapper = mountFunction({
      props: {
        items: [{ text: 'Item 1', value: 'item-1' }, { text: 'Item 2', value: 'item-2' }],
      },
    })

    const el = wrapper.findAll('button')[1]

    expect(el.classes('btn-toggle__item--active')).toBe(false)

    await el.trigger('click')

    expect(el.classes('btn-toggle__item--active')).toBe(true)
  })
})
