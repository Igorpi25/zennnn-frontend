import apolloClient from '../plugins/apollo'

import {
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_COST,
  UPDATE_PRODUCT_STORE,
  UPDATE_PRODUCT_INFO,
  UPDATE_PRODUCT_LINK,
  DELETE_PRODUCT,
} from '../graphql/mutations'
import { GET_SPEC, GET_IS_SPEC_SYNC } from '../graphql/queries'
import { ProductStatus } from '../graphql/enums'

import ProductImagesList from '../components/ProductImagesList.vue'
import ProductImage from '../components/ProductImage.vue'

import { confirmDialog } from '../utils/confirmDialog'
import { isNumber } from '../utils/check'

export default {
  components: {
    ProductImagesList,
    ProductImage,
  },
  data () {
    return {
      updateLoading: null,
      deleteLoading: false,
    }
  },
  computed: {
    productStatusColor () {
      return this.item.productStatus === ProductStatus.IN_STOCK
        ? 'bg-green-500'
        : this.item.productStatus === ProductStatus.IN_PRODUCTION
          ? 'bg-yellow-500'
          : this.item.productStatus === ProductStatus.IN_PROCESSING
            ? 'bg-pink-500'
            : ''
    },
    unitsItems () {
      const units = ['pcs', 'roll', 'time', 'm', 'l', 'm3', 'set', 'm2', 'kg', 'pack']
      return units.map(el => {
        return {
          value: el,
          text: this.$t(`unit.${el}`),
        }
      })
    },
    specId () {
      return this.$route.params.specId
    },
    hasCustomPurchasePrice () {
      return !this.profitForAll && isNumber(this.cost.customPurchasePrice)
    },
    purchasePrice () {
      if (this.profitForAll) {
        return this.cost.purchasePrice
      }
      return isNumber(this.cost.customPurchasePrice)
        ? this.cost.customPurchasePrice
        : this.cost.purchasePrice
    },
    hasCustomClientPrice () {
      return !this.profitForAll && isNumber(this.cost.customClientPrice)
    },
    clientPrice () {
      if (this.profitForAll) {
        return this.cost.clientPrice
      }
      return isNumber(this.cost.customClientPrice)
        ? this.cost.customClientPrice
        : this.cost.clientPrice
    },
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
    createOrUpdateProduct (input) {
      if (this.create) {
        this.$emit('create', input)
      } else {
        this.updateProduct(input)
      }
    },
    async updateProduct (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await apolloClient.mutate({
          mutation: UPDATE_PRODUCT,
          variables: { id, input },
          fetchPolicy: 'no-cache',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
        if (error.message && error.message.includes('GraphQL error: MongoError: WriteConflict')) {
          this.refetchSpec()
        }
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
    async refetchSpec () {
      try {
        apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: true },
        })
        await apolloClient.query({
          query: GET_SPEC,
          variables: {
            id: this.specId,
          },
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        apolloClient.writeQuery({
          query: GET_IS_SPEC_SYNC,
          data: { isSpecSync: false },
        })
      }
    },
    async updateProductCost (input) {
      try {
        const id = this.item.id
        this.updateLoading = id
        await apolloClient.mutate({
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
        await apolloClient.mutate({
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
        await apolloClient.mutate({
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
        await apolloClient.mutate({
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
        await apolloClient.mutate({
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
