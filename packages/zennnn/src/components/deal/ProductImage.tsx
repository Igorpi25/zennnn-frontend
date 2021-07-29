import { defineComponent, ref, computed, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import {
  ziCloseWindow,
  ziFullScreen,
  ziArrowLeft,
  ziArrowRight,
} from '@zennnn/icons'
import { Icon, Menu, Image, LoadingSpinner } from '@zennnn/core'
import { ICON_IMAGE_POSTFIX, PREVIEW_IMAGE_POSTFIX } from 'shared/config'
import { ADD_PRODUCT_IMAGE, UPDATE_PRODUCT_INFO } from '@/graphql/mutations'
import Sortable from '@/components/draggable/Sortable'
import FileUploader from '@/components/core/FileUploader'

import type { PropType } from 'vue'
import type {
  AddProductImage,
  AddProductImageVariables,
  UpdateProductInfo,
  UpdateProductInfoVariables,
  AttachFileInput,
} from '@/graphql/types'

export default defineComponent({
  props: {
    productId: String,
    images: Array as PropType<any>,
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
    caption: String as PropType<string | null>,
  },

  emits: ['upload-start'],

  setup(props, { emit, slots }) {
    const uploading = ref(false)
    const addLoading = ref(false)
    const updateImagesLoading = ref(false)
    const menu = ref(false)
    const currentImageIndex = ref(0)

    const imagesList = computed(() => (props.images || []) as any[])

    const hasPrev = computed(() => currentImageIndex.value > 0)

    const hasNext = computed(
      () => currentImageIndex.value + 1 < imagesList.value.length
    )

    const imageSrc = computed(
      () => imagesList.value[0] && imagesList.value[0].url
    )

    const previewImageSrc = computed(() => {
      if (!currentImage.value.url) return ''
      return `${currentImage.value.url}${PREVIEW_IMAGE_POSTFIX}`
    })

    const iconImageSrc = computed(() => {
      if (!imageSrc.value) return ''
      return `${imageSrc.value}${ICON_IMAGE_POSTFIX}`
    })

    const currentImage = computed(() => {
      const index = currentImageIndex.value || 0
      return imagesList.value[index] || {}
    })

    watch(menu, (val) => {
      if (val && props.currentIndex > -1) {
        currentImageIndex.value = props.currentIndex
      }
    })

    watch(imagesList, (val) => {
      if (!val) return
      if (currentImageIndex.value + 1 > val.length) {
        setCurrentIndex(0)
      }
    })

    const { mutate: addProductImageMutate } = useMutation<
      AddProductImage,
      AddProductImageVariables
    >(ADD_PRODUCT_IMAGE)

    const { mutate: updateProductInfoMutate } = useMutation<
      UpdateProductInfo,
      UpdateProductInfoVariables
    >(UPDATE_PRODUCT_INFO)

    function prev() {
      if (imagesList.value.length === 0) return
      const val = currentImageIndex.value - 1
      if (val > -1) {
        currentImageIndex.value = val
      }
    }

    function next() {
      if (imagesList.value.length === 0) return
      const val = currentImageIndex.value + 1
      if (val < imagesList.value.length) {
        currentImageIndex.value = val
      }
    }

    function sortImages(data: any) {
      if (data.oldContainer.id !== data.newContainer.id) return
      const oldIndex = data.oldIndex
      const newIndex = data.newIndex
      if (oldIndex === newIndex) return
      const newValue = imagesList.value.slice()
      newValue.splice(newIndex, 0, newValue.splice(oldIndex, 1)[0])
      updateImages(newValue as AttachFileInput[])
    }

    function setCurrentIndex(index: number) {
      if (!imagesList.value[index]) {
        index = 0
      }
      currentImageIndex.value = index
    }

    async function updateImages(images: AttachFileInput[] | null) {
      if (!props.productId) return
      try {
        updateImagesLoading.value = true
        const input = {
          images: images?.map((el) => ({
            filename: el.filename,
            contentType: el.contentType,
            url: el.url,
          })),
        }
        await updateProductInfoMutate({
          id: props.productId,
          input: input,
        })
      } catch (error) {
        // eslint-disable-line
      } finally {
        updateImagesLoading.value = false
      }
    }

    async function addImage(file: AttachFileInput) {
      if (!props.productId) return
      try {
        addLoading.value = true
        const inputImages = [file]
        await addProductImageMutate({
          id: props.productId,
          inputImages: inputImages,
          unshift: true,
        })
      } catch (error) {
        // eslint-disable-line
      } finally {
        addLoading.value = false
      }
    }

    return () => (
      <Menu
        v-model={menu.value}
        closeOnContentClick={false}
        maxWidth={400}
        disabled={!imageSrc.value || uploading.value}
        openOnHover
        placement="right-start"
        v-slots={{
          activator: () => (
            <div class="inline-block align-middle pr-2">
              {slots['menu-activator'] ? (
                slots['menu-activator']({ isOpen: menu.value })
              ) : props.upload ? (
                <FileUploader
                  loading={addLoading.value}
                  v-model={[uploading.value, 'uploading']}
                  src={imageSrc.value}
                  class="w-8 h-8"
                  {...{
                    onUploadStart: () => emit('upload-start', true),
                    onUpdate: addImage,
                  }}
                  v-slots={{
                    drag: ({ internalSrc, isDragOver, loading }: any) => (
                      <div class="w-8 h-8 rounded">
                        {!internalSrc ? (
                          <div
                            class={[
                              'bg-gray-800 border border-dashed border-transparent w-full h-full flex justify-center items-center text-gray-300 hover:text-gray-100 rounded',
                              { 'border-gray-300': isDragOver },
                            ]}
                          >
                            <i>
                              <svg
                                width="13"
                                height="12"
                                viewBox="0 0 13 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.773926"
                                  y="5.50012"
                                  width="11"
                                  height="1"
                                  stroke="currentColor"
                                />
                                <rect
                                  x="6.77393"
                                  y="0.500122"
                                  width="11"
                                  height="1"
                                  transform="rotate(90 6.77393 0.500122)"
                                  stroke="currentColor"
                                />
                              </svg>
                            </i>
                          </div>
                        ) : (
                          <div class="w-full h-full rounded">
                            <Image
                              src={iconImageSrc.value}
                              aspectRatio={1}
                              class="rounded"
                              v-slots={{
                                placeholder: () => (
                                  <div class="flex justify-center items-center w-full h-full">
                                    <LoadingSpinner />
                                  </div>
                                ),
                              }}
                            />
                            {(isDragOver || menu.value) && (
                              <div
                                class={[
                                  'border border-transparent border-dashed absolute inset-0 w-full h-full bg-black opacity-30 rounded',
                                  { 'border-white': isDragOver },
                                ]}
                              />
                            )}
                            {(isDragOver || menu.value) && !loading && (
                              <div class="absolute inset-0 flex justify-center items-center text-white">
                                {isDragOver ? (
                                  <i>
                                    <svg
                                      width="13"
                                      height="12"
                                      viewBox="0 0 13 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <rect
                                        x="0.773926"
                                        y="5.50012"
                                        width="11"
                                        height="1"
                                        stroke="currentColor"
                                      />
                                      <rect
                                        x="6.77393"
                                        y="0.500122"
                                        width="11"
                                        height="1"
                                        transform="rotate(90 6.77393 0.500122)"
                                        stroke="currentColor"
                                      />
                                    </svg>
                                  </i>
                                ) : (
                                  <i>
                                    <svg
                                      width="20"
                                      height="20"
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <circle
                                        cx="9.27393"
                                        cy="9"
                                        r="8"
                                        stroke="white"
                                        stroke-width="1.6"
                                      />
                                      <rect
                                        x="5.67393"
                                        y="8.6124"
                                        width="7.2"
                                        height="0.8"
                                        fill="currentColor"
                                        stroke="white"
                                        stroke-width="0.8"
                                      />
                                      <rect
                                        x="15.5076"
                                        y="14.1488"
                                        width="5.43138"
                                        height="0.8"
                                        rx="0.4"
                                        transform="rotate(45 15.5076 14.1488)"
                                        fill="currentColor"
                                        stroke="white"
                                        stroke-width="0.8"
                                      />
                                      <rect
                                        x="9.67397"
                                        y="5.41239"
                                        width="7.2"
                                        height="0.8"
                                        transform="rotate(90 9.67397 5.41239)"
                                        fill="currentColor"
                                        stroke="white"
                                        stroke-width="0.8"
                                      />
                                    </svg>
                                  </i>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  }}
                />
              ) : (
                <div class="w-8 h-8 rounded inline-block">
                  {imageSrc.value && (
                    <Image
                      src={iconImageSrc.value}
                      aspectRatio={1}
                      class="rounded"
                      v-slots={{
                        placeholder: () => (
                          <div class="flex justify-center items-center w-full h-full">
                            <LoadingSpinner />
                          </div>
                        ),
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ),
        }}
      >
        <div class="relative bg-white dark:bg-gray-400 p-4">
          <span class="absolute top-0 right-0 pt-2 pr-2">
            <Icon
              class="text-gray-200 cursor-pointer hover:text-gray-300 dark:hover:text-gray-100"
              {...{
                onClick: () => {
                  menu.value = false
                },
              }}
            >
              {ziCloseWindow}
            </Icon>
          </span>
          {imagesList.value.length > 1 ? (
            <Sortable
              disabled={!props.sortable}
              draggable=".sortable-source"
              class="inline-flex overflow-x-auto focus:outline-none space-x-2 pb-4 pr-6"
              {...{
                'onUpdate:modelValue': sortImages,
              }}
            >
              {imagesList.value.map((item, i) => (
                <Image
                  key={item.url}
                  src={`${item.url}${ICON_IMAGE_POSTFIX}`}
                  class={[
                    'rounded h-8 w-8 sortable-source focus:outline-none border border-solid',
                    i === currentImageIndex.value
                      ? 'border-white dark:border-light-gray-500'
                      : 'border-transparent',
                  ]}
                  aspectRatio={1}
                  {...{
                    onClick: () => setCurrentIndex(i),
                  }}
                  v-slots={{
                    placeholder: () => (
                      <div class="flex justify-center items-center w-full h-full">
                        <LoadingSpinner />
                      </div>
                    ),
                  }}
                />
              ))}
            </Sortable>
          ) : (
            <div class="h-5" />
          )}
          <div class="w-full">
            <div class="relative">
              <div class="w-full rounded">
                <Image
                  src={previewImageSrc.value}
                  key={currentImage.value.url}
                  class="w-full rounded"
                  aspectRatio={1}
                  v-slots={{
                    placeholder: () => (
                      <div class="flex justify-center items-center w-full h-full">
                        <LoadingSpinner />
                      </div>
                    ),
                  }}
                />
              </div>
              <div class="absolute inset-x-0 top-0 h-20 rounded-t overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900/50 to-gray-900/0">
                <a
                  href={`${currentImage.value.url}-original`}
                  target="_blank"
                  class="absolute right-0 top-0 pointer-events-auto cursor-pointer text-2xl text-light-gray-400 hover:text-white focus:text-white focus:outline-none pt-2.5 pr-2.5"
                >
                  <Icon>{ziFullScreen}</Icon>
                </a>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-20 rounded-b overflow-hidden pointer-events-none text-gray-100">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-gray-900/0" />
                {imagesList.value.length > 1 && (
                  <div class="absolute inset-x-0 bottom-0 text-center leading-tight pb-2">
                    <span class="text-white">
                      {currentImageIndex.value + 1}
                    </span>{' '}
                    /<span>{imagesList.value.length}</span>
                  </div>
                )}
              </div>
              {imagesList.value.length > 1 && (
                <div class="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center justify-between p-2">
                  <div
                    class={[
                      'h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto',
                      hasPrev.value
                        ? 'cursor-pointer text-blue-500 hover:text-blue-400'
                        : 'text-gray-200',
                    ]}
                    onClick={prev}
                  >
                    <Icon>{ziArrowLeft}</Icon>
                  </div>
                  <div
                    class={[
                      'h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto',
                      hasNext.value
                        ? 'cursor-pointer text-blue-500 hover:text-blue-400'
                        : 'text-gray-200',
                    ]}
                    onClick={next}
                  >
                    <Icon>{ziArrowRight}</Icon>
                  </div>
                </div>
              )}
            </div>
            <div class="text-gray-900 dark:text-white font-semibold pt-4">
              {currentImage.value.filename || currentImage.value.url}
            </div>
            {props.caption && (
              <div class="text-gray-200 dark:text-light-gray-400 leading-tight pt-1">
                {props.caption}
              </div>
            )}
          </div>
        </div>
      </Menu>
    )
  },
})
