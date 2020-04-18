<template>
  <div
    class="flex items-center px-1"
  >
    <div
      v-for="(img) in leadImages"
      :key="img"
      class="flex items-center"
    >
      <ProductImage
        :product-id="productId"
        :images="[img]"
        :upload="false"
        :removable="removable"
      >
        <template v-slot:menu-activator>
          <v-img
            :src="`${img}${ICON_IMAGE_POSTFIX}`"
            :class="[
              'rounded-sm h-6 w-6',
            ]"
            aspect-ratio="1"
          >
            <template v-slot:placeholder>
              <div class="flex justify-center items-center w-full h-full">
                <Spinner />
              </div>
            </template>
          </v-img>
        </template>
      </ProductImage>
    </div>
    <ProductImage
      v-if="otherImages.length > 0"
      :product-id="productId"
      :images="otherImages"
      :upload="false"
      :removable="removable"
    >
      <template v-slot:menu-activator>
        <div class="flex justify-center items-center">
          <span class="font-medium text-gray-lightest">
          +{{ otherImages.length }}
          </span>
        </div>
      </template>
    </ProductImage>
    <FileUploader
      v-if="upload"
      ref="fileUploader"
      :loading="loading"
      :uploading.sync="uploading"
      show-preview
      check-download-url
      class="text-primary"
      style="width:24px; height:24px;"
      @update="addImage"
    />
  </div>
</template>

<script>
import { ICON_IMAGE_POSTFIX } from '../config/globals'
import { ADD_PRODUCT_IMAGE } from '../graphql/mutations'

import ProductImage from './ProductImage.vue'
import FileUploader from './FileUploader.vue'

export default {
  name: 'ProductImagesList',
  components: {
    ProductImage,
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
    upload: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
      loading: false,
      uploading: false,
    }
  },
  computed: {
    imagesList () {
      return this.images || []
    },
    leadImages () {
      return this.imagesList.slice(0, 3)
    },
    otherImages () {
      return this.imagesList.slice(3)
    },
  },
  methods: {
    async addImage (src) {
      try {
        this.loading = true
        const inputImages = [src]
        await this.$apollo.mutate({
          mutation: ADD_PRODUCT_IMAGE,
          variables: { id: this.productId, inputImages },
        })
        this.$nextTick(() => {
          this.$refs.fileUploader.internalSrc = null
          this.$refs.fileUploader.filePreview = null
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
