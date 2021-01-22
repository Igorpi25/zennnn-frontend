import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

import Form from '../Form'
import Checkbox from '../../Checkbox'

jest.mock('../../../utils/uid')

describe('Form.js', () => {
  let mountFunction

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(Form, {
        ...options,
      })
    }
  })

  // Render

  it('should register input', async () => {
    const wrapper = mountFunction({
      props: {
        valid: false,
      },
      slots: {
        default: () => h(Checkbox),
      },
    })

    await nextTick()
    expect(wrapper.vm.inputs).toHaveLength(1)
    expect(Object.keys(wrapper.vm.errorBag)).toHaveLength(1)
  })
})
