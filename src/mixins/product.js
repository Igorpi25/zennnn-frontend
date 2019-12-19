import {
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_COST,
  UPDATE_PRODUCT_STORE,
  UPDATE_PRODUCT_INFO,
  UPDATE_PRODUCT_LINK,
  DELETE_PRODUCT,
} from '../graphql/mutations'
import ProductImage from '../components/ProductImage.vue'
import { confirmDialog } from '@/util/helpers'

export default {
  components: {
    ProductImage,
  },
  data () {
    return {
      updateLoading: null,
      deleteLoading: false,
    }
  },
  computed: {
    cost () {
      return (this.item && this.item.cost) || {}
    },
    store () {
      return (this.item && this.item.store) || {}
    },
    info () {
      return (this.item && this.item.info) || {}
    },
    link () {
      return (this.item && this.item.link) || {}
    },
  },
  methods: {
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
    async updateProductCost (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_COST,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
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
    async updateProductStore (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_STORE,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
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
    async updateProductInfo (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_INFO,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
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
    async updateProductLink (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_LINK,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
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
