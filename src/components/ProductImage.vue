<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="380"
    :max-width="380"
    :disabled="!previewImage || uploading"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div v-on="on" class="inline-block pr-2">
        <slot name="menu-activator">
          <FileUploader
            v-if="upload"
            :loading="loading"
            :uploading.sync="uploading"
            :hovered="menu"
            :src="previewImage"
            show-preview
            check-download-url
            @update="addImage"
          />
          <div
            v-else
            class="w-10 h-10 rounded overflow-hidden inline-block"
          >
            <v-img
              v-if="previewImage"
              :src="iconImageSrc"
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
      :class="[light ? 'bg-paper' : 'bg-gray-darker']"
    >
      <div class="text-accent2 truncate h-8 px-1 flex items-center">
        <div class="flex-grow truncate">
          <Spinner v-if="currentImageFilenameLoading" />
          <span v-else>
            {{ currentImageFilename || currentImage }}
          </span>
        </div>
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
            'rounded-sm h-8 w-8',
            { 'mr-1' : i + 1 < imagesList.length },
            { 'border border-solid border-white': i === currentImageIndex },
          ]"
          :gradient="i !== currentImageIndex ? '0deg, rgba(0,0,0,.3), rgba(0,0,0,.3)' : ''"
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
      <div class="w-full p-1 relative">
        <div class="w-full rounded overflow-hidden">
          <v-img
            :src="previewImageSrc"
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
        <div
          v-if="removable"
          class="absolute inset-x-0 top-0 h-20 m-1 rounded-t overflow-hidden pointer-event-none"
          style="background: linear-gradient(0deg, rgba(30, 30, 30, 0) 0%, rgba(30, 30, 30, 0.56) 100%);"
        >
          <div
            class="absolute pointer-events-auto cursor-pointer"
            style="top:12px; right:12px"
            @click="removeImage(currentImage)"
          >
            <Icon color="#c1c1c1" size="22">{{ icons.mdiTrashCanOutline }}</Icon>
          </div>
        </div>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { mdiTrashCanOutline } from '@mdi/js'
import { ADD_PRODUCT_IMAGE, REMOVE_PRODUCT_IMAGE } from '../graphql/mutations'

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
    removable: {
      type: Boolean,
      default: true,
    },
    light: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
      uploading: false,
      loading: false,
      removeLoading: null,
      menu: false,
      currentImageFilenameLoading: false,
      currentImageFilename: '',
      currentImageIndex: 0,
      icons: {
        mdiTrashCanOutline,
      },
    }
  },
  computed: {
    imagesList () {
      return this.images || []
    },
    previewImage () {
      return this.imagesList[0]
    },
    previewImageSrc () {
      if (!this.currentImage) return ''
      return `${this.currentImage}${PREVIEW_IMAGE_POSTFIX}`
    },
    iconImageSrc () {
      if (!this.currentImage) return ''
      return `${this.previewImage}${ICON_IMAGE_POSTFIX}`
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
      if (!this.imagesList[index]) {
        index = 0
      }
      this.currentImageIndex = index
    },
    async setMainImageName (src) {
      const s3Src = src.replace(process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME, process.env.VUE_APP_S3_IMAGE_DOWNLOAD_HOSTNAME)
      this.currentImageFilename = ''
      try {
        this.currentImageFilenameLoading = true
        const response = await this.$axios.head(s3Src)
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
    async removeImage (src) {
      try {
        this.removeLoading = src
        const inputImages = [src]
        await this.$apollo.mutate({
          mutation: REMOVE_PRODUCT_IMAGE,
          variables: { id: this.productId, inputImages },
        })
        const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : 0
        this.setCurrentIndex(newIndex)
      } catch (error) {
        this.$logger.warn('Error: ', error)
        // Analytics.record({
        //   name: 'UpdateProductError',
        //   attributes: {
        //     error: error
        //   }
        // })
      } finally {
        this.removeLoading = null
      }
    },
    async addImage (src) {
      try {
        this.loading = true
        const inputImages = [src]
        await this.$apollo.mutate({
          mutation: ADD_PRODUCT_IMAGE,
          variables: { id: this.productId, inputImages, unshift: true },
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

<style>
.bg-paper {
  background-color: #f4f4f4;
}
</style>
