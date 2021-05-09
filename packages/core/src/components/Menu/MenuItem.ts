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
  defineComponent,
  PropType,
} from 'vue'

import { Intersect } from 'vue-supp'

import { ObjectItemKey } from '../../../types'

import uid from '../../utils/uid'

import { useMenuContext } from './Menu'

import './MenuItem.css'

export default defineComponent({
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
      type: [Object, String, Number] as PropType<ObjectItemKey>,
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
    dense: Boolean,
  },

  setup (props) {
    const id: string = props.id || uid('menu-item-')
    const api = useMenuContext('MenuItem') as Record<string, any>
    const rootElement = ref<HTMLElement>()
    const isIntersecting = ref<boolean>(false)

    const active = computed(() => {
      return api.activeItemIndex.value !== null
        ? api.activeItemIndex.value === props.index
        : false
    })

    const selected = computed(() => props.value !== null && api.internalValue.value === props.value)

    onMounted(() => {
      if (!api.isActive.value) return
      if (!selected.value) return
      nextTick(() => {
        updateSelf()
      })
    })

    watch(api.isVisible, (val) => {
      if (!api.isActive.value) return
      if (!selected.value) return
      nextTick(() => {
        val && updateSelf()
      })
    })

    watchEffect(() => {
      if (!api.isActive.value) return
      if (!active.value) return

      nextTick(() => {
        rootElement.value?.scrollIntoView({ block: 'nearest' })
      })
    })

    const updateSelf = () => {
      api.goToItem(props.index)
      rootElement.value?.scrollIntoView({ block: 'nearest' })
    }

    const setItemRef = (el: HTMLElement) => {
      rootElement.value = el
      api.setItemRef(el, props.index)
    }

    const onClick = (e: MouseEvent) => {
      if (props.disabled) return e.preventDefault()
      api.selectItem(props.value)
      api.closeMenu()
    }

    const onFocus = () => {
      if (props.disabled) return api.goToItem(-1)
      api.goToItem(props.index)
    }

    const onPointermove = () => {
      if (props.disabled) return
      if (active.value) return
      api.goToItem(props.index)
    }

    const onPointerleave = () => {
      if (props.disabled) return
      if (!active.value) return
      api.goToItem(-1)
    }

    const onIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver, _isIntersecting: boolean) => {
      if (!isIntersecting.value) isIntersecting.value = _isIntersecting
    }

    return {
      api,
      rootElement,
      cid: id,
      active,
      selected,
      isIntersecting,
      setItemRef,
      onClick,
      onFocus,
      onPointermove,
      onPointerleave,
      onIntersect,
    }
  },

  render () {
    const slot = { active: this.active, selected: this.selected, disabled: this.disabled }
    const data: Record<string, any> = {
      ref: this.setItemRef,
      id: this.cid,
      role: this.role,
      tabindex: this.tabindex,
      class: {
        menu__item: true,
        'menu__item--active': this.active,
        'menu__item--selected': this.selected,
        'menu__item--disabled': this.disabled,
        'menu__item--dense': this.dense,
      },
      'aria-disabled': this.disabled === true ? true : undefined,
      'aria-selected': this.selected === true ? this.selected : undefined,
      onClick: this.$attrs.onClick || this.onClick,
      onFocus: this.onFocus,
      onPointermove: this.onPointermove,
      onMousemove: this.onPointermove,
      onPointerleave: this.onPointerleave,
      onMouseleave: this.onPointerleave,
    }

    let children = null

    if (this.tag === 'template' && this.$slots.default) {
      const [firstChild] = this.$slots.default(slot)
      children = cloneVNode(firstChild, data)
    } else {
      children = h(this.tag, data, this.$slots.default?.(slot))
    }

    if (this.contentOnIntersect) {
      const content = this.isIntersecting
        ? children
        : h('div', data)
      return withDirectives(
        content,
        [
          [Intersect, this.onIntersect, '', { once: true }],
        ],
      )
    }
    return children
  },
})
