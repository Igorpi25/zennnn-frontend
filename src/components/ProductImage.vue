<template>
  <v-menu
    :close-on-content-click="false"
    :nudge-width="380"
    :max-width="380"
    :disabled="!previewImage"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <slot name="menu-activator">
          <FileUploader
            v-if="upload"
            :loading="loading"
            :src="previewImage"
            :show-preview="imagesList.length === 0"
            check-download-url
            @update="updateImages"
          >
            <template v-slot:preview>
              <v-img
                :src="`${previewImage}${ICON_IMAGE_POSTFIX}`"
                aspect-ratio="1"
              >
                <template v-slot:placeholder>
                  <div class="flex justify-center items-center w-full h-full">
                    <Spinner />
                  </div>
                </template>
              </v-img>
            </template>
          </FileUploader>
          <div
            v-else
            class="w-10 h-10 rounded overflow-hidden"
          >
            <v-img
              v-if="previewImage"
              :src="`${previewImage}${ICON_IMAGE_POSTFIX}`"
              aspect-ratio="1"
            >
              <template v-slot:placeholder>
                <div class="flex justify-center items-center w-full h-full">
                  <Spinner />
                </div>
              </template>
            </v-img>
          </div>
        </slot>
      </div>
    </template>
    <div
      class="bg-gray-darker"
    >
      <div class="text-accent2 truncate h-8 px-1 flex items-center">
        <Spinner v-if="currentImageFilenameLoading" />
        <span v-else>
          {{ currentImageFilename || currentImage }}
        </span>
      </div>
      <div
        v-if="imagesList.length > 1"
        class="inline-flex px-1 overflow-x-auto"
      >
        <v-img
          v-for="(img, i) in imagesList"
          :key="img"
          :src="`${img}${ICON_IMAGE_POSTFIX}`"
          :class="[
            'rounded-sm h-6 w-6',
            { 'mr-1' : i + 1 < imagesList.length },
            { 'border-2 border-solid border-primary': i === currentImageIndex },
          ]"
          aspect-ratio="1"
          @click="setCurrentIndex(i)"
        >
          <template v-slot:placeholder>
            <div class="flex justify-center items-center w-full h-full">
              <Spinner />
            </div>
          </template>
        </v-img>
      </div>
      <div class="w-full pa-1">
        <v-img
          :src="`${currentImage}${PREVIEW_IMAGE_POSTFIX}`"
          :key="currentImage"
          class="w-full"
          aspect-ratio="1"
        >
          <template v-slot:placeholder>
            <div class="flex justify-center items-center w-full h-full">
              <Spinner />
            </div>
          </template>
        </v-img>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { UPDATE_PRODUCT_INFO } from '../graphql/mutations'

import FileUploader from '../components/FileUploader.vue'
import { ICON_IMAGE_POSTFIX, PREVIEW_IMAGE_POSTFIX, IMAGE_FILENAME_METADATA } from '../config/globals'

export default {
  name: 'ProductImage',
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
    upload: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
      PREVIEW_IMAGE_POSTFIX,
      loading: false,
      menu: false,
      currentImageFilenameLoading: false,
      currentImageFilename: '',
      currentImageIndex: 0,
    }
  },
  computed: {
    imagesList () {
      return this.images || []
    },
    previewImage () {
      return this.imagesList[0]
    },
    currentImage () {
      const index = this.currentImageIndex || 0
      return this.imagesList[index]
    },
  },
  watch: {
    currentImage: {
      handler (val) {
        if (val) {
          this.setMainImageName(val)
        }
      },
      immediate: true,
    },
  },
  methods: {
    setCurrentIndex (index) {
      this.currentImageIndex = index
    },
    async setMainImageName (src) {
      this.currentImageFilename = ''
      try {
        this.currentImageFilenameLoading = true
        const response = await this.$axios.head(src)
        if (response && response.statusText === 'OK') {
          const filename = response.headers[IMAGE_FILENAME_METADATA]
          this.currentImageFilename = filename
            ? decodeURIComponent(escape(window.atob(filename)))
            : ''
        }
      } catch (error) {
        this.$logger.info('error to try get filename', error)
      } finally {
        this.currentImageFilenameLoading = false
      }
    },
    async updateImages (src) {
      try {
        this.loading = true
        const images = [...this.imagesList, src]
        const input = { images }
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_INFO,
          variables: { id: this.productId, input },
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
