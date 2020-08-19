<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="400"
    :max-width="400"
    :disabled="!imageSrc || uploading"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div v-on="on" class="inline-block align-middle pr-2">
        <slot name="menu-activator" :is-open="menu">
          <FileUploader
            v-if="upload"
            :loading="addLoading"
            :uploading.sync="uploading"
            :src="imageSrc"
            class="w-8 h-8"
            @update="addImage"
          >
            <template v-slot:drag="{ internalSrc, isDragOver, loading }">
              <div class="w-8 h-8 rounded">
                <div
                  v-if="!internalSrc"
                  :class="[
                    'bg-gray-800 border border-dashed border-transparent w-full h-full flex justify-center items-center text-gray-300 hover:text-gray-100 rounded',
                    { 'border-gray-300': isDragOver },
                  ]"
                >
                  <i>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="0.773926" y="5.50012" width="11" height="1" stroke="currentColor"/>
                      <rect x="6.77393" y="0.500122" width="11" height="1" transform="rotate(90 6.77393 0.500122)" stroke="currentColor"/>
                    </svg>
                  </i>
                </div>
                <div
                  v-else
                  :class="[
                    'w-full h-full rounded',
                  ]"
                >
                  <v-img
                    :src="iconImageSrc"
                    aspect-ratio="1"
                    class="rounded"
                  >
                    <template v-slot:placeholder>
                      <div class="flex justify-center items-center w-full h-full">
                        <Spinner />
                      </div>
                    </template>
                  </v-img>
                  <div
                    v-if="isDragOver || menu"
                    :class="[
                      'border border-transparent border-dashed absolute inset-0 w-full h-full bg-black opacity-35 rounded',
                      { 'border-white': isDragOver },
                    ]"
                  />
                  <div
                    v-if="(isDragOver || menu) && !loading"
                    class="absolute inset-0 flex justify-center items-center text-white"
                  >
                    <i v-if="isDragOver">
                      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.773926" y="5.50012" width="11" height="1" stroke="currentColor"/>
                        <rect x="6.77393" y="0.500122" width="11" height="1" transform="rotate(90 6.77393 0.500122)" stroke="currentColor"/>
                      </svg>
                    </i>
                    <i v-else>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="9.27393" cy="9" r="8" stroke="white" stroke-width="1.6"/>
                        <rect x="5.67393" y="8.6124" width="7.2" height="0.8" fill="currentColor" stroke="white" stroke-width="0.8"/>
                        <rect x="15.5076" y="14.1488" width="5.43138" height="0.8" rx="0.4" transform="rotate(45 15.5076 14.1488)" fill="currentColor" stroke="white" stroke-width="0.8"/>
                        <rect x="9.67397" y="5.41239" width="7.2" height="0.8" transform="rotate(90 9.67397 5.41239)" fill="currentColor" stroke="white" stroke-width="0.8"/>
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </template>
          </FileUploader>
          <div
            v-else
            class="w-8 h-8 rounded inline-block"
          >
            <v-img
              v-if="imageSrc"
              :src="iconImageSrc"
              aspect-ratio="1"
              class="rounded"
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
      :class="['p-4 relative', light ? 'bg-white' : 'bg-gray-400']"
    >
      <span
        class="absolute top-0 right-0 pt-2 pr-2"
      >
        <i
          class="zi-close text-2xl text-gray-200 cursor-pointer"
          :class="[light ? 'hover:text-gray-300' : 'hover:text-gray-100']"
          @click="menu = false"
        />
      </span>
      <Sortable
        v-if="imagesList.length > 1"
        :disabled="!sortable"
        draggable=".sortable-source"
        class="inline-flex overflow-x-auto focus:outline-none space-x-2 pb-4 pr-6"
        @input="sortImages"
      >
        <v-img
          v-for="(img, i) in imagesList"
          :key="img.url"
          :src="`${img.url}${ICON_IMAGE_POSTFIX}`"
          :class="[
            'rounded h-8 w-8 sortable-source focus:outline-none border border-solid',
            i === currentImageIndex && light ? 'border-light-gray-500' : i === currentImageIndex && !light ? 'border-white' : 'border-transparent',
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
      </Sortable>
      <div v-else class="h-5" />
      <div class="w-full">
        <div class="relative">
          <div class="w-full rounded">
            <v-img
              :src="previewImageSrc"
              :key="currentImage.url"
              class="w-full rounded"
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
            class="absolute inset-x-0 top-0 h-20 rounded-t overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900-a-50 to-gray-900-a-0"
          >
            <a
              :href="`${currentImage.url}-original`"
              target="_blank"
              class="absolute right-0 top-0 pointer-events-auto cursor-pointer text-2xl text-light-gray-400 hover:text-white focus:text-white focus:outline-none pt-sm pr-sm"
            >
              <i class="zi-full-screen" />
            </a>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-20 rounded-b overflow-hidden pointer-events-none text-gray-100">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900-a-50 to-gray-900-a-0" />
            <div v-if="imagesList.length > 1" class="absolute inset-x-0 bottom-0 text-center leading-tight pb-2">
              <span class="text-white">{{ currentImageIndex + 1 }}</span> / <span>{{ imagesList.length }}</span>
            </div>
          </div>
          <div
            v-if="imagesList.length > 1"
            class="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center justify-between p-2"
          >
            <div
              :class="[
                'h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto',
                hasPrev ? 'cursor-pointer text-blue-500 hover:text-blue-600' : 'text-gray-200',
              ]"
              @click="prev"
            >
              <i class="zi-arrow-left text-2xl" />
            </div>
            <div
              :class="[
                'h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto',
                hasNext ? 'cursor-pointer text-blue-500 hover:text-blue-600' : 'text-gray-200',
              ]"
              @click="next"
            >
              <i class="zi-arrow-right text-2xl" />
            </div>
          </div>
        </div>
        <div :class="['font-semibold pt-4 pb-1', light ? 'text-gray-900' : 'text-white']">
          {{ currentImage.filename || currentImage.url }}
        </div>
      </div>
    </div>
  </v-menu>
</template>

<script>
import { ICON_IMAGE_POSTFIX, PREVIEW_IMAGE_POSTFIX } from '../config/globals'
import { ADD_PRODUCT_IMAGE, UPDATE_PRODUCT_INFO } from '../graphql/mutations'

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
    currentIndex: {
      type: Number,
      default: -1,
    },
    upload: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
    sortable: Boolean,
    light: Boolean,
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
      uploading: false,
      addLoading: false,
      updateImagesLoading: false,
      menu: false,
      currentImageFilename: '',
      currentImageIndex: 0,
    }
  },
  computed: {
    hasPrev () {
      return this.currentImageIndex > 0
    },
    hasNext () {
      return this.currentImageIndex + 1 < this.imagesList.length
    },
    imagesList () {
      return this.images || []
    },
    imageSrc () {
      return this.imagesList[0] && this.imagesList[0].url
    },
    previewImageSrc () {
      if (!this.currentImage.url) return ''
      return `${this.currentImage.url}${PREVIEW_IMAGE_POSTFIX}`
    },
    iconImageSrc () {
      if (!this.imageSrc) return ''
      return `${this.imageSrc}${ICON_IMAGE_POSTFIX}`
    },
    currentImage () {
      const index = this.currentImageIndex || 0
      return this.imagesList[index] || {}
    },
  },
  watch: {
    menu (val) {
      if (val && this.currentIndex > -1) {
        this.currentImageIndex = this.currentIndex
      }
    },
    imagesList (val) {
      if (!val) return
      if (this.currentImageIndex + 1 > val.length) {
        this.setCurrentIndex(0)
      }
    },
  },
  methods: {
    // openPS (index) {
    //   const pswpElement = document.querySelector('.pswp')
    //   const items = this.imagesList.map(el => {
    //     return {
    //       src: `${el.url}`,
    //       w: 768,
    //       h: 768,
    //       title: el.filename || el.url,
    //     }
    //   })
    //   const options = {
    //     index,
    //     // getThumbBoundsFn: (index) => {
    //     //   // See Options -> getThumbBoundsFn section of documentation for more info
    //     //   const thumbnail = items[index].el.getElementsByTagName('img')[0] // find thumbnail
    //     //   const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
    //     //   const rect = thumbnail.getBoundingClientRect()
    //     //   return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
    //     // },
    //     history: false,
    //     // Buttons/elements
    //     closeEl: true,
    //     captionEl: true,
    //     fullscreenEl: true,
    //     zoomEl: true,
    //     shareEl: false,
    //     counterEl: true,
    //     arrowEl: true,
    //     preloaderEl: true,
    //     // Tap on sliding area should close gallery
    //     tapToClose: true,
    //     // PhotoSwipe element opacity and image scale will be animated
    //     showHideOpacity: true,
    //   }
    //   // Pass data to PhotoSwipe and initialize it
    //   this.photoswipe = new PhotoSwipe(
    //     pswpElement,
    //     PhotoSwipeUIDefault,
    //     items,
    //     options,
    //   )
    //   this.photoswipe.init()
    // },
    prev () {
      if (this.imagesList.length === 0) return
      const val = this.currentImageIndex - 1
      if (val > -1) {
        this.currentImageIndex = val
      }
    },
    next () {
      if (this.imagesList.length === 0) return
      const val = this.currentImageIndex + 1
      if (val < this.imagesList.length) {
        this.currentImageIndex = val
      }
    },
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
        const input = {
          images: (images || []).map(el => {
            return {
              filename: el.filename,
              contentType: el.contentType,
              url: el.url,
            }
          }),
        }
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
