import { mount, VueWrapper } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Btn from '../Btn'

describe('Btn.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

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

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('200px')
    expect((wrapper.element as HTMLElement).style.maxWidth).toBe('250px')
  })

  it('should have correct default min-width styles', async () => {
    const wrapper = mountFunction({
      props: {},
    })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('128px')

    await wrapper.setProps({ small: true })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('96px')
  })

  it('should not have default min-width style on icon/text/xSmall/mini props', async () => {
    const wrapper = mountFunction({
      props: {
        icon: true,
      },
    })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('')

    await wrapper.setProps({ text: true })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('')

    await wrapper.setProps({ xSmall: true })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('')

    await wrapper.setProps({ mini: true })

    expect((wrapper.element as HTMLElement).style.minWidth).toBe('')
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

  it('should have btn--x-small class when using x-small prop', () => {
    const wrapper = mountFunction({
      props: {
        xSmall: true,
      },
    })

    expect(wrapper.classes('btn--x-small')).toBe(true)
  })

  it('should have btn--mini class when using mini prop', () => {
    const wrapper = mountFunction({
      props: {
        mini: true,
      },
    })

    expect(wrapper.classes('btn--mini')).toBe(true)
  })

  it('should have btn--primary class by default or when using primary prop', async () => {
    const wrapper = mountFunction({
      props: {},
    })

    expect(wrapper.classes('btn--primary')).toBe(true)

    await wrapper.setProps({ primary: true })

    expect(wrapper.classes('btn--primary')).toBe(true)
  })

  it('should not have btn--primary class when using text, outlined prop or primary=false', async () => {
    const wrapper = mountFunction({
      props: {
        primary: true,
        text: true,
      },
    })

    expect(wrapper.classes('btn--primary')).toBe(false)

    await wrapper.setProps({ primary: true, outlined: true })

    expect(wrapper.classes('btn--primary')).toBe(false)

    await wrapper.setProps({ primary: false })

    expect(wrapper.classes('btn--primary')).toBe(false)
  })

  it('should have btn--outlined class when using outlined prop', () => {
    const wrapper = mountFunction({
      props: {
        outlined: true,
      },
    })

    expect(wrapper.classes('btn--outlined')).toBe(true)
  })

  it('should not have btn--outlined class when using text or link prop', () => {
    const wrapper = mountFunction({
      props: {
        text: true,
      },
    })

    expect(wrapper.classes('btn--outlined')).toBe(false)

    wrapper.setProps({ link: true })

    expect(wrapper.classes('btn--outlined')).toBe(false)
  })

  it('should have correct custom classes', () => {
    const wrapper = mountFunction({
      propsData: {
        class: 'foo',
      },
    })

    expect(wrapper.element.className).toBe('btn btn--primary foo')
  })
})
