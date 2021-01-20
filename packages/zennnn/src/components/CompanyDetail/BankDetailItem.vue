<template>
  <div class="flex flex-wrap">
    <div class="lg:w-1/2 lg:pr-5">
      <div class="pb-2 lg:pb-1">
        <div class="flex justify-between">
          <TextField
            :model-value="internalItem.bankName"
            :label="$t('companyDetail.label.bankName')"
            :placeholder="$t('companyDetail.placeholder.bankName')"
            :loading="loading"
            :debounce="500"
            :rules="[rules.required]"
            state-icon
            required
            class="flex-grow pb-2"
            @update:model-value="updateData({ 'bankName': $event })"
          />
          <div class="relative flex-shrink-0 relative pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-nowrap leading-5 py-2">
              {{ $t('companyDetail.label.main') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <Switch
                v-model="isMainBankDetail"
                @update:model-value="$emit('set-main-bank-detail', internalItem.id)"
              />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.rule.mainBankName') }}
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          :model-value="internalItem.bankAddress"
          :label="$t('companyDetail.label.bankAddress')"
          :placeholder="$t('companyDetail.placeholder.bankAddress')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          @update:model-value="updateData({ 'bankAddress': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="internalItem.bankAccountNumber"
          :label="$t('companyDetail.label.bankAccountNumber')"
          :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          required
          @update:model-value="updateData({ 'bankAccountNumber': $event })"
        />
      </div>
    </div>
    <div class="lg:w-1/2 lg:pl-5">
      <div class="flex items-end pb-2">
        <TextField
          :model-value="internalItem.swift"
          :label="$t('companyDetail.label.swift')"
          :placeholder="$t('companyDetail.placeholder.swift')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          required
          class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
          @update:model-value="updateData({ 'swift': $event })"
        />
        <TextField
          :model-value="internalItem.bic"
          :label="$t('companyDetail.label.bic')"
          :placeholder="$t('companyDetail.placeholder.bic')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          class="flex-grow"
          @update:model-value="updateData({ 'bic': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="internalItem.correspondentBankName"
          :label="$t('companyDetail.label.correspondentBankName')"
          :placeholder="$t('companyDetail.placeholder.correspondentBankName')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updateData({ 'correspondentBankName': $event })"
        />
      </div>
      <div class="pb-2">
        <TextField
          :model-value="internalItem.correspondentAccountNumber"
          :label="$t('companyDetail.label.correspondentAccountNumber')"
          :placeholder="$t('companyDetail.placeholder.bankAccountNumber')"
          :loading="loading"
          :debounce="500"
          :rules="[rules.required]"
          state-icon
          state-error-color="none"
          @update:model-value="updateData({ 'correspondentAccountNumber': $event })"
        />
      </div>
      <div v-if="create" class="w-full pt-9">
        <Btn
          :loading="createLoading"
          block
          outlined
          class="h-10 text-sm"
          @click="$emit('create')"
        >
          {{ $t('companyDetail.addBankDetail') }}
        </Btn>
      </div>
    </div>
  </div>
</template>

<script>
import Btn from '../Base/Btn'
import Switch from '../Base/Switch'
import TextField from '../Base/TextField'

export default {
  name: 'BankDetailItem',
  components: {
    Btn,
    Switch,
    TextField,
  },
  props: {
    loading: Boolean,
    createLoading: Boolean,
    create: Boolean,
    item: {
      type: Object,
    },
    isDefaultBankDetail: Boolean,
  },
  emits: ['create', 'update', 'set-main-bank-detail'],
  data () {
    return {
      lazyItem: undefined,
      lazyIsMainBankDetail: this.isDefaultBankDetail,
      rules: {
        required: v => !!v || this.$t('rule.required'),
      },
    }
  },
  computed: {
    internalItem: {
      get () {
        return this.lazyItem || {}
      },
      set (val) {
        this.lazyItem = val
      },
    },
    isMainBankDetail: {
      get () {
        return this.lazyIsMainBankDetail
      },
      set (val) {
        this.lazyIsMainBankDetail = val
      },
    },
  },
  watch: {
    item: {
      handler (val) {
        this.$nextTick(() => {
          this.internalItem = val
        })
      },
      immediate: true,
    },
    isDefaultBankDetail (val) {
      this.lazyIsMainBankDetail = val
    },
  },
  methods: {
    updateData (input) {
      this.$emit('update', input)
    },
  },
}
</script>
