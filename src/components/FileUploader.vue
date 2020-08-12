<template>
  <div class="relative">
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
        :loading="getUploadUrlLoading || uploadLoading"
        :is-drag-over="isDragOver"
        :internal-src="internalSrc"
      >
        <div
          v-if="!internalSrc"
          :class="[
            'bg-gray-800 w-full h-full border border-dashed border-transparent flex justify-center items-center text-gray-300 hover:text-gray-100',
            { 'border-gray-300': isDragOver },
            rounded ? 'rounded-full' : 'rounded',
          ]"
        >
          <i>
            <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.773926" y="5.50012" width="11" height="1" stroke="currentColor"/>
              <rect x="6.77393" y="0.500122" width="11" height="1" transform="rotate(90 6.77393 0.500122)" stroke="currentColor"/>
            </svg>
          </i>
        </div>
      </slot>
    </div>
    <template v-if="getUploadUrlLoading || uploadLoading">
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
          size="28"
        />
      </div>
      <v-scale-transition>
        <div
          v-if="uploadLoading"
          key="cancel"
          class="absolute inset-0 flex justify-center items-center pointer-events-none"
        >
          <i
            class="zi-close text-2xl cursor-pointer pointer-events-auto hover:text-white"
            @click="cancelUpload"
          />
        </div>
      </v-scale-transition>
    </template>
    <input
      ref="input"
      :accept="fileAccept"
      type="file"
      style="position: absolute; clip: rect(0,0,0,0); width: 0; height: 0;"
      @change="onChange"
    >
  </div>
</template>

<script>
import axios from 'axios'
import {
  ICON_IMAGE_POSTFIX,
  UPLOAD_FILE_SIZE_MB,
} from '../config/globals'
import { Auth } from '../plugins'

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
    loading: {
      type: Boolean,
      default: true,
    },
    src: {
      type: String,
      default: '',
    },
    rounded: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      internalSrc: '',
      filePreview: null,
      file: null,
      files: [],
      getUploadUrlLoading: false,
      uploadLoading: false,
      isDragOver: false,
      dragAndDropCapable: false,
      uploadPercentage: 0,
    }
  },

  computed: {
    showPreview () {
      return this.uploadType === 'image'
    },
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
      this.$refs.input.value = ''
      this.$emit('update:uploading', false)
    },
    emitSrc (data) {
      // set filePreview to internalSrc, on src update will be replced
      if (this.filePreview) {
        this.internalSrc = this.filePreview
      }
      this.$emit('update', data)
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
        await this.upload(file)
      } catch (error) {
        throw new Error(error)
      } finally {
        this.getUploadUrlLoading = false
      }
    },
    async upload (file) {
      let token = null
      try {
        const session = await Auth.currentSession()
        token = session.getIdToken().getJwtToken()
      } catch (error) {} // eslint-disable-line

      try {
        this.uploadLoading = true
        this.$logger.info('Upload file', file)
        if (!file) return
        this.axiosSource = axios.CancelToken.source()
        const uploadUrl = process.env.VUE_APP_UPLAOD_ENDPOINT
        const formData = new FormData()
        formData.append('file', file)
        const response = await this.axios.put(uploadUrl, formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          params: {
            org_id: this.$route.params.orgId,
          },
          onUploadProgress: (progressEvent) => {
            const ratio = progressEvent.loaded / progressEvent.total
            if (this.uploadType === 'image') {
              const percent = Math.ceil(ratio * 100)
              this.uploadPercentage = percent > 97 ? 97 : percent
            } else {
              this.uploadPercentage = Math.ceil(ratio * 100)
            }
          },
          cancelToken: this.axiosSource.token,
        })
        const data = response && response.data
        if (!data) throw new Error('Upload error.')
        this.uploadPercentage = 100
        this.$logger.info('Upload response', data)
        if (this.uploadType === 'file') {
          this.$emit('uploaded', data)
          return data
        } else {
          this.emitSrc(data)
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          this.$logger.info('Request canceled', error.message)
        } else if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
          this.$notify({
            color: 'error',
            text: error.response.data.error.message,
          })
        } else {
          this.$notify({
            color: 'error',
            text: error.message,
          })
          throw new Error(error)
        }
      } finally {
        this.uploadPercentage = 0
        this.uploadLoading = false
        this.$emit('update:uploading', false)
        this.axiosSource = null
      }
    },
  },
}
</script>
