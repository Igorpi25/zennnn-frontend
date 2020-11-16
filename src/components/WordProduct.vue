<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="400"
    :max-width="400"
    :disabled="!imageSrc"
    :light="light"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <div v-on="on" class="inline-flex align-middle pr-2">
        <div
          class="w-7 h-7 rounded"
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
          <div v-else class="w-full h-full rounded bg-gray-600" />
        </div>
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
      <div class="h-5" />
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

export default {
  name: 'WordProduct',
  props: {
    light: Boolean,
    images: {
      type: Array,
      default: () => ([]),
    },
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
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
    setCurrentIndex (index) {
      if (!this.imagesList[index]) {
        index = 0
      }
      this.currentImageIndex = index
    },
  },
}
</script>
