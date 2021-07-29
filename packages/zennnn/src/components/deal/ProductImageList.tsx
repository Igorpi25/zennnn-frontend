import { defineComponent, ref, computed, nextTick } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { ziSearch, ziCloseDelete } from '@zennnn/icons'
import { Icon, Image, LoadingSpinner } from '@zennnn/core'
import { ICON_IMAGE_POSTFIX } from 'shared/config'
import { ADD_PRODUCT_IMAGE, REMOVE_PRODUCT_IMAGE } from '@/graphql/mutations'
import FileUploader from '@/components/FileUploader'
import ProductImage from './ProductImage'

import type { PropType } from 'vue'
import type {
  AddProductImage,
  AddProductImageVariables,
  RemoveProductImage,
  RemoveProductImageVariables,
  AttachFileInput,
} from '@/graphql/types'

export default defineComponent({
  props: {
    productId: {
      type: String,
      required: true,
    },
    images: Array as PropType<any>,
    upload: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
    caption: String as PropType<string | null>,
  },

  setup(props) {
    const uploading = ref(false)
    const fileUploaderRef = ref()

    const imagesList = computed(() => (props.images || []) as any[])

    const leadImages = computed(() => imagesList.value.slice(0, 3))

    const otherImages = computed(() => imagesList.value.slice(3))

    const {
      mutate: addProductImageMutate,
      loading: addProductImageLoading,
      onDone: onAddProductImageDone,
    } = useMutation<AddProductImage, AddProductImageVariables>(
      ADD_PRODUCT_IMAGE
    )

    const { mutate: removeProductImageMutate } = useMutation<
      RemoveProductImage,
      RemoveProductImageVariables
    >(REMOVE_PRODUCT_IMAGE)

    onAddProductImageDone(() => {
      nextTick(() => {
        if (fileUploaderRef.value) {
          fileUploaderRef.value.internalSrc = null
          fileUploaderRef.value.filePreview = null
        }
      })
    })

    return () => (
      <div class="flex items-center">
        <div class="flex items-center">
          {leadImages.value.map((item, index) => (
            <div key={item.url}>
              <ProductImage
                productId={props.productId}
                images={imagesList.value}
                upload={false}
                removable={props.removable}
                currentIndex={index}
                caption={props.caption}
                v-slots={{
                  'menu-activator': ({ isOpen }: { isOpen: boolean }) => (
                    <div class="h-8 w-8 rounded relative">
                      <div
                        class={[
                          'absolute rounded-full bg-red-500 flex items-center justify-center transition-colors duration-100 ease-out cursor-pointer',
                          'w-3.5 h-3.5 right-[-5px] top-[-5px] z-1',
                          isOpen ? 'opacity-100' : 'opacity-0',
                        ]}
                        onClick={() => {
                          removeProductImageMutate({
                            id: props.productId,
                            inputImages: [
                              {
                                url: item.url,
                                filename: item.filename,
                                contentType: item.contentType,
                              },
                            ],
                          })
                        }}
                      >
                        <Icon class="text-white">{ziCloseDelete}</Icon>
                      </div>
                      <Image
                        key={item.url}
                        src={`${item.url}${ICON_IMAGE_POSTFIX}`}
                        class="rounded"
                        aspectRatio={1}
                        v-slots={{
                          placeholder: () => (
                            <div class="flex justify-center items-center w-full h-full">
                              <LoadingSpinner />
                            </div>
                          ),
                        }}
                      />
                      {isOpen && (
                        <>
                          <div class="absolute inset-0 w-full h-full bg-black opacity-30 rounded" />
                          <div class="absolute inset-0 w-full h-full flex items-center justify-center">
                            <Icon class="text-white">{ziSearch}</Icon>
                          </div>
                        </>
                      )}
                    </div>
                  ),
                }}
              />
            </div>
          ))}
        </div>
        {otherImages.value.length > 0 && (
          <div class="flex justify-center items-center pr-2">
            <span class="font-medium text-gray-100">
              {' '}
              +{otherImages.value.length}{' '}
            </span>
          </div>
        )}
        {props.upload && (
          <FileUploader
            ref={fileUploaderRef}
            v-model={[uploading.value, 'uploading']}
            loading={addProductImageLoading.value}
            class="w-8 h-8"
            {...{
              onUpdate: (val: AttachFileInput) => {
                addProductImageMutate({
                  id: props.productId,
                  inputImages: [val],
                })
              },
            }}
          />
        )}
      </div>
    )
  },
})
