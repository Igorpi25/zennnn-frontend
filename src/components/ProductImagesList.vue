<template>
  <div
    class="flex items-center"
  >
    <div class="flex items-center">
      <div
        v-for="(img, index) in leadImages"
        :key="img.url"
      >
        <ProductImage
          :product-id="productId"
          :images="imagesList"
          :upload="false"
          :removable="removable"
          :current-index="index"
          :caption="caption"
        >
          <template v-slot:menu-activator="{ isOpen }">
            <div class="h-8 w-8 rounded relative">
              <div
                :class="[isOpen ? 'opacity-100' : 'opacity-0']"
                class="absolute rounded-full bg-red-500 flex items-center justify-center transition-colors duration-100 ease-out cursor-pointer"
                style="width: 14px; height: 14px; right: -5px; top: -5px; z-index: 1;"
                @click="removeImage(img)"
              >
                <i class="zi-close text-white" />
              </div>
              <v-img
                :key="img.url"
                :src="`${img.url}${ICON_IMAGE_POSTFIX}`"
                class="rounded"
                aspect-ratio="1"
              >
                <template v-slot:placeholder>
                  <div class="flex justify-center items-center w-full h-full">
                    <Spinner />
                  </div>
                </template>
              </v-img>
              <div v-if="isOpen" class="absolute inset-0 w-full h-full bg-black opacity-35 rounded" />
              <div v-if="isOpen" class="absolute inset-0 w-full h-full flex items-center justify-center">
                <i class="zi-magnifier text-2xl text-white" />
              </div>
            </div>
          </template>
        </ProductImage>
      </div>
    </div>
    <div
      v-if="otherImages.length > 0"
      class="flex justify-center items-center pr-2"
    >
      <span class="font-medium text-gray-100">
      +{{ otherImages.length }}
      </span>
    </div>
    <FileUploader
      v-if="upload"
      ref="fileUploader"
      :loading="loading"
      :uploading.sync="uploading"
      class="w-8 h-8"
      @update="addImage"
    />
  </div>
</template>

<script>
import { ICON_IMAGE_POSTFIX } from '../config/globals'
import { ADD_PRODUCT_IMAGE, REMOVE_PRODUCT_IMAGE } from '../graphql/mutations'

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
    caption: String,
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
      loading: false,
      uploading: false,
      removeLoading: null,
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
    async addImage (file) {
      try {
        this.loading = true
        const inputImages = [file]
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
      } finally {
        this.loading = false
      }
    },
    async removeImage (file) {
      try {
        this.removeLoading = file.url
        const inputImages = [{
          url: file.url,
          filename: file.filename,
          contentType: file.contentType,
        }]
        await this.$apollo.mutate({
          mutation: REMOVE_PRODUCT_IMAGE,
          variables: { id: this.productId, inputImages },
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.removeLoading = null
      }
    },
  },
}
</script>
