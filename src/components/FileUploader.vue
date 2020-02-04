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
        v-if="!src"
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
          { 'bg-black opacity-35': isDragOver },
        ]"
      >
        <slot name="preview">
          <div class="w-full h-full bg-gray-lighter"></div>
        </slot>
      </div>
    </div>
    <template v-if="uploadLoading || checkLoading">
      <div
        v-if="showPreview && internalSrc"
        key="preview"
        class="absolute inset-0 flex justify-center items-center overflow-hidden rounded"
      >
        <img
          class="w-full h-full rounded object-cover"
          :src="internalSrc"
        >
      </div>
      <div
        v-if="internalSrc"
        key="opacity"
        class="absolute inset-0 bg-black opacity-35 overflow-hidden rounded cursor-wait"
      />
      <div
        key="loader"
        class="absolute inset-0 flex justify-center items-center"
      >
        <v-progress-circular
          :value="uploadPercentage"
          :indeterminate="checkLoading"
          size="28"
        />
      </div>
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
import { mdiPlusThick } from '@mdi/js'
import { GET_IMAGE_UPLOAD_URL } from '../graphql/mutations'
import {
  ICON_IMAGE_POSTFIX,
  UPLOAD_FILE_SIZE_MB,
  IMAGE_FILENAME_METADATA,
} from '../config/globals'

export default {
  name: 'FileUploader',
  props: {
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
      default: 120000, // 2 min
    },
    checkDelay: {
      type: Number,
      default: 1000,
    },
  },
  data () {
    return {
      internalSrc: null,
      file: null,
      files: [],
      uploadLoading: false,
      checkLoading: false,
      isDragOver: false,
      icons: {
        mdiPlusThick,
      },
      dragAndDropCapable: false,
      uploadPercentage: 0,
    }
  },

  computed: {
    iconImage () {
      if (!this.src) return null
      return `${this.src}${ICON_IMAGE_POSTFIX}`
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
    clear () {
      this.internalSrc = null
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
      this.internalSrc = null
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.internalSrc = fileReader.result
      })
      fileReader.readAsDataURL(file)
      this.getUploadUrl(file)
    },
    async getUploadUrl (file) {
      try {
        if (!file) return
        this.uploadLoading = true
        const result = await this.$apollo.mutate({
          mutation: GET_IMAGE_UPLOAD_URL,
          variables: {
            orgId: this.$route.params.orgId,
            filename: file.name,
          },
        })
        const { data: { getImageUploadUrl } } = result
        await this.upload(getImageUploadUrl, file)
      } catch (error) {
        throw new Error(error)
      }
    },
    async upload (uploadData, file) {
      try {
        this.uploadLoading = true
        const { uploadUrl, downloadUrl } = uploadData
        this.$logger.info('Upload file', file, uploadData)
        if (!file) return
        const filename = window.btoa(unescape(encodeURIComponent(file.name)))
        await this.axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            [IMAGE_FILENAME_METADATA]: filename,
          },
          onUploadProgress: (progressEvent) => {
            this.uploadPercentage = Math.floor(progressEvent.loaded / progressEvent.total * 100)
          },
        })
        if (this.checkDownloadUrl) {
          this.checkLoading = true
          this.startSrcCheckTimer(downloadUrl)
        } else {
          this.$emit('update', downloadUrl)
        }
        return downloadUrl
      } catch (error) {
        throw new Error(error)
      } finally {
        this.uploadPercentage = 0
        this.uploadLoading = false
      }
    },
    async checkImageExists (src) {
      try {
        const response = await this.$axios.head(src)
        if (response && response.statusText === 'OK') {
          this.clearSrcCheckTimer()
          this.$emit('update', src)
        }
      } catch (error) {
        this.$logger.info('Image head error', error)
      }
    },
    startSrcCheckTimer (src) {
      const s3Src = src.replace(process.env.VIE_APP_IMAGE_DOWNLOAD_HOSTNAME, process.env.VIE_APP_S3_IMAGE_DOWNLOAD_HOSTNAME)
      this.clearSrcCheckTimer()
      this.checkLoading = true
      this.timerId = setInterval(() => {
        this.checkImageExists(s3Src)
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
