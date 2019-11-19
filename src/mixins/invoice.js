import { CREATE_PRODUCT, UPDATE_INVOICE } from '../graphql/mutations'

export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      createLoading: false,
      updateLoading: false,
    }
  },
  watch: {
    'content.name' (val) {
      this.$refs.name.innerText = val || ''
    },
  },
  mounted () {
    this.$refs.name.innerText = this.content.name || ''
  },
  methods: {
    onBlur () {
      this.$refs.name.innerText = this.content.name || ''
    },
    async createProduct () {
      try {
        this.createLoading = true
        await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables: {
            invoiceId: this.content.id,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.createLoading = false
      }
    },
    async updateInvoice (invoiceInput) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            invoiceId: this.content.id,
            invoiceInput,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
  },
}
