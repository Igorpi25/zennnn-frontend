import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Btn from '../Btn'

describe('Btn.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Btn, {
        ...options,
      })
    }
  })

  // Render

  it('should render component with default slot and match snapshot', () => {
    const wrapper = mountFunction({
      slots: {
        default: () => 'Button',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with loader slot and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
      slots: {
        loader: () => '<span>Loading</span>',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with loader and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render an <a> tag when using href prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        href: 'http://example.com',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render specified tag when using tag prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'a',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render router-link when using to prop and match snapshot', () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          component: {
            template: 'Welcome to home',
          },
        },
        {
          path: '/foo',
          component: {
            template: 'Welcome to foo',
          },
        },
      ],
    })

    const wrapper = mountFunction({
      global: {
        plugins: [router],
      },
      props: {
        to: '/foo',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // Html attributes

  it('should inherit attributes like target, tabindex etc.', () => {
    const wrapper = mountFunction({
      attrs: {
        target: '_self',
      },
      props: {
        tag: 'a',
      },
    })

    expect(wrapper.attributes('target')).toBe('_self')
  })

  it('should not have href attribute on disabled <a> tag', () => {
    const wrapper = mountFunction({
      props: {
        tag: 'a',
        disabled: true,
      },
    })

    expect(wrapper.attributes('href')).toBe(undefined)
  })

  it('should have disabled attribute on disabled and loading prop', async () => {
    const wrapper = mountFunction({
      props: {
        disabled: true,
      },
    })

    expect(wrapper.attributes('disabled')).toBe('')

    await wrapper.setProps({ disabled: true, loading: true })

    expect(wrapper.attributes('disabled')).toBe('')
  })

  it('should have min-width and max-width styles on minWidth and maxWidth prop', () => {
    const wrapper = mountFunction({
      props: {
        minWidth: 200,
        maxWidth: 250,
      },
    })

    expect(wrapper.element.style.minWidth).toBe('200px')
    expect(wrapper.element.style.maxWidth).toBe('250px')
  })

  it('should have correct min-width style on small prop', async () => {
    const wrapper = mountFunction({
      props: {
        small: true,
      },
    })

    expect(wrapper.element.style.minWidth).toBe('100px')
  })

  it('should not have default min-width style on icon and text prop', async () => {
    const wrapper = mountFunction({
      props: {
        icon: true,
      },
    })

    expect(wrapper.element.style.minWidth).toBe('')

    await wrapper.setProps({ text: true })

    expect(wrapper.element.style.minWidth).toBe('')
  })

  // Class modifiers

  it('should have btn--block class when using block prop', () => {
    const wrapper = mountFunction({
      props: {
        block: true,
      },
    })

    expect(wrapper.classes('btn--block')).toBe(true)
  })

  it('should have btn--small class when using small prop', () => {
    const wrapper = mountFunction({
      props: {
        small: true,
      },
    })

    expect(wrapper.classes('btn--small')).toBe(true)
  })

  it('should have btn--primary class when using primary prop', () => {
    const wrapper = mountFunction({
      props: {
        primary: true,
        outlined: true,
      },
    })

    expect(wrapper.classes('btn--primary')).toBe(true)
  })

  it('should have btn--outlined class when using outlined prop', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
      },
    })

    expect(wrapper.classes('btn--outlined')).toBe(true)
  })

  it('should have btn--outlined and btn--borderless class when using borderless prop', () => {
    const wrapper = mountFunction({
      props: {
        borderless: true,
      },
    })

    expect(wrapper.classes('btn--outlined')).toBe(true)
    expect(wrapper.classes('btn--borderless')).toBe(true)
  })

  it('should have btn--light and btn--dark class when using light and dark props', async () => {
    const wrapper = mountFunction({
      props: {
        light: true,
      },
    })

    expect(wrapper.classes('btn--light')).toBe(true)

    await wrapper.setProps({ dark: true })

    expect(wrapper.classes('btn--dark')).toBe(true)
  })

  it('should have correct custom classes', () => {
    const wrapper = mountFunction({
      propsData: {
        class: 'foo',
        contentClass: 'bar',
      },
    })

    expect(wrapper.element.className).toBe('btn btn--primary foo')
    expect(wrapper.get('.btn__content').element.className).toBe('btn__content bar')
  })

  // Events

  it('should lose focus when clicked', async () => {
    const wrapper = mountFunction()
    const event = new MouseEvent('click', { detail: 1 })
    const blur = jest.fn()

    wrapper.element.blur = blur
    wrapper.element.dispatchEvent(event)

    expect(blur).toHaveBeenCalled()
  })
})
