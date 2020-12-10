<script>
export default {
  name: 'Icon',
  props: {
    title: {
      type: [String, Object],
      default: '',
    },
  },
  render (h) {
    const attrs = {
      xmlns: 'http://www.w3.org/2000/svg',
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
    }
    const node = this.$slots.default ? this.$slots.default() : []
    const children = node[0] && node[0].children
    const icon = typeof children === 'string' ? children : undefined

    if (icon) {
      return h('svg', {
        attrs,
      },
      [
        this.title ? h('title', this.title) : null,
        [
          h('g', {
            attrs: {
              fill: 'currentColor',
            },
          },
          [
            h('path', {
              attrs: {
                d: icon.trim(),
              },
            }),
          ]),
        ],
      ])
    }
    return null
  },
}
</script>

<style scoped>
svg {
  text-indent: 0;
  letter-spacing: normal;
  line-height: 1;
  user-select: none;
  fill: currentColor;
  vertical-align: middle;
  width: 1em;
  height: 1em;
}
</style>
