<template>
  <div class="w-9 h-9 relative">
    <div
      ref="drop"
      :class="[
        'w-full h-full cursor-pointer overflow-hidden rounded',
      ]"
      @click="$refs.input.click()"
    >
      <div
        v-if="!internalSrc"
        :class="[
          'w-full h-full border rounded flex justify-center items-center',
          'hover:border-gray-lighter hover:text-gray-lighter',
          isDragOver ? 'border-gray-lighter border-solid text-gray-lighter' : 'border-dashed'
        ]"
      >
        <Icon>
          {{ icons.mdiPlusThick }}
        </Icon>
      </div>
      <div
        v-else
        :class="[
          'w-full h-full rounded',
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
          class="absolute inset-0 w-full h-full bg-black opacity-35"
        />
        <div
          v-if="(hovered) && !(getUploadUrlLoading || uploadLoading || checkLoading)"
          class="absolute inset-0 flex justify-center items-center text-white"
        >
          <Icon size="28">
            {{ icons.mdiMagnifyPlusOutline }}
          </Icon>
        </div>
      </div>
    </div>
    <template v-if="getUploadUrlLoading || uploadLoading || checkLoading">
      <div
        v-if="showPreview && filePreview"
        key="preview"
        class="absolute inset-0 flex justify-center items-center overflow-hidden rounded"
      >
        <img
          class="w-full h-full rounded object-cover"
          :src="filePreview"
        >
      </div>
      <div
        v-if="filePreview"
        key="opacity"
        class="absolute inset-0 bg-black opacity-35 overflow-hidden rounded cursor-wait"
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
      type="file"
      accept="image/jpeg,image/png"
      style="position:absolute;clip: rect(0,0,0,0);"
      @change="onChange"
    >
  </div>
</template>

<script>
import axios from 'axios'
import { mdiPlusThick, mdiClose, mdiMagnifyPlusOutline } from '@mdi/js'
import { GET_IMAGE_UPLOAD_URL } from '../graphql/mutations'
import {
  ICON_IMAGE_POSTFIX,
  UPLOAD_FILE_SIZE_MB,
  IMAGE_FILENAME_METADATA,
} from '../config/globals'

export default {
  name: 'FileUploader',
  props: {
    uploading: {
      type: Boolean,
      default: false,
    },
    hovered: {
      type: Boolean,
      default: false,
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

    /*
      If drag and drop capable, then we continue to bind events to our elements.
    */
    if (this.dragAndDropCapable) {
      this.$refs.drop.addEventListener('drag', (e) => {
        e.preventDefault()
        e.stopPropagation()
      }, false)
      this.$refs.drop.addEventListener('dragstart', (e) => {
        e.preventDefault()
        e.stopPropagation()
      }, false)
      this.$refs.drop.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.isDragOver = true
      }, false)
      this.$refs.drop.addEventListener('dragenter', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.isDragOver = true
      }, false)
      this.$refs.drop.addEventListener('dragleave', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.isDragOver = false
      }, false)
      this.$refs.drop.addEventListener('dragend', (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.isDragOver = false
      }, false)

      /*
        Add an event listener for drop to the form
      */
      this.$refs.drop.addEventListener('drop', (e) => {
        /*
          Capture the files from the drop event and add them to our local files
          array.
        */
        e.preventDefault()
        e.stopPropagation()
        let files = []
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          files.push(e.dataTransfer.files[i])
        }
        this.isDragOver = false
        if (files && files.length > 0) {
          this.file = files[0]
          this.readAndUploadFile(this.file)
        }
      })
    }
  },

  methods: {
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
      this.readAndUploadFile(this.file)
    },
    readAndUploadFile (file) {
      if (!file) return
      if (file.size > UPLOAD_FILE_SIZE_MB * 1048576) {
        this.$notify({
          color: 'orange',
          text: `Large file size. Please upload a file size less than ${UPLOAD_FILE_SIZE_MB}Mb.`,
          timeout: 10000,
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
        const result = await this.$apollo.mutate({
          mutation: GET_IMAGE_UPLOAD_URL,
          variables: {
            orgId: this.$route.params.orgId,
            filename: file.name,
          },
        })
        const { data: { getImageUploadUrl } } = result
        this.uploadSrc = getImageUploadUrl.downloadUrl
        await this.upload(getImageUploadUrl, file)
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
          this.emitSrc(downloadUrl)
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
    async checkImageExists (s3Src, src) {
      try {
        const response = await this.$axios.head(s3Src)
        if (response && response.statusText === 'OK') {
          this.clearSrcCheckTimer()
          if (this.cancelledUploads.includes(src)) return
          this.emitSrc(src)
        }
      } catch (error) {
        this.$logger.info('Image head error', error)
      }
    },
    startSrcCheckTimer (src) {
      const s3Src = src.replace(process.env.VUE_APP_IMAGE_DOWNLOAD_HOSTNAME, process.env.VUE_APP_S3_IMAGE_DOWNLOAD_HOSTNAME)
      this.clearSrcCheckTimer()
      this.checkLoading = true
      this.timerId = setInterval(() => {
        this.checkImageExists(s3Src, src)
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
