export default {
  props: {
    loading: Boolean,
    create: Boolean,
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      expanded: true,
    }
  },
  watch: {
    isExpanded (val) {
      this.expanded = val
    },
  },
  created () {
    this.expanded = this.isExpanded
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
    updateData (input) {
      this.$emit('update', input)
    },
  },
}
