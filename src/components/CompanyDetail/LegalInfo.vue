<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          :value="supplier ? item.manager : item.contactPerson"
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          @input="supplier ? $emit('update', 'manager', $event) : $emit('update', 'contactPerson', $event)"
        />
        <TextField
          :placeholder="$t('companyDetail.placeholder.lastName')"
          class="flex-grow"
          disabled
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="supplier ? item.mobilePhone : ''"
          :disabled="!supplier"
          :label="$t('companyDetail.label.mobilePhone')"
          :label-hint="$t('companyDetail.hint.mobilePhone')"
          :placeholder="$t('companyDetail.placeholder.mobilePhone')"
          @input="$emit('update', 'mobilePhone', $event)"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.email"
          :label="$t('companyDetail.label.email')"
          :label-hint="$t('companyDetail.hint.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          @input="$emit('update', 'email', $event)"
        />
      </div>
      <div>
        <Select
          :value="item.language"
          :items="langs"
          :label="$t('companyDetail.label.locale')"
          :placeholder="$t('companyDetail.placeholder.locale')"
          item-value="value"
          item-text="text"
          class="pb-2"
          @input="$emit('update', 'language', $event)"
        />
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ localeSelectHint }}
        </div>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :value="supplier ? item.companyNameSl : item.companyName"
            :label="$t('companyDetail.label.companyName')"
            :placeholder="$t('companyDetail.placeholder.companyName')"
            class="pb-2 flex-grow"
            @input="supplier ? $emit('update', 'companyNameSl', $event) : $emit('update', 'companyName', $event)"
          />
          <div class="relative flex-shrink-0 relative w-12 pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              {{ $t('companyDetail.label.englishOnly') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput disabled hide-details />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.companyName') }}
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          :label="$t('companyDetail.label.companyNameLocal')"
          :placeholder="$t('companyDetail.placeholder.companyNameLocal')"
          disabled
        />
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          {{ $t('companyDetail.label.ucn') }}
        </label>
        <div class="h-10 flex items-center text-white mb-2 px-sm">
          {{ item.uid || uidPlaceholder }}
        </div>
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ uidHint }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LegalInfo',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    supplier: Boolean,
  },
  computed: {
    langs () {
      return [
        { value: 'en', text: 'English' },
        { value: 'zh-Hans', text: '简体' },
        { value: 'zh-Hant', text: '繁体' },
        { value: 'fr', text: 'Français' },
        { value: 'ru', text: 'Русский' },
        { value: 'uk', text: 'Український' },
      ]
    },
    localeSelectHint () {
      return this.supplier
        ? this.$t('companyDetail.hint.supplierLocale')
        : this.$t('companyDetail.hint.clientLocale')
    },
    uidHint () {
      return this.supplier
        ? this.$t('companyDetail.hint.usn')
        : this.$t('companyDetail.hint.ucn')
    },
    uidPlaceholder () {
      return this.supplier ? 'Z00001' : 'A00001'
    },
  },
}
</script>
