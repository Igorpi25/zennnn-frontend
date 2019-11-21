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
    'content.invoiceNo' (val) {
      this.$refs.name.innerText = val || ''
    },
  },
  mounted () {
    this.$refs.name.innerText = this.content.invoiceNo || ''
  },
  methods: {
    onBlur () {
      this.$refs.name.innerText = this.content.invoiceNo || ''
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
    async updateInvoice (input) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_INVOICE,
          variables: {
            id: this.content.id,
            input,
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
