<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-width="432"
    :max-width="432"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <FileUploader
          :loading="loading"
          :src="mainImage"
          @update="updateImages"
        />
      </div>
    </template>
    <div
      v-if="mainImage"
      class="bg-gray-darker"
    >
      <div class="text-accent2 truncate py-2 px-1">
        {{ mainImage }}
      </div>
      <div class="w-fill pa-1">
        <img :src="`${mainImage}${PREVIEW_IMAGE_POSTFIX}`">
      </div>
    </div>
  </v-menu>
</template>

<script>
import {
  UPDATE_PRODUCT_INFO,
} from '../graphql/mutations'

import FileUploader from '../components/FileUploader.vue'
import { delay } from '../util/helpers'
import { PREVIEW_IMAGE_POSTFIX } from '../config/globals'

export default {
  name: 'ProductImages',
  components: {
    FileUploader,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: undefined,
    },
  },
  data () {
    return {
      PREVIEW_IMAGE_POSTFIX,
      loading: false,
      menu: false,
    }
  },
  computed: {
    mainImage () {
      const images = this.images || []
      return images[0]
    },
  },
  methods: {
    async updateImages (src, d = 5000) {
      try {
        this.loading = true
        const imgs = this.images || []
        const images = [src, ...imgs]
        const input = { images }
        // time to create thumbnail on lambda
        this.$logger.info('Delay for thumbnail lambda', d)
        await delay(d)
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_INFO,
          variables: { id: this.productId, input },
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
        this.loading = false
      }
    },
  },
}
</script>
