import { mount, VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Image from '../Image'

describe('Image.ts', () => {
  const LOAD_FAILURE_SRC = 'LOAD_FAILURE_SRC'
  const LOAD_SUCCESS_SRC = 'LOAD_SUCCESS_SRC'

  let mountFunction: (options?: Record<string, any>) => VueWrapper<any>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Image, {
        ...options,
        props: {
          eager: true,
          ...options.props,
        },
      })
    }
  })

  beforeAll(() => {
    jest.useFakeTimers()
    Object.defineProperty((global as any).Image.prototype, 'src', {
      get () {
        return this._currentSrc
      },
      set (src) {
        this._currentSrc = src
        if (src === LOAD_FAILURE_SRC) {
          setTimeout(() => {
            this.dispatchEvent(new ErrorEvent('error'))
          })
        } else {
          setTimeout(() => {
            this._naturalWidth = 1600
            this._naturalHeight = 900
            this.dispatchEvent(new Event('load', { bubbles: false }))
          })
        }
      },
    })
    Object.defineProperty((global as any).Image.prototype, 'currentSrc', {
      get () {
        return this._currentSrc
      },
    })
    Object.defineProperty((global as any).Image.prototype, 'naturalWidth', {
      get () { return this._naturalWidth },
    })
    Object.defineProperty((global as any).Image.prototype, 'naturalHeight', {
      get () { return this._naturalHeight },
    })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should load', async () => {
    const wrapper = mountFunction({
      props: { src: LOAD_SUCCESS_SRC },
    })

    expect(wrapper.html()).toMatchSnapshot()

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should render a <picture>', async () => {
    const wrapper = mountFunction({
      props: { src: LOAD_SUCCESS_SRC },
      slots: {
        sources: () => h('source', { srcset: LOAD_SUCCESS_SRC + '.webp' }),
      },
    })

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should display placeholders', async () => {
    const wrapper = mountFunction({
      props: {
        src: 'full_src',
        lazySrc: 'lazy_src',
      },
      slots: {
        placeholder: () => h('div', ['loading...']),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should emit errors', () => {
    const error = jest.fn()
    mountFunction({
      props: {
        src: LOAD_FAILURE_SRC,
        onError: error,
      },
    })

    jest.runOnlyPendingTimers()

    expect(error).toHaveBeenCalledTimes(1)
    expect(error).toHaveBeenCalledWith(LOAD_FAILURE_SRC)
  })

  it('should display error slot', async () => {
    const wrapper = mountFunction({
      props: {
        src: LOAD_FAILURE_SRC,
      },
      slots: {
        error: () => h('div', 'Error loading image'),
      },
    })

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should have aria attributes', async () => {
    const wrapper = mountFunction({
      props: {
        src: LOAD_SUCCESS_SRC,
        alt: 'role and aria label',
      },
    })

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should update src', async () => {
    const wrapper = mountFunction({
      props: {
        src: LOAD_SUCCESS_SRC,
      },
    })

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ src: `${LOAD_SUCCESS_SRC}-1` })

    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should update src while still loading', async () => {
    const wrapper = mountFunction({
      props: {
        src: LOAD_SUCCESS_SRC,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()

    await wrapper.setProps({ src: `${LOAD_SUCCESS_SRC}-1` })
    jest.runOnlyPendingTimers()
    await nextTick()

    expect(wrapper.html()).toMatchSnapshot()
  })
})
