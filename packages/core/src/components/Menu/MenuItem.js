import {
  h,
  ref,
  computed,
  watch,
  watchEffect,
  onMounted,
  nextTick,
  cloneVNode,
  withDirectives,
} from 'vue'

import { Intersect } from 'vue-supp'

import uid from '../../utils/uid'

import { useMenuContext } from './Menu'

import './MenuItem.css'

export default {
  name: 'MenuItem',

  props: {
    tag: {
      type: String,
      default: 'div',
    },
    // need for refs
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: [Object, String, Number],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'menuitem',
    },
    tabindex: {
      type: [Number, String],
      default: '-1',
    },
    id: String,
    contentOnIntersect: Boolean,
  },

  setup (props) {
    const id = props.id || uid('menu-item-')
    const api = useMenuContext('MenuItem')
    const rootElement = ref(null)
    const isIntersecting = ref(false)

    const active = computed(() => {
      return api.activeItemIndex.value !== null
        ? api.activeItemIndex.value === props.index
        : false
    })

    const selected = computed(() => props.value !== null && api.internalValue.value === props.value)

    onMounted(() => {
      if (!selected.value) return
      nextTick(() => {
        updateSelf()
      })
    })

    watch(api.isContentVisible, (val) => {
      if (!selected.value) return
      nextTick(() => {
        val && updateSelf()
      })
    })

    watchEffect(() => {
      if (!active.value) return

      nextTick(() => {
        rootElement.value.scrollIntoView({ block: 'nearest' })
      })
    })

    const updateSelf = () => {
      api.goToItem(props.index)
      rootElement.value.scrollIntoView({ block: 'nearest' })
    }

    const setItemRef = (el) => {
      rootElement.value = el
      api.setItemRef(el, props.index)
    }

    const onClick = (e) => {
      if (props.disabled) return e.preventDefault()
      api.selectItem(props.value)
      api.closeMenu()
    }

    const onFocus = () => {
      if (props.disabled) return api.goToItem(-1)
      api.goToItem(props.index)
    }

    const onPointerMove = () => {
      if (props.disabled) return
      if (active.value) return
      api.goToItem(props.index)
    }

    const onPointerLeave = () => {
      if (props.disabled) return
      if (!active.value) return
      api.goToItem(-1)
    }

    const onIntersect = (entries, observer, _isIntersecting) => {
      if (!isIntersecting.value) isIntersecting.value = _isIntersecting
    }

    return {
      rootElement,
      id,
      active,
      selected,
      isIntersecting,
      setItemRef,
      onClick,
      onFocus,
      onPointerMove,
      onPointerLeave,
      onIntersect,
    }
  },

  render () {
    const slot = { active: this.active, selected: this.selected, disabled: this.disabled }
    const data = {
      ref: this.setItemRef,
      id: this.id,
      role: this.role,
      tabIndex: this.tabindex,
      class: {
        menu__item: true,
        'menu__item--active': this.active,
        'menu__item--selected': this.selected,
        'menu__item--disabled': this.disabled,
      },
      'aria-disabled': this.disabled === true ? true : undefined,
      'aria-selected': this.selected === true ? this.selected : undefined,
      onClick: this.$attrs.onClick || this.onClick,
      onFocus: this.onFocus,
      onPointerMove: this.onPointerMove,
      onPointerLeave: this.onPointerLeave,
    }

    let children = null

    if (this.tag === 'template' && this.$slots.default) {
      const [firstChild] = this.$slots.default(slot)
      children = cloneVNode(firstChild, data)
    } else {
      children = h(this.tag, data, this.$slots.default ? this.$slots.default(slot) : undefined)
    }

    if (this.contentOnIntersect) {
      const content = this.isIntersecting
        ? children
        : h('div', data)
      return withDirectives(
        content,
        [
          [Intersect, this.onIntersect, null, { once: true }],
        ],
      )
    }
    return children
  },
}
