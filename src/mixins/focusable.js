export default {
  data () {
    return {
      hasFocus: false,
    }
  },
  methods: {
    onFocus () {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
  },
}
