import { defineComponent, ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziChevronRight, ziDocument, ziCloudUpload } from '@zennnn/icons'
import { Icon, TextField, TextArea, ExpandTransition, Btn } from '@zennnn/core'
import FileUploader from '@/components/core/FileUploader'

import type { PropType } from 'vue'
import type {
  GetClient_getClient,
  GetSupplier_getSupplier,
  GetOrgRequisite_getOrgRequisite,
  AttachFileInput,
} from '@/graphql/types'
import { EmptyString } from '@/types'

type Item = GetClient_getClient &
  GetSupplier_getSupplier &
  GetOrgRequisite_getOrgRequisite

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<
        GetClient_getClient &
          GetSupplier_getSupplier &
          GetOrgRequisite_getOrgRequisite
      >,
      default: () => ({}),
    },
    supplier: Boolean,
    company: Boolean,
    loading: Boolean,
    create: Boolean,
    expanded: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const attachFileAccept =
      'application/pdf,application/msword,application/vnd.ms-excel,text/plain'
    const expanded = ref(props.expanded)
    const attachFileLoading = ref(false)
    const fileUploadLoading = ref(false)
    const internalTags = ref(props.item.tags)
    const internalFiles = ref(props.item.files)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const files = computed(() => internalFiles.value)

    watch(
      () => props.item.tags,
      (val) => {
        internalTags.value = val
      }
    )

    watch(
      () => props.item.files,
      (val) => {
        internalFiles.value = val
      }
    )

    function toggleExpand() {
      expanded.value = !expanded.value
    }

    function updateData(
      input: Partial<
        {
          [k in keyof Item]:
            | boolean
            | EmptyString
            | AttachFileInput[]
            | string[]
            | null
        }
      >
    ) {
      emit('update', input)
    }

    function attachFile(val: any) {
      internalFiles.value = files.value ? [...files.value, val] : [val]
      const inputFiles = internalFiles.value.map((el) => ({
        filename: el.filename,
        contentType: el.contentType,
        url: el.url,
      }))
      updateData({ files: inputFiles })
    }

    function removeFile(removeIndex: number) {
      internalFiles.value =
        internalFiles.value?.filter((_, i) => i !== removeIndex) || []
      const inputFiles = internalFiles.value.map((el) => ({
        filename: el.filename,
        contentType: el.contentType,
        url: el.url,
      }))
      updateData({ files: inputFiles })
    }

    function updateTags(e: Event) {
      const value = (e.target as HTMLInputElement).value || ''
      const tags = [] as string[]
      value.split(',').forEach((s) => {
        if (s && s.trim() !== '') {
          tags.push(s.trim())
        }
      })
      updateData({ tags })
    }

    return () => (
      <div>
        <div class="flex items-center text-lg leading-tight pt-10">
          <span class="flex-grow text-white font-semibold tracking-widest uppercase">
            {t('companyDetail.note')}
          </span>
          <div>
            <Btn icon mini text {...{ onClick: toggleExpand }}>
              <Icon
                class={{
                  'transition-transform': true,
                  'rotate-90': expanded,
                }}
              >
                {ziChevronRight}
              </Icon>
            </Btn>
          </div>
        </div>
        <ExpandTransition>
          <div v-show={expanded.value} class="pt-4">
            {!props.company && (
              <div class="pb-2">
                <TextArea
                  modelValue={props.item.note}
                  label={t('companyDetail.label.note')}
                  placeholder={t('companyDetail.placeholder.note')}
                  loading={props.loading}
                  debounce={500}
                  lazy={props.create}
                  rules={[rules.required]}
                  stateIcon
                  rows="4"
                  {...{
                    'onUpdate:modelValue': (val: EmptyString) =>
                      updateData({ note: val }),
                  }}
                />
              </div>
            )}
            {props.supplier && (
              <div class="pb-2">
                <TextField
                  modelValue={props.item.companyType}
                  label={t('companyDetail.label.supplierType')}
                  placeholder={t('companyDetail.placeholder.supplierType')}
                  loading={props.loading}
                  debounce={500}
                  lazy={props.create}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="none"
                  disabled
                />
              </div>
            )}
            <div class={{ 'pb-2': !props.company }}>
              <TextField
                modelValue={internalTags.value?.join(',')}
                label={t('companyDetail.label.tags')}
                placeholder={t('companyDetail.placeholder.tags')}
                loading={props.loading}
                lazy
                {...{ onChange: updateTags }}
                v-slots={{
                  label: () => (
                    <>
                      <span>{t('companyDetail.label.tags')}</span>
                      <span class="text-gray-200">
                        {t('companyDetail.label.tagsDesc')}
                      </span>
                    </>
                  ),
                }}
              />
            </div>
            {!props.company && (
              <div class="inline-flex flex-col">
                <label class="label">
                  {t('companyDetail.label.attachFile')}
                </label>
                <FileUploader
                  loading={attachFileLoading.value}
                  v-model={[fileUploadLoading.value, 'uploading']}
                  fileAccept={attachFileAccept}
                  uploadType="file"
                  {...{ onUploaded: attachFile }}
                  v-slots={{
                    drag: ({ loading, isDragOver }: any) => (
                      <Btn
                        loading={loading}
                        primary={false}
                        small
                        class={[
                          'ring-inset bg-gray-900 text-[0.8125rem] text-gray-200 hover:text-gray-100 dark:hover:text-gray-100 rounded px-2',
                          { 'text-gray-100': isDragOver },
                          { 'cursor-wait': loading },
                        ]}
                        v-slots={{
                          loader: () => <div></div>,
                        }}
                      >
                        <Icon left>{ziCloudUpload}</Icon>
                        {t('companyDetail.placeholder.attachFile')}
                      </Btn>
                    ),
                  }}
                />
              </div>
            )}
            {files.value?.map((item, i) => (
              <div class="group flex items-center pt-4 px-2">
                <div class="flex items-center w-6">
                  {item.contentType === 'application/pdf' ? (
                    <div>
                      <img
                        src={
                          require('@zennnn/icons/colorfull/Pdf-file.svg')
                            .default
                        }
                        alt="pdf-file"
                      />
                    </div>
                  ) : (
                    <div>
                      <Icon class="text-gray-200">{ziDocument}</Icon>
                    </div>
                  )}
                </div>
                <div class="px-2">
                  <a
                    href={item.url || undefined}
                    target="_blank"
                    class="text-blue-500 group-hover:text-white transition-colors duration-100 ease-out"
                  >
                    {item.filename}
                  </a>
                </div>
                <button
                  class="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-100 ease-out"
                  {...{ onClick: () => removeFile(i) }}
                >
                  <img
                    src={
                      require('@zennnn/icons/colorfull/Close-grey.svg').default
                    }
                    alt="Delete"
                  />
                </button>
              </div>
            ))}
          </div>
        </ExpandTransition>
      </div>
    )
  },
})
