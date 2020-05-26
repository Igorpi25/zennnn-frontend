export default {
  props: {
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
  created () {
    this.expanded = this.isExpanded
  },
  watch: {
    isExpanded (val) {
      this.expanded = val
    },
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
