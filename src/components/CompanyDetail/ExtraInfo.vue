<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <span class="flex-grow text-white font-semibold tracking-widest uppercase">
        {{ $t('companyDetail.note') }}
      </span>
      <div>
        <button
          class="w-6 h-6 flex items-center justify-center text-2xl text-blue-500 hover:text-blue-600 focus:text-blue-600 focus:outline-none select-none"
           @click="toggleExpand"
        >
          <i v-if="expanded" class="zi-chevron-down" />
          <i v-else class="zi-chevron-up" />
        </button>
      </div>
    </div>
    <v-expand-transition>
      <div v-show="expanded" class="pt-4">
        <div v-if="!isRequisite" class="pb-2">
          <label class="block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
            {{ $t('companyDetail.label.note') }}
          </label>
          <TextArea
            :value="item.note"
            :placeholder="$t('companyDetail.placeholder.note')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
            :rules="[rules.required]"
            state-icon
            rows="4"
            @input="updateData({ 'note': $event })"
          />
        </div>
        <div v-if="isSupplier" class="pb-2">
          <TextField
            :value="item.companyType"
            :label="$t('companyDetail.label.supplierType')"
            :placeholder="$t('companyDetail.placeholder.supplierType')"
            :loading="loading"
            :debounce="500"
            :lazy="create"
            :rules="[rules.required]"
            state-icon
            state-color="none"
            disabled
          />
        </div>
        <div :class="{ 'pb-2': !isRequisite }">
          <TextField
            :value="inputTags"
            :label="$t('companyDetail.label.tags')"
            :placeholder="$t('companyDetail.placeholder.tags')"
            :loading="loading"
            lazy
            @change="updateTags"
          >
            <template v-slot:label>
              <label class="block leading-5 text-base text-gray-100 whitespace-nowrap py-2">
                <span>{{ $t('companyDetail.label.tags') }}</span> <span class="text-gray-200">{{ $t('companyDetail.label.tagsDesc') }}</span>
              </label>
            </template>
          </TextField>
        </div>
        <div v-if="!isRequisite" class="inline-block pt-">
          <label class="block leading-5 text-base text-gray-100 whitespace-nowrap py-2">
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
                  'flex items-center text-gray-200 h-10 bg-gray-800 rounded px-sm',
                  loading ? 'cursor-wait opacity-40' : 'hover:text-gray-100',
                  { 'text-gray-100': isDragOver },
                ]"
              >
                <div class="mr-sm">
                  <svg width="25" height="21" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5425 7.99658L7.47656 13.0625L8.7998 14.3857L11.6068 11.5787V20.8754H13.4782V11.5787L16.2852 14.3857L17.6084 13.0625L12.5425 7.99658Z" fill="currentColor"/>
                    <path d="M20.0255 7.61465C19.9148 3.53146 16.5588 0.243652 12.4494 0.243652C10.5615 0.243652 8.7527 0.94209 7.35606 2.2102C6.15264 3.30286 5.33945 4.73943 5.02103 6.31317C3.88337 6.55781 2.84495 7.14628 2.04152 8.01239C1.06005 9.07064 0.519531 10.4487 0.519531 11.8927C0.519531 15.0399 3.07994 17.6003 6.22713 17.6003C6.23458 17.6003 6.24194 17.6002 6.24733 17.6002H7.20958V15.7288H6.23959L6.22178 15.729C4.10894 15.7261 2.39088 14.0063 2.39088 11.8927C2.39088 9.90689 3.9392 8.22731 5.91583 8.06911L6.69245 8.00695L6.772 7.23197C7.0713 4.31479 9.51208 2.11495 12.4494 2.11495C15.5965 2.11495 18.157 4.67536 18.157 7.82254V9.45998H19.5137C21.242 9.45998 22.6481 10.8661 22.6481 12.5945C22.6481 14.3228 21.242 15.7289 19.5137 15.7289L17.8762 15.7286V17.6001H19.4832C19.4934 17.6002 19.5035 17.6004 19.5137 17.6004C22.2739 17.6004 24.5195 15.3547 24.5195 12.5945C24.5195 10.007 22.5463 7.87171 20.0255 7.61465Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="text-13">
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
            :class="['file-list__item flex items-center', { 'pt-6': i > 0 }]"
          >
            <div class="flex items-center w-6">
              <div v-if="file.contentType === 'application/pdf'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 20.2427C24 22.3178 22.3178 24 20.2427 24H3.75734C1.68221 24 0 22.3178 0 20.2427V4.88454L4.88454 0H20.2427C22.3178 0 24 1.68221 24 3.75734V20.2427Z" fill="#E24C3F"/>
                  <path opacity="0.2" d="M0 7.50236V4.88477H2.6051L0 7.50236Z" fill="#5D5D5D"/>
                  <path d="M0 4.88454H3.25639C4.15186 4.88454 4.88454 4.16435 4.88454 3.26888V0L0 4.88454Z" fill="#FF7063"/>
                  <path d="M4.02246 16.1437V8.28516H7.91215C8.28136 8.28516 8.60933 8.34556 8.89587 8.46607C9.18227 8.58673 9.41974 8.75445 9.60826 8.96927C9.7966 9.1841 9.93989 9.44044 10.0379 9.73817C10.1358 10.036 10.1849 10.3657 10.1849 10.7275C10.1849 11.0894 10.1377 11.4286 10.0435 11.7451C9.94919 12.0618 9.80975 12.3351 9.62522 12.565C9.44035 12.7949 9.20491 12.9759 8.91851 13.1077C8.63192 13.2397 8.29657 13.3056 7.9121 13.3056H5.30014V16.1437H4.02246V16.1437ZM5.30019 9.46111V12.107H7.47123C7.9687 12.107 8.33232 11.9959 8.56236 11.7734C8.79217 11.5512 8.90719 11.2024 8.90719 10.7275C8.90719 10.2752 8.78465 9.95116 8.53972 9.75503C8.2947 9.55913 7.9385 9.46106 7.47123 9.46106H5.30019V9.46111Z" fill="#FF7063"/>
                  <path d="M14.7873 8.48768L16.0198 8.14844V14.8423C16.0198 14.9856 16.0271 15.1137 16.0424 15.2268C16.0574 15.3398 16.0763 15.4455 16.0989 15.5434C16.129 15.6338 16.1629 15.73 16.2007 15.8317C16.2383 15.9335 16.2872 16.0372 16.3476 16.1427H15.0473C15.0021 16.0674 14.9569 15.9656 14.9116 15.8374C14.8813 15.7017 14.8588 15.5812 14.8438 15.4756C14.6177 15.7017 14.3594 15.8922 14.0692 16.0466C13.7789 16.201 13.468 16.2784 13.1364 16.2784C12.7443 16.2784 12.3995 16.2143 12.1018 16.0861C11.8039 15.9581 11.5534 15.7808 11.3498 15.5547C11.1464 15.3286 10.9937 15.0592 10.8919 14.7463C10.7902 14.4336 10.7393 14.0961 10.7393 13.7342V13.1915C10.7393 12.2343 10.9917 11.5143 11.4969 11.0318C12.0018 10.5495 12.7368 10.3082 13.7017 10.3082C14.071 10.3082 14.4328 10.3799 14.7873 10.523L14.7873 8.48768ZM14.7873 11.665C14.6214 11.5671 14.4311 11.4993 14.2163 11.4615C14.0015 11.4238 13.7997 11.405 13.6113 11.405C13.3098 11.405 13.0553 11.4465 12.8481 11.5293C12.6407 11.6124 12.4711 11.7291 12.3393 11.8798C12.2072 12.0307 12.1132 12.2116 12.0565 12.4226C12 12.6337 11.9718 12.8636 11.9718 13.1123V13.5307C11.9718 13.7418 11.9868 13.9473 12.017 14.147C12.047 14.3468 12.1055 14.522 12.1923 14.6727C12.2788 14.8236 12.3976 14.946 12.5484 15.0402C12.6991 15.1345 12.895 15.1816 13.1364 15.1816C13.2947 15.1816 13.451 15.1552 13.6057 15.1024C13.7601 15.0497 13.909 14.98 14.0523 14.8932C14.1954 14.8066 14.3293 14.7105 14.4537 14.6048C14.578 14.4994 14.6893 14.39 14.7873 14.277V11.665Z" fill="#FF7063"/>
                  <path d="M17.5911 9.81059C17.5911 9.59967 17.6194 9.39419 17.676 9.19434C17.7325 8.99473 17.821 8.81753 17.9416 8.66291C18.0621 8.50853 18.2205 8.38412 18.4165 8.28981C18.6124 8.19564 18.8462 8.14844 19.1176 8.14844C19.2457 8.14844 19.3907 8.16168 19.5529 8.18803C19.715 8.21452 19.8563 8.2465 19.977 8.28417V9.25657H19.5246C19.2909 9.25657 19.1157 9.32068 18.9989 9.44881C18.882 9.57707 18.8237 9.75409 18.8237 9.98024V10.4438H19.9205L19.5926 11.4615H18.8237V16.1427H17.5912V11.4615H16.8789V10.4438H17.5912V9.81059H17.5911Z" fill="#FF7063"/>
                  <path d="M4.02246 15.8605V8.00195H7.91215C8.28136 8.00195 8.60933 8.06235 8.89587 8.18287C9.18227 8.30353 9.41974 8.47125 9.60826 8.68607C9.7966 8.9009 9.93989 9.15724 10.0379 9.45496C10.1358 9.75283 10.1849 10.0825 10.1849 10.4443C10.1849 10.8061 10.1377 11.1454 10.0435 11.4619C9.94919 11.7785 9.80975 12.0519 9.62522 12.2817C9.44035 12.5117 9.20491 12.6927 8.91851 12.8245C8.63192 12.9565 8.29657 13.0224 7.9121 13.0224H5.30014V15.8605H4.02246V15.8605ZM5.30019 9.17791V11.8238H7.47123C7.9687 11.8238 8.33232 11.7127 8.56236 11.4902C8.79217 11.268 8.90719 10.9192 8.90719 10.4443C8.90719 9.99198 8.78465 9.66796 8.53972 9.47182C8.2947 9.27593 7.9385 9.17786 7.47123 9.17786H5.30019V9.17791Z" fill="white"/>
                  <path d="M14.7873 8.20643L16.0198 7.86719V14.5611C16.0198 14.7044 16.0271 14.8324 16.0424 14.9455C16.0574 15.0586 16.0763 15.1643 16.0989 15.2621C16.129 15.3526 16.1629 15.4487 16.2007 15.5505C16.2383 15.6522 16.2872 15.7559 16.3476 15.8614H15.0473C15.0021 15.7861 14.9569 15.6844 14.9116 15.5561C14.8813 15.4204 14.8588 15.2999 14.8438 15.1943C14.6177 15.4204 14.3594 15.6109 14.0692 15.7653C13.7789 15.9197 13.468 15.9971 13.1364 15.9971C12.7443 15.9971 12.3995 15.933 12.1018 15.8049C11.8039 15.6768 11.5534 15.4996 11.3498 15.2735C11.1464 15.0474 10.9937 14.7779 10.8919 14.465C10.7902 14.1523 10.7393 13.8148 10.7393 13.453V12.9102C10.7393 11.953 10.9917 11.2331 11.4969 10.7506C12.0018 10.2682 12.7368 10.0269 13.7017 10.0269C14.071 10.0269 14.4328 10.0986 14.7873 10.2417L14.7873 8.20643ZM14.7873 11.3838C14.6214 11.2859 14.4311 11.2181 14.2163 11.1802C14.0015 11.1426 13.7997 11.1237 13.6113 11.1237C13.3098 11.1237 13.0553 11.1652 12.8481 11.248C12.6407 11.3311 12.4711 11.4479 12.3393 11.5986C12.2072 11.7495 12.1132 11.9304 12.0565 12.1413C12 12.3525 11.9718 12.5824 11.9718 12.8311V13.2495C11.9718 13.4606 11.9868 13.6661 12.017 13.8657C12.047 14.0655 12.1055 14.2408 12.1923 14.3915C12.2788 14.5424 12.3976 14.6648 12.5484 14.7589C12.6991 14.8533 12.895 14.9003 13.1364 14.9003C13.2947 14.9003 13.451 14.874 13.6057 14.8211C13.7601 14.7685 13.909 14.6987 14.0523 14.612C14.1954 14.5254 14.3293 14.4293 14.4537 14.3236C14.578 14.2181 14.6893 14.1088 14.7873 13.9957V11.3838Z" fill="white"/>
                  <path d="M17.5911 9.52934C17.5911 9.31841 17.6194 9.11293 17.676 8.91309C17.7325 8.71348 17.821 8.53627 17.9416 8.38166C18.0621 8.22728 18.2205 8.10287 18.4165 8.00856C18.6124 7.91439 18.8462 7.86719 19.1176 7.86719C19.2457 7.86719 19.3907 7.88043 19.5529 7.90678C19.715 7.93327 19.8563 7.96525 19.977 8.00292V8.97532H19.5246C19.2909 8.97532 19.1157 9.03943 18.9989 9.16755C18.882 9.29582 18.8237 9.47284 18.8237 9.69898V10.1626H19.9205L19.5926 11.1802H18.8237V15.8614H17.5912V11.1802H16.8789V10.1626H17.5912V9.52934H17.5911Z" fill="white"/>
                </svg>
              </div>
              <div v-else>
                <i class="zi-doc text-2xl text-gray-200" />
              </div>
            </div>
            <div class="px-sm">
              <a
                :href="file.url"
                target="_blank"
                class="text-blue-500 hover:text-white transition-colors duration-100 ease-out"
              >{{ file.filename }}</a>
            </div>
            <div
              class="file-list__close cursor-pointer transition-opacity duration-100 ease-out"
              @click="removeFile(i)"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="7" fill="#222222"/>
                <path d="M4.5 4.20711L6.29289 6L6 6.29289L4.20711 4.5L4.5 4.20711ZM6.70711 7L7 6.70711L7.29289 7L7 7.29289L6.70711 7ZM8 6.29289L7.70711 6L9.5 4.20711L9.79289 4.5L8 6.29289ZM7.70711 8L8 7.70711L9.79289 9.5L9.5 9.79289L7.70711 8ZM6 7.70711L6.29289 8L4.5 9.79289L4.20711 9.5L6 7.70711Z" stroke="#676767"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
import FileUploader from '../FileUploader.vue'
import clientDetail from '../../mixins/clientDetail'

export default {
  name: 'ExtraInfo',
  components: {
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
  data () {
    return {
      attachFileAccept: 'application/pdf,application/msword,application/vnd.ms-excel,text/plain',
      attachFileLoading: false,
      fileUploadLoading: false,
      lazyTags: this.item.tags || [],
      lazyFiles: this.item.files || [],
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    inputTags () {
      return this.lazyTags.join(',')
    },
    files () {
      return this.lazyFiles || []
    },
  },
  watch: {
    'item.tags' (val) {
      this.lazyTags = val || []
    },
    'item.files' (val) {
      this.lazyFiles = val || []
    },
  },
  methods: {
    attachFile (val) {
      const files = [...this.files, val]
      this.lazyFiles = files
      const inputFiles = files.map(el => {
        return {
          filename: el.filename,
          contentType: el.contentType,
          url: el.url,
        }
      })
      this.updateData({ files: inputFiles })
    },
    removeFile (i) {
      this.lazyFiles.splice(i, 1)
      const inputFiles = this.lazyFiles.map(el => {
        return {
          filename: el.filename,
          contentType: el.contentType,
          url: el.url,
        }
      })
      this.updateData({ files: inputFiles })
    },
    updateTags (e) {
      const value = e.target.value || ''
      const tags = []
      value.split(',').forEach(s => {
        if (s && s.trim() !== '') {
          tags.push(s.trim())
        }
      })
      this.updateData({ tags })
    },
  },
}
</script>
