import axios, { CancelTokenSource } from 'axios'
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  Transition,
} from 'vue'
import { useRoute } from 'vue-router'
import { ziCloseDelete, ziPlus } from '@zennnn/icons'
import { Icon, Progress, Btn } from '@zennnn/core'
import { useRender } from 'shared/composables/render'
import { ICON_IMAGE_POSTFIX, UPLOAD_FILE_SIZE_MB } from 'shared/config'
import { auth, logger, useNotify } from '@/plugins'

export default defineComponent({
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

  emits: ['update', 'update:uploading', 'upload-start', 'uploaded'],

  setup(props, { emit, slots }) {
    const route = useRoute()
    const notify = useNotify()

    let axiosSource: CancelTokenSource | null = null
    const inputRef = ref<HTMLInputElement>()
    const internalSrc = ref<string | null>('')
    const filePreview = ref<string | null>(null)
    const file = ref<File | null>(null)
    const getUploadUrlLoading = ref(false)
    const uploadLoading = ref(false)
    const isDragOver = ref(false)
    const dragAndDropCapable = ref(false)
    const uploadPercentage = ref(0)

    const showPreview = computed(() => props.uploadType === 'image')

    watch(
      () => props.src,
      (val) => {
        setImageSrc(val)
      },
      {
        immediate: true,
      }
    )

    onMounted(() => {
      /*
        Determine if drag and drop functionality is capable in the browser
      */
      dragAndDropCapable.value = determineDragAndDropCapable()
    })

    function onDrop(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer?.files) return
      const files = Array.from(e.dataTransfer!.files)
      isDragOver.value = false
      if (files && files.length > 0) {
        file.value = files[0]
        readAndUploadFile(file.value)
      }
    }

    function onDragenter(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      isDragOver.value = true
    }

    function onDragleave(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      const target = e.target
      const rect = (target as HTMLElement).getBoundingClientRect()
      if (
        !(
          e.clientX > rect.left &&
          e.clientX < rect.right &&
          e.clientY > rect.top &&
          e.clientY < rect.bottom
        )
      ) {
        isDragOver.value = false
      }
    }

    function onDragend(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      isDragOver.value = false
    }

    async function setImageSrc(src: string) {
      try {
        if (src && filePreview.value) {
          const iconSrc = `${src}${ICON_IMAGE_POSTFIX}`
          await loadImage(iconSrc)
        }
      } catch (error) {
        logger.info('image download error: ', error)
      } finally {
        internalSrc.value = src
        nextTick(() => {
          filePreview.value = null
        })
      }
    }

    function loadImage(src: string) {
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
    }

    function cancelUpload() {
      if (axiosSource) {
        axiosSource.cancel('Operation canceled by the user.')
      }
      filePreview.value = null
      clear()
    }

    function clear() {
      uploadPercentage.value = 0
      getUploadUrlLoading.value = false
      uploadLoading.value = false
      inputRef.value!.value = ''
      emit('update:uploading', false)
    }

    function emitSrc(data: any) {
      // set filePreview to internalSrc, on src update will be replced
      if (filePreview.value) {
        internalSrc.value = filePreview.value
      }
      emit('update', data)
      clear()
    }

    /*
      Determines if the drag and drop functionality is in the
      window
    */
    function determineDragAndDropCapable() {
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
      return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
    }

    function onChange(e: Event) {
      const files = (e.target as HTMLInputElement).files
      file.value = files?.[0] ?? null
      if (props.uploadType === 'image') {
        readAndUploadFile(file.value)
      } else {
        getUploadUrl(file.value)
      }
    }

    function readAndUploadFile(file: File | null) {
      if (!file) return
      if (file.size > UPLOAD_FILE_SIZE_MB * 1048576) {
        notify.warn(
          `Large file size. Please upload a file size less than ${UPLOAD_FILE_SIZE_MB}Mb.`
        )
        return
      }
      filePreview.value = null
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        filePreview.value = fileReader.result as any
      })
      fileReader.readAsDataURL(file)
      getUploadUrl(file)
    }

    async function getUploadUrl(file: File | null) {
      try {
        if (!file) return
        getUploadUrlLoading.value = true
        emit('update:uploading', true)
        emit('upload-start', true)
        await upload(file)
      } catch (error) {
        throw new Error(error)
      } finally {
        getUploadUrlLoading.value = false
      }
    }

    async function upload(file: File | null) {
      let token = null
      try {
        const session = await auth.currentSession()
        token = session.getIdToken().getJwtToken()
      } catch (error) {} // eslint-disable-line

      try {
        uploadLoading.value = true
        logger.info('Upload file', file)
        if (!file) return
        axiosSource = axios.CancelToken.source()
        const uploadUrl = process.env.VUE_APP_UPLAOD_ENDPOINT as string
        const formData = new FormData()
        formData.append('file', file)
        const response = await axios.put(uploadUrl, formData, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
          params: {
            org_id: route.params.orgId,
          },
          onUploadProgress: (progressEvent) => {
            const ratio = progressEvent.loaded / progressEvent.total
            if (props.uploadType === 'image') {
              const percent = Math.ceil(ratio * 100)
              uploadPercentage.value = percent > 97 ? 97 : percent
            } else {
              uploadPercentage.value = Math.ceil(ratio * 100)
            }
          },
          cancelToken: axiosSource.token,
        })
        const data = response && response.data
        if (!data) throw new Error('Upload error.')
        uploadPercentage.value = 100
        logger.info('Upload response', data)
        if (props.uploadType === 'file') {
          emit('uploaded', data)
          return data
        } else {
          emitSrc(data)
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          logger.info('Request canceled', error.message)
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message
        ) {
          notify.error(error.response.data.error.message)
        } else {
          notify.error(error.message)
          throw new Error(error)
        }
      } finally {
        uploadPercentage.value = 0
        uploadLoading.value = false
        emit('update:uploading', false)
        axiosSource = null
      }
    }

    function preventStop(e: Event) {
      e.preventDefault()
      e.stopPropagation()
    }

    useRender(() => (
      <div class="relative">
        <div
          class={[
            'w-full h-full cursor-pointer overflow-hidden',
            props.rounded ? 'rounded-full' : 'rounded',
          ]}
          onDrag={preventStop}
          onDragstart={preventStop}
          onDragover={preventStop}
          onDragenter={onDragenter}
          onDragleave={onDragleave}
          onDragend={onDragend}
          onDrop={onDrop}
          onClick={() => {
            inputRef.value?.click()
          }}
        >
          {slots.drag
            ? slots.drag({
                loading: getUploadUrlLoading.value || uploadLoading.value,
                isDragOver: isDragOver.value,
                internalSrc: internalSrc.value,
              })
            : !internalSrc.value && (
                <div
                  class={[
                    'bg-gray-800 w-full h-full border border-dashed border-transparent flex justify-center items-center text-gray-300 hover:text-gray-100',
                    { 'border-gray-300': isDragOver },
                    props.rounded ? 'rounded-full' : 'rounded',
                  ]}
                >
                  <Icon>{ziPlus}</Icon>
                </div>
              )}
        </div>
        {(getUploadUrlLoading.value || uploadLoading.value) && (
          <>
            {showPreview.value && filePreview.value && (
              <div
                key="preview"
                class={[
                  'absolute inset-0 flex justify-center items-center overflow-hidden',
                  props.rounded ? 'rounded-full' : 'rounded',
                ]}
              >
                <img
                  class={[
                    'w-full h-full object-cover',
                    props.rounded ? 'rounded-full' : 'rounded',
                  ]}
                  src={filePreview.value}
                />
              </div>
            )}
            {filePreview.value && (
              <div
                key="opacity"
                class={[
                  'absolute inset-0 bg-black opacity-30 overflow-hidden cursor-wait',
                  props.rounded ? 'rounded-full' : 'rounded',
                ]}
              />
            )}
            <div
              key="loader"
              class="absolute inset-0 flex justify-center items-center pointer-events-none"
            >
              <Progress value={uploadPercentage.value} size="28" />
            </div>
            <Transition name="scale-transition">
              {uploadLoading.value && (
                <div
                  key="cancel"
                  class="absolute inset-0 flex justify-center items-center pointer-events-none"
                >
                  <Btn
                    icon
                    mini
                    text
                    class="text-gray-200 pointer-events-auto"
                    {...{ onClick: cancelUpload }}
                  >
                    <Icon>{ziCloseDelete}</Icon>
                  </Btn>
                </div>
              )}
            </Transition>
          </>
        )}
        <input
          ref={inputRef}
          accept={props.fileAccept}
          type="file"
          style="position: absolute; clip: rect(0, 0, 0, 0); width: 0; height: 0"
          onChange={onChange}
        />
      </div>
    ))

    return {
      internalSrc,
      filePreview,
    }
  },
})
