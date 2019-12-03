import { CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT } from '../graphql/mutations'

import { confirmDialog } from '@/util/helpers'

export default {
  data () {
    return {
      updateLoading: null,
      deleteLoading: false,
    }
  },
  methods: {
    async createProduct () {
      try {
        this.createLoading = true
        const variables = {
          invoiceId: this.invoice.id,
        }
        await this.$apollo.mutate({
          mutation: CREATE_PRODUCT,
          variables,
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'CreateProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.createLoading = false
      }
    },
    async updateProduct (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
        if (error && error.errors && error.errors.length > 0) {
          this.errors = error.errors
        }
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'UpdateProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.updateLoading = null
      }
    },
    async deleteProduct (id) {
      try {
        const msg = this.$t('alert.removeProduct')
        const confirm = await confirmDialog(msg)
        if (confirm === 'not_confirmed') {
          return
        }
        this.deleteLoading = id
        await this.$apollo.mutate({
          mutation: DELETE_PRODUCT,
          variables: { id },
        })
      } catch (error) {
        if (error === 'not_confirmed') return
        this.errors = error.errors || []
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'DeleteProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.deleteLoading = null
      }
    },
  },
}
