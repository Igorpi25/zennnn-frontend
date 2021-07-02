import { nextTick } from 'vue'
import { mount, VueWrapper } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { wait } from 'vue-supp'

import Autocomplete from '../Autocomplete'

jest.mock('../../../utils/uid')

describe('Autocomplete.ts', () => {
  let mountFunction: (options?: Record<string, unknown>) => VueWrapper<any>

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>'

    mountFunction = (options = {}) => {
      return mount(Autocomplete, {
        ...options,
        global: {
          plugins: [
            createI18n({
              silentTranslationWarn: true,
              silentFallbackWarn: true,
            }),
          ],
        },
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const items: any[] = ['one', 'two', 'three']
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        items,
      },
    })

    expect(document.querySelector('[data-popper-root]')?.outerHTML).toBe(
      undefined
    )
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render items on focused and match snapshot', async () => {
    const items: any[] = ['one', 'two', 'three']
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        items,
      },
    })

    await wrapper.get('input').trigger('focus')
    const itemsHtml = document.querySelector('[data-popper-root]')?.outerHTML

    expect(itemsHtml).toMatchSnapshot()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with disabled prop and match snapshot, should not open menu', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['item1'],
        label: 'Default',
        placeholder: 'Default',
        disabled: true,
      },
    })

    await wrapper.get('input').trigger('focus')
    expect(document.querySelector('[data-popper-root]')?.outerHTML).toBe(
      undefined
    )

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with name, required, readonly props and match snapshot, should not open menu', async () => {
    const wrapper = mountFunction({
      props: {
        items: ['item1'],
        label: 'Default',
        placeholder: 'Default',
        name: 'text-field-name',
        required: true,
        readonly: true,
      },
    })

    await wrapper.get('input').trigger('focus')
    expect(document.querySelector('[data-popper-root]')?.outerHTML).toBe(
      undefined
    )

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with loading prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        loading: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with singleLine prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        singleLine: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with solo prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        items: ['item1'],
        label: 'Default',
        placeholder: 'Default',
        solo: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with dense prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        items: ['item1'],
        label: 'Default',
        placeholder: 'Default',
        dense: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with slots and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        items: ['item1'],
        prependIcon: 'prepend-icon',
        appendIcon: 'append-icon',
      },
      slots: {
        prepend: () => 'Prepend slot',
        append: () => 'Append slot',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  //

  it('should filter items', async () => {
    const items: any[] = ['one', 'two', 'three']
    const wrapper = mountFunction({
      props: {
        items,
        searchable: true,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.setValue('one')

    expect(document.querySelectorAll('[role="option"]').length).toBe(1)
  })

  // Interactions

  it('should select value on item click', async () => {
    const items: any[] = ['Item 1']
    const wrapper = mountFunction({
      props: {
        items,
        attach: false,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })

    await wrapper.find('[role="option"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Item 1']])
  })

  it('should open on Spacebar keydown', async () => {
    const items: any[] = ['Item 1']
    const wrapper = mountFunction({
      props: {
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: 'Esc' })

    expect(wrapper.vm.isMenuActive).toBe(false)

    await input.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted().keydown.length).toBe(2)
    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should not open menu on focus and close on Esc keydown', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountFunction({
      props: {
        modelValue: 'Item 2',
        items,
        openOnFocus: true,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')

    expect(wrapper.vm.isMenuActive).toBe(true)

    await input.trigger('keydown', { key: 'Esc' })

    expect(wrapper.emitted().keydown.length).toBe(1)
    expect(wrapper.vm.isMenuActive).toBe(false)
  })

  it('should activate first item on ArrowDown keydown', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountFunction({
      props: {
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keydown', { key: 'ArrowDown' })

    const item = document.querySelector('.menu__item--active') as HTMLElement

    expect(wrapper.emitted().keydown.length).toBe(2)
    expect(item.textContent).toBe('Item 1')
  })

  it('should activate last item on ArrowUp keydown', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountFunction({
      props: {
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keydown', { key: 'ArrowUp' })

    const item = document.querySelector('.menu__item--active') as HTMLElement

    expect(wrapper.emitted().keydown.length).toBe(2)
    expect(item.textContent).toBe('Item 3')
  })

  it('should activate selected item on ArrowDown/ArrowUp keydown', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountFunction({
      props: {
        modelValue: 'Item 2',
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await wait(20)
    expect(
      (document.querySelector('.menu__item--active') as HTMLElement)
        ?.textContent
    ).toBe('Item 2')

    await input.trigger('keydown', { key: 'Esc' })
    await nextTick()
    await input.trigger('keydown', { key: 'ArrowUp' })
    await wait(20)
    expect(
      (document.querySelector('.menu__item--active') as HTMLElement)
        ?.textContent
    ).toBe('Item 2')
  })

  it('should select value with keyboard', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = [{ text: 'Item 1', value: 1 }]
    const wrapper = mountFunction({
      props: {
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted().keydown.length).toBe(3)
    expect(wrapper.emitted('update:modelValue')).toEqual([[1]])
  })

  it('should select active item and close menu on Tab keydown', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn()

    const items: any[] = ['Item 1', 'Item 2', 'Item 3']
    const wrapper = mountFunction({
      props: {
        items,
      },
    })

    const input = wrapper.get('input')

    await input.trigger('focus')
    await input.trigger('keydown', { key: ' ' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Tab' })

    await nextTick()

    expect(wrapper.vm.isMenuActive).toBe(false)
    expect(wrapper.emitted().keydown.length).toBe(3)
    expect(wrapper.emitted('update:modelValue')).toEqual([['Item 1']])
  })
})
