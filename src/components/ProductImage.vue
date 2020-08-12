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
      <div v-on="on" class="inline-block align-middle pr-2">
        <slot name="menu-activator">
          <FileUploader
            v-if="upload"
            :loading="addLoading"
            :uploading.sync="uploading"
            :hovered="menu"
            :src="previewImage"
            show-preview
            @update="addImage"
          />
          <div
            v-else
            class="w-8 h-8 rounded overflow-hidden inline-block"
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
      :class="[light ? 'bg-white' : 'bg-gray-400']"
    >
      <div class="text-gray-200 truncate h-8 px-1 flex items-center">
        <div class="flex-grow truncate">
          <Spinner v-if="currentImageFilenameLoading" />
          <span v-else>
            {{ currentImage.filename || currentImage.url }}
          </span>
        </div>
      </div>
      <Sortable
        v-if="imagesList.length > 1"
        :disabled="!sortable"
        draggable=".sortable-source"
        class="inline-flex px-1 overflow-x-auto"
        @input="sortImages"
      >
        <v-img
          v-for="(img, i) in imagesList"
          :key="img.url"
          :src="`${img.url}${ICON_IMAGE_POSTFIX}`"
          :class="[
            'rounded-sm h-8 w-8 mr-1 sortable-source focus:outline-none',
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
      </Sortable>
      <div class="w-full p-1 relative">
        <div class="w-full rounded overflow-hidden">
          <v-img
            :src="previewImageSrc"
            :key="currentImage.url"
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
          class="absolute inset-x-0 top-0 h-20 m-1 rounded-t overflow-hidden pointer-event-none bg-gradient-dark-half"
        >
          <a
            class="absolute right-0 top-0 pointer-events-auto cursor-pointer text-2xl text-gray-200 hover:text-gray-100 focus:text-gray-100 focus:outline-none pt-sm pr-sm"
            @click.prevent="removeImage(currentImage)"
          >
            <i class="zi-delete" />
          </a>
        </div>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { ICON_IMAGE_POSTFIX, PREVIEW_IMAGE_POSTFIX } from '../config/globals'
import { ADD_PRODUCT_IMAGE, REMOVE_PRODUCT_IMAGE, UPDATE_PRODUCT_INFO } from '../graphql/mutations'

import Sortable from '../plugins/draggable/Sortable'
import FileUploader from '../components/FileUploader.vue'

export default {
  name: 'ProductImage',
  components: {
    Sortable,
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
    sortable: {
      type: Boolean,
      default: false,
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
      addLoading: false,
      updateImagesLoading: false,
      removeLoading: null,
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
      return this.imagesList[0] && this.imagesList[0].url
    },
    previewImageSrc () {
      if (!this.currentImage) return ''
      return `${this.currentImage.url}${PREVIEW_IMAGE_POSTFIX}`
    },
    iconImageSrc () {
      if (!this.previewImage) return ''
      return `${this.previewImage.url}${ICON_IMAGE_POSTFIX}`
    },
    currentImage () {
      const index = this.currentImageIndex || 0
      return this.imagesList[index] || {}
    },
  },
  methods: {
    sortImages (data) {
      if (data.oldContainer.id !== data.newContainer.id) return
      const oldIndex = data.oldIndex
      const newIndex = data.newIndex
      if (oldIndex === newIndex) return
      const newValue = this.imagesList.slice()
      newValue.splice(newIndex, 0, newValue.splice(oldIndex, 1)[0])
      this.updateImages(newValue)
    },
    setCurrentIndex (index) {
      if (!this.imagesList[index]) {
        index = 0
      }
      this.currentImageIndex = index
    },
    async updateImages (images) {
      try {
        this.updateImagesLoading = true
        const input = { images }
        await this.$apollo.mutate({
          mutation: UPDATE_PRODUCT_INFO,
          variables: { id: this.productId, input },
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.updateImagesLoading = false
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
        const newIndex = this.currentImageIndex > 0 ? this.currentImageIndex - 1 : 0
        this.setCurrentIndex(newIndex)
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.removeLoading = null
      }
    },
    async addImage (file) {
      try {
        this.addLoading = true
        const inputImages = [file]
        await this.$apollo.mutate({
          mutation: ADD_PRODUCT_IMAGE,
          variables: { id: this.productId, inputImages, unshift: true },
        })
      } catch (error) {
        this.$logger.warn('Error: ', error)
      } finally {
        this.addLoading = false
      }
    },
  },
}
</script>
