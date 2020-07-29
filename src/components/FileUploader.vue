<template>
  <div :class="['relative', { 'w-8 h-8': uploadType === 'image' }]">
    <div
      ref="drop"
      :class="[
        'w-full h-full cursor-pointer overflow-hidden',
        rounded ? 'rounded-full' : 'rounded'
      ]"
      @drag.prevent.stop
      @dragstart.prevent.stop
      @dragover.prevent.stop
      @dragenter.prevent.stop="isDragOver = true"
      @dragleave.prevent.stop="dragLeave"
      @dragend.prevent.stop="isDragOver = false"
      @drop.prevent.stop="drop"
      @click="$refs.input.click()"
    >
      <slot
        name="drag"
        :loading="getUploadUrlLoading || uploadLoading || checkLoading"
        :is-drag-over="isDragOver || hovered"
      >
        <div
          v-if="!internalSrc"
          :class="[
            'w-full h-full border flex justify-center items-center',
            'hover:border-gray-150 hover:text-gray-150',
            rounded ? 'rounded-full' : 'rounded',
            isDragOver ? 'border-gray-150 border-solid text-gray-150' : 'border-dashed'
          ]"
        >
          <Icon>
            {{ icons.mdiPlusThick }}
          </Icon>
        </div>
        <div
          v-else
          :class="[
            'w-full h-full',
            rounded ? 'rounded-full' : 'rounded'
          ]"
        >
          <slot name="preview">
            <v-img
              :src="iconImageSrc"
              aspect-ratio="1"
            >
              <template v-slot:placeholder>
                <div class="flex justify-center items-center w-full h-full">
                  <Spinner />
                </div>
              </template>
            </v-img>
          </slot>
          <div
            v-if="isDragOver || hovered"
            :class="[
              'absolute inset-0 w-full h-full bg-black opacity-35',
              rounded ? 'rounded-full' : 'rounded',
              { 'border border-white border-dashed' : isDragOver }
            ]"
          />
          <div
            v-if="(isDragOver || hovered) && !(getUploadUrlLoading || uploadLoading || checkLoading)"
            class="absolute inset-0 flex justify-center items-center text-white"
          >
            <Icon :size="isDragOver ? 18 : hoveredIconSize">
              {{ isDragOver ? icons.mdiPlusThick : icons[hoveredIcon] }}
            </Icon>
          </div>
        </div>
      </slot>
    </div>
    <template v-if="getUploadUrlLoading || uploadLoading || checkLoading">
      <div
        v-if="showPreview && filePreview"
        key="preview"
        :class="[
          'absolute inset-0 flex justify-center items-center overflow-hidden',
          rounded ? 'rounded-full' : 'rounded'
        ]"
      >
        <img
          :class="['w-full h-full object-cover', rounded ? 'rounded-full' : 'rounded']"
          :src="filePreview"
        >
      </div>
      <div
        v-if="filePreview"
        key="opacity"
        :class="[
          'absolute inset-0 bg-black opacity-35 overflow-hidden cursor-wait',
          rounded ? 'rounded-full' : 'rounded'
        ]"
      />
      <div
        key="loader"
        class="absolute inset-0 flex justify-center items-center pointer-events-none"
      >
        <v-progress-circular
          :value="uploadPercentage"
          :indeterminate="checkLoading"
          size="28"
        />
      </div>
      <v-scale-transition>
        <div
          v-if="uploadLoading || checkLoading"
          key="cancel"
          class="absolute inset-0 flex justify-center items-center pointer-events-none"
        >
          <div
            class="cursor-pointer pointer-events-auto hover:text-white"
            @click="cancelUpload"
          >
            <Icon>
              {{ icons.mdiClose }}
            </Icon>
          </div>
        </div>
      </v-scale-transition>
    </template>
    <input
      ref="input"
      :accept="fileAccept"
      type="file"
      style="position:absolute; clip:rect(0,0,0,0); width:0; height:0;"
      @change="onChange"
    >
  </div>
</template>

<script>
import axios from 'axios'
import { mdiPlusThick, mdiClose, mdiMagnifyPlusOutline } from '@mdi/js'
import { GET_IMAGE_UPLOAD_URL, GET_FILE_UPLOAD_URL } from '../graphql/mutations'
import {
  ICON_IMAGE_POSTFIX,
  UPLOAD_FILE_SIZE_MB,
  IMAGE_FILENAME_METADATA,
} from '../config/globals'

export default {
  name: 'FileUploader',
  props: {
    fileAccept: {
      type: String,
      default: 'image/jpeg,image/png',
    },
    uploadType: {
      type: String,
      default: 'image',
    },
    uploading: {
      type: Boolean,
      default: false,
    },
    hovered: {
      type: Boolean,
      default: false,
    },
    hoveredIcon: {
      type: String,
      default: 'mdiMagnifyPlusOutline',
    },
    hoveredIconSize: {
      type: [String, Number],
      default: 28,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    src: {
      type: String,
      default: '',
    },
    showPreview: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    checkDownloadUrl: {
      type: Boolean,
      default: false,
    },
    checkTimeout: {
      type: Number,
      default: 300000, // 5 min
    },
    checkDelay: {
      type: Number,
      default: 1000,
    },
  },
  data () {
    return {
      internalSrc: '',
      uploadSrc: null,
      filePreview: null,
      file: null,
      files: [],
      cancelledUploads: [],
      getUploadUrlLoading: false,
      uploadLoading: false,
      checkLoading: false,
      isDragOver: false,
      icons: {
        mdiPlusThick,
        mdiClose,
        mdiMagnifyPlusOutline,
      },
      dragAndDropCapable: false,
      uploadPercentage: 0,
    }
  },

  computed: {
    iconImageSrc () {
      if (this.filePreview) return this.filePreview
      if (!this.internalSrc) return null
      return `${this.internalSrc}${ICON_IMAGE_POSTFIX}`
    },
  },

  watch: {
    src: {
      handler (val) {
        this.setImageSrc(val)
      },
      immediate: true,
    },
  },

  mounted () {
    /*
      Determine if drag and drop functionality is capable in the browser
    */
    this.dragAndDropCapable = this.determineDragAndDropCapable()
  },

  methods: {
    drop (e) {
      const files = []
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        files.push(e.dataTransfer.files[i])
      }
      this.isDragOver = false
      if (files && files.length > 0) {
        this.file = files[0]
        this.readAndUploadFile(this.file)
      }
    },
    dragLeave (e) {
      const target = e.target
      const rect = target.getBoundingClientRect()
      if (
        !(e.clientX > rect.left && e.clientX < rect.right &&
        e.clientY > rect.top && e.clientY < rect.bottom)
      ) {
        this.isDragOver = false
      }
    },
    async setImageSrc (src) {
      try {
        if (src && this.filePreview) {
          const iconSrc = `${src}${ICON_IMAGE_POSTFIX}`
          await this.loadImage(iconSrc)
        }
      } catch (error) {
        this.$logger.info('image download error: ', error)
      } finally {
        this.internalSrc = src
        this.$nextTick(() => {
          this.filePreview = null
        })
      }
    },
    loadImage (src) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          resolve(src)
        }
        image.onerror = (err) => {
          reject(err)
        }
        image.src = src
      })
    },
    cancelUpload () {
      if (!this.cancelledUploads.includes(this.uploadSrc)) {
        this.cancelledUploads.push(this.uploadSrc)
      }
      this.clearSrcCheckTimer()
      if (this.axiosSource) {
        this.axiosSource.cancel('Operation canceled by the user.')
      }
      this.filePreview = null
      this.clear()
    },
    clear () {
      this.uploadPercentage = 0
      this.getUploadUrlLoading = false
      this.uploadLoading = false
      this.checkLoading = false
      this.$refs.input.value = ''
      this.$emit('update:uploading', false)
    },
    emitSrc (src) {
      // set filePreview to internalSrc, on src update will be replced
      if (this.filePreview) {
        this.internalSrc = this.filePreview
      }
      this.$emit('update', src)
      this.clear()
    },
    /*
      Determines if the drag and drop functionality is in the
      window
    */
    determineDragAndDropCapable () {
      /*
        Create a test element to see if certain events
        are present that let us do drag and drop.
      */
      const div = document.createElement('div')
      /*
        Check to see if the `draggable` event is in the element
        or the `ondragstart` and `ondrop` events are in the element. If
        they are, then we have what we need for dragging and dropping files.
      */
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div))
    },
    onChange (e) {
      const files = e.target.files
      this.file = files[0]
      if (this.uploadType === 'image') {
        this.readAndUploadFile(this.file)
      } else {
        this.getUploadUrl(this.file)
      }
    },
    readAndUploadFile (file) {
      if (!file) return
      if (file.size > UPLOAD_FILE_SIZE_MB * 1048576) {
        this.$notify({
          color: 'warn',
          text: `Large file size. Please upload a file size less than ${UPLOAD_FILE_SIZE_MB}Mb.`,
        })
        return
      }
      this.filePreview = null
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.filePreview = fileReader.result
      })
      fileReader.readAsDataURL(file)
      this.getUploadUrl(file)
    },
    async getUploadUrl (file) {
      try {
        if (!file) return
        this.getUploadUrlLoading = true
        this.$emit('update:uploading', true)
        const mutation = this.uploadType === 'image' ? GET_IMAGE_UPLOAD_URL : GET_FILE_UPLOAD_URL
        const result = await this.$apollo.mutate({
          mutation,
          variables: {
            orgId: this.$route.params.orgId,
            filename: file.name,
          },
        })
        const { data } = result
        const uploadData = this.uploadType === 'image' ? data.getImageUploadUrl : data.getFileUploadUrl
        this.uploadSrc = uploadData.downloadUrl
        await this.upload(uploadData, file)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.getUploadUrlLoading = false
      }
    },
    async upload (uploadData, file) {
      try {
        this.uploadLoading = true
        const { uploadUrl, downloadUrl } = uploadData
        this.$logger.info('Upload file', file, uploadData)
        if (!file) return
        const filename = window.btoa(unescape(encodeURIComponent(file.name)))
        this.axiosSource = axios.CancelToken.source()
        await this.axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            [IMAGE_FILENAME_METADATA]: filename,
          },
          onUploadProgress: (progressEvent) => {
            this.uploadPercentage = Math.floor(progressEvent.loaded / progressEvent.total * 100)
          },
          cancelToken: this.axiosSource.token,
        })
        if (this.cancelledUploads.includes(downloadUrl)) return
        if (this.checkDownloadUrl) {
          this.checkLoading = true
          this.startSrcCheckTimer(downloadUrl)
        } else {
          if (this.uploadType === 'file') {
            const data = {
              filename: file.name,
              contentType: uploadData.contentType,
              url: downloadUrl,
            }
            this.$emit('uploaded', data)
            return data
          } else {
            this.emitSrc(downloadUrl)
          }
        }
        return downloadUrl
      } catch (error) {
        if (axios.isCancel(error)) {
          this.$logger.info('Request canceled', error.message)
        } else {
          throw new Error(error)
        }
      } finally {
        this.uploadPercentage = 0
        this.uploadLoading = false
        this.$emit('update:uploading', false)
        this.axiosSource = null
      }
    },
    async checkImageExists (src) {
      try {
        const response = await this.$axios.head(src)
        if (response && response.status === 200) {
          this.clearSrcCheckTimer()
          if (this.cancelledUploads.includes(src)) return
          this.emitSrc(src)
        }
      } catch (error) {
        this.$logger.info('Image head error', error)
      }
    },
    startSrcCheckTimer (src) {
      this.clearSrcCheckTimer()
      this.checkLoading = true
      this.timerId = setInterval(() => {
        this.checkImageExists(src)
        this.$logger.info('image src checking...')
      }, this.checkDelay)
      this.timeoutId = setTimeout(() => {
        this.clearSrcCheckTimer()
      }, this.checkTimeout)
    },
    clearSrcCheckTimer () {
      this.checkLoading = false
      clearInterval(this.timerId)
      clearTimeout(this.timeoutId)
      this.timerId = null
      this.timeoutId = null
    },
  },
}
</script>
