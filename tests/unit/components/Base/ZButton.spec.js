import { shallowMount } from '@vue/test-utils'
import ZButton from '@/components/Base/ZButton.js'

describe('ZButton.vue', () => {
  it('renders default button', () => {
    const wrapper = shallowMount(ZButton, {
      propsData: {},
    })
    const classes = wrapper.classes()
    expect(classes).toContain('text-white')
    expect(classes).toContain('bg-blue-500')
  })
  it('renders disabled button', () => {
    const wrapper = shallowMount(ZButton, {
      propsData: { disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBe('disabled')
    const classes = wrapper.classes()
    expect(classes).toContain('text-gray-100')
    expect(classes).toContain('bg-gray-400')
  })
  it('renders outlined button', () => {
    const wrapper = shallowMount(ZButton, {
      propsData: { outlined: true },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('text-blue-500')
    expect(classes).toContain('border-gray-400')
  })
  it('renders outlined borderless button', () => {
    const wrapper = shallowMount(ZButton, {
      propsData: { outlined: true, borderless: true },
    })
    expect(wrapper.classes()).toContain('text-blue-500')
    expect(wrapper.classes('border-gray-400')).toBeFalsy()
  })
  it('renders link button', () => {
    const wrapper = shallowMount(ZButton, {
      propsData: { href: '#', target: '_blank' },
    })
    expect(wrapper.contains('a')).toBeTruthy()
    expect(wrapper.attributes('href')).toBe('#')
    expect(wrapper.attributes('target')).toBe('_blank')
  })
  it('renders router-link button', () => {
    const wrapper = shallowMount(ZButton, {
      stubs: ['router-link'],
      propsData: { to: '/' },
    })
    expect(wrapper.contains('router-link-stub')).toBeTruthy()
  })
  it('button loading state', () => {
    const wrapper = shallowMount(ZButton, {
      stubs: ['v-progress-circular'],
      propsData: { loading: true },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('cursor-default')
    expect(classes).toContain('pointer-events-none')
    expect(wrapper.contains('button > span.absolute.inset-0')).toBeTruthy()
    expect(wrapper.attributes('disabled')).toBe('disabled')
  })
})
