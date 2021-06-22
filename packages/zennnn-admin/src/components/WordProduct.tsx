import { defineComponent, ref, computed, watch } from 'vue'

import {
  ziFullScreen,
  ziArrowLeft,
  ziArrowRight,
  ziCloseDelete,
} from '@zennnn/icons'
import { Btn, Icon, Menu, Image, LoadingSpinner } from '@zennnn/core'

import { ICON_IMAGE_POSTFIX, PREVIEW_IMAGE_POSTFIX } from 'shared/config'

import type { PropType } from 'vue'
import type { ListWords_listWords_items_products_images } from '@/graphql/types'

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<
        ListWords_listWords_items_products_images[] | null
      >,
      default: () => [],
    },
  },

  setup(props) {
    const isActive = ref(false)
    const currentImageIndex = ref(0)

    const imagesList = computed(() => props.images || [])

    const imageSrc = computed(
      () => imagesList.value[0] && imagesList.value[0].url
    )

    const currentImage = computed(() => {
      const index = currentImageIndex.value || 0
      return imagesList.value[index] || {}
    })

    const previewImageSrc = computed(() => {
      if (!currentImage.value.url) return ''
      return `${currentImage.value.url}${PREVIEW_IMAGE_POSTFIX}`
    })

    const iconImageSrc = computed(() => {
      if (!imageSrc.value) return ''
      return `${imageSrc.value}${ICON_IMAGE_POSTFIX}`
    })

    const hasPrev = computed(() => currentImageIndex.value > 0)

    const hasNext = computed(
      () => currentImageIndex.value + 1 < imagesList.value.length
    )

    watch(imagesList, (val) => {
      if (!val) return
      if (currentImageIndex.value + 1 > val.length) {
        setCurrentIndex(0)
      }
    })

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

    function setCurrentIndex(index: number) {
      if (!imagesList.value[index]) {
        index = 0
      }
      currentImageIndex.value = index
    }

    return () => (
      <Menu
        v-slots={{
          activator: () => (
            <div class="inline-flex align-middle">
              <div class="w-7 h-7 rounded">
                {imageSrc.value ? (
                  <Image
                    v-slots={{
                      placeholder: () => (
                        <div class="flex justify-center items-center w-full h-full">
                          <LoadingSpinner />
                        </div>
                      ),
                    }}
                    src={iconImageSrc.value}
                    aspect-ratio="1"
                    class="rounded"
                  />
                ) : (
                  <div class="w-full h-full rounded bg-gray-600" />
                )}
              </div>
            </div>
          ),
        }}
        v-model={isActive.value}
        closeOnContentClick={false}
        disabled={!imageSrc.value}
        maxWidth={400}
        minWidth={400}
        openOnHover
        placement="right-start"
        boxClass="text-white dark:text-gray-400"
        skidding={-8}
      >
        <div class="p-4 relative bg-white dark:bg-gray-400">
          <span class="absolute top-2 right-2">
            <Icon
              class="text-gray-200 cursor-pointer hover:text-gray-400 dark:hover:text-gray-100"
              {...{
                onClick: () => {
                  isActive.value = false
                },
              }}
            >
              {ziCloseDelete}
            </Icon>
          </span>
          <div class="h-5" />
          <div class="w-full">
            <div class="relative">
              <div class="w-full rounded">
                <Image
                  v-slots={{
                    placeholder: () => (
                      <div class="flex justify-center items-center w-full h-full">
                        <LoadingSpinner />
                      </div>
                    ),
                  }}
                  src={previewImageSrc.value}
                  // TODO: check currentImage exists
                  key={currentImage.value.url!}
                  class="w-full rounded"
                  aspect-ratio="1"
                />
              </div>
              <div class="absolute inset-x-0 top-0 h-20 rounded-t overflow-hidden pointer-events-none bg-gradient-to-b from-gray-900-a-50 to-gray-900-a-0">
                <a
                  href={`${currentImage.value.url}-original`}
                  target="_blank"
                  class="absolute inline-flex right-2 top-2 pointer-events-auto cursor-pointer text-2xl text-light-gray-400 hover:text-white focus:text-white focus:outline-none"
                >
                  <Icon>{ziFullScreen}</Icon>
                </a>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-20 rounded-b overflow-hidden pointer-events-none text-gray-100">
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900-a-50 to-gray-900-a-0" />
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
                  <Btn
                    disabled={!hasPrev.value}
                    text
                    class="h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto"
                    {...{ onClick: prev }}
                  >
                    <Icon>{ziArrowLeft}</Icon>
                  </Btn>
                  <Btn
                    disabled={!hasNext.value}
                    text
                    class="h-12 w-12 rounded-full bg-gray-900 bg-opacity-80 flex items-center justify-center pointer-events-auto"
                    {...{ onClick: next }}
                  >
                    <Icon>{ziArrowRight}</Icon>
                  </Btn>
                </div>
              )}
            </div>
            <div class="dark:text-white font-semibold pt-4 pb-1">
              {currentImage.value.filename || currentImage.value.url}
            </div>
          </div>
        </div>
      </Menu>
    )
  },
})
