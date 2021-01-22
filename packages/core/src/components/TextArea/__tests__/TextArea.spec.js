import { mount } from '@vue/test-utils'

import TextArea from '../TextArea'

jest.mock('../../../utils/uid')

describe('TextArea.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(TextArea, {
        ...options,
      })
    }
  })

  // Render

  it('should render component and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with disabled prop and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        disabled: true,
      },
    })

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

  it('should render component with name, required, readonly props and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
        name: 'text-field-name',
        required: true,
        readonly: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render focused component and match snapshot', async () => {
    const wrapper = mountFunction({
      props: {
        label: 'Default',
        placeholder: 'Default',
      },
    })

    await wrapper.get('textarea').trigger('focus')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render component with slots and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
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

  it('should render component with custom classes and match snapshot', () => {
    const wrapper = mountFunction({
      props: {
        placeholder: 'Solo custom',
        label: 'Solo custom',
        controlClass: 'dark:bg-transparent',
        inputClass: 'dark:placeholder-blue-500',
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  // ---
})
