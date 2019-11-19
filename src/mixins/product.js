import { UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations'

export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      updateLoading: false,
      deleteLoading: false,
    }
  },
  methods: {
    async updateProduct (productInput) {
      try {
        this.updateLoading = true
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: {
            productId: this.content.id,
            productInput,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.updateLoading = false
      }
    },
    async deleteProduct () {
      try {
        this.deleteLoading = true
        await this.$apollo.mutate({
          mutation: DELETE_PRODUCT,
          variables: {
            productId: this.content.id,
          },
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        this.deleteLoading = false
      }
    },
  },
}
