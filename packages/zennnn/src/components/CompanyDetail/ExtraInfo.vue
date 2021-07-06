<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <span
        class="flex-grow text-white font-semibold tracking-widest uppercase"
      >
        {{ $t('companyDetail.note') }}
      </span>
      <div>
        <button
          class="
            text-blue-500
            hover:text-blue-400
            focus:text-blue-400
            focus:outline-none
          "
          @click="toggleExpand"
        >
          <Icon class="transition-transform" :class="{ 'rotate-90': expanded }">
            {{ icons.ziChevronRight }}
          </Icon>
        </button>
      </div>
    </div>
    <ExpandTransition>
      <div v-show="expanded" class="pt-4">
        <div v-if="!isRequisite" class="pb-2">
          <label
            class="
              block
              text-base text-gray-100
              whitespace-nowrap
              leading-5
              py-2
            "
          >
            {{ $t('companyDetail.label.note') }}
          </label>
          <TextArea
            :model-value="item.note"
            :placeholder="$t('companyDetail.placeholder.note')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
            :rules="[rules.required]"
            state-icon
            rows="4"
            @update:model-value="updateData({ note: $event })"
          />
        </div>
        <div v-if="isSupplier" class="pb-2">
          <TextField
            :model-value="item.companyType"
            :label="$t('companyDetail.label.supplierType')"
            :placeholder="$t('companyDetail.placeholder.supplierType')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
            :rules="[rules.required]"
            state-icon
            state-error-color="none"
            disabled
          />
        </div>
        <div :class="{ 'pb-2': !isRequisite }">
          <TextField
            :model-value="inputTags"
            :label="$t('companyDetail.label.tags')"
            :placeholder="$t('companyDetail.placeholder.tags')"
            :loading="loading"
            lazy
            @change="updateTags"
          >
            <template v-slot:label>
              <span>{{ $t('companyDetail.label.tags') }}</span>
              <span class="text-gray-200">{{
                $t('companyDetail.label.tagsDesc')
              }}</span>
            </template>
          </TextField>
        </div>
        <div v-if="!isRequisite" class="inline-block pt-">
          <label
            class="
              block
              leading-5
              text-base text-gray-100
              whitespace-nowrap
              py-2
            "
          >
            <span>
              {{ $t('companyDetail.label.attachFile') }}
            </span>
          </label>
          <FileUploader
            :loading="attachFileLoading"
            v-model:uploading="fileUploadLoading"
            :file-accept="attachFileAccept"
            upload-type="file"
            @uploaded="attachFile"
          >
            <template v-slot:drag="{ loading, isDragOver }">
              <div
                :class="[
                  'flex items-center text-gray-200 h-10 bg-gray-800 rounded px-2.5',
                  loading ? 'cursor-wait opacity-40' : 'hover:text-gray-100',
                  { 'text-gray-100': isDragOver },
                ]"
              >
                <div class="mr-2.5">
                  <svg
                    width="25"
                    height="21"
                    viewBox="0 0 25 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5425 7.99658L7.47656 13.0625L8.7998 14.3857L11.6068 11.5787V20.8754H13.4782V11.5787L16.2852 14.3857L17.6084 13.0625L12.5425 7.99658Z"
                      fill="currentColor"
                    />
                    <path
                      d="M20.0255 7.61465C19.9148 3.53146 16.5588 0.243652 12.4494 0.243652C10.5615 0.243652 8.7527 0.94209 7.35606 2.2102C6.15264 3.30286 5.33945 4.73943 5.02103 6.31317C3.88337 6.55781 2.84495 7.14628 2.04152 8.01239C1.06005 9.07064 0.519531 10.4487 0.519531 11.8927C0.519531 15.0399 3.07994 17.6003 6.22713 17.6003C6.23458 17.6003 6.24194 17.6002 6.24733 17.6002H7.20958V15.7288H6.23959L6.22178 15.729C4.10894 15.7261 2.39088 14.0063 2.39088 11.8927C2.39088 9.90689 3.9392 8.22731 5.91583 8.06911L6.69245 8.00695L6.772 7.23197C7.0713 4.31479 9.51208 2.11495 12.4494 2.11495C15.5965 2.11495 18.157 4.67536 18.157 7.82254V9.45998H19.5137C21.242 9.45998 22.6481 10.8661 22.6481 12.5945C22.6481 14.3228 21.242 15.7289 19.5137 15.7289L17.8762 15.7286V17.6001H19.4832C19.4934 17.6002 19.5035 17.6004 19.5137 17.6004C22.2739 17.6004 24.5195 15.3547 24.5195 12.5945C24.5195 10.007 22.5463 7.87171 20.0255 7.61465Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div class="text-[0.8125rem]">
                  {{ $t('companyDetail.placeholder.attachFile') }}
                </div>
              </div>
            </template>
          </FileUploader>
        </div>
        <div class="w-full pt-10 px-6">
          <div
            v-for="(file, i) of files"
            :key="i"
            :class="['group flex items-center', { 'pt-6': i > 0 }]"
          >
            <div class="flex items-center w-6">
              <div v-if="file.contentType === 'application/pdf'">
                <img
                  src="@/assets/icons/colorful/Pdf-file.svg"
                  alt="pdf-file"
                />
              </div>
              <div v-else>
                <Icon class="text-gray-200">
                  {{ ziDocument }}
                </Icon>
              </div>
            </div>
            <div class="px-2.5">
              <a
                :href="file.url"
                target="_blank"
                class="
                  text-blue-500
                  group-hover:text-white
                  transition-colors
                  duration-100
                  ease-out
                "
                >{{ file.filename }}</a
              >
            </div>
            <button
              class="
                opacity-0
                group-hover:opacity-100
                cursor-pointer
                transition-opacity
                duration-100
                ease-out
              "
              @click="removeFile(i)"
            >
              <img src="@/assets/icons/colorful/Close-grey.svg" alt="Delete" />
            </button>
          </div>
        </div>
      </div>
    </ExpandTransition>
  </div>
</template>

<script>
import { ziChevronRight, ziDocument } from '@zennnn/icons'
import { Icon, TextField, TextArea, ExpandTransition } from '@zennnn/core'

import clientDetail from '../../mixins/clientDetail'

import FileUploader from '../FileUploader.vue'

export default {
  name: 'ExtraInfo',
  components: {
    Icon,
    TextField,
    TextArea,
    ExpandTransition,
    FileUploader,
  },
  mixins: [clientDetail],
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isSupplier: Boolean,
    isRequisite: Boolean,
  },
  data() {
    return {
      attachFileAccept:
        'application/pdf,application/msword,application/vnd.ms-excel,text/plain',
      attachFileLoading: false,
      fileUploadLoading: false,
      lazyTags: this.item.tags || [],
      lazyFiles: this.item.files || [],
      rules: {
        required: (v) => !!v || this.$t('rule.required'),
      },
      icons: {
        ziDocument,
        ziChevronRight,
      },
    }
  },
  computed: {
    inputTags() {
      return this.lazyTags.join(',')
    },
    files() {
      return this.lazyFiles || []
    },
  },
  watch: {
    'item.tags'(val) {
      this.lazyTags = val || []
    },
    'item.files'(val) {
      this.lazyFiles = val || []
    },
  },
  methods: {
    attachFile(val) {
      const files = [...this.files, val]
      this.lazyFiles = files
      const inputFiles = files.map((el) => {
        return {
          filename: el.filename,
          contentType: el.contentType,
          url: el.url,
        }
      })
      this.updateData({ files: inputFiles })
    },
    removeFile(i) {
      this.lazyFiles.splice(i, 1)
      const inputFiles = this.lazyFiles.map((el) => {
        return {
          filename: el.filename,
          contentType: el.contentType,
          url: el.url,
        }
      })
      this.updateData({ files: inputFiles })
    },
    updateTags(e) {
      const value = e.target.value || ''
      const tags = []
      value.split(',').forEach((s) => {
        if (s && s.trim() !== '') {
          tags.push(s.trim())
        }
      })
      this.updateData({ tags })
    },
  },
}
</script>
