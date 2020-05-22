<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          :label="$t('companyDetail.label.contactPerson')"
          :placeholder="$t('companyDetail.placeholder.firstName')"
          label-no-wrap
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
          disabled
        />
        <TextField
          :placeholder="$t('companyDetail.placeholder.lastName')"
          class="flex-grow"
          disabled
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.mobilePhone"
          :label="$t('companyDetail.label.mobilePhone')"
          :label-hint="$t('companyDetail.hint.mobilePhone')"
          :placeholder="$t('companyDetail.placeholder.mobilePhone')"
          @input="$emit('update', 'mobilePhone', $event)"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.naturalEmail"
          :label="$t('companyDetail.label.email')"
          :label-hint="$t('companyDetail.hint.email')"
          :placeholder="$t('companyDetail.placeholder.email')"
          @input="$emit('update', 'naturalEmail', $event)"
        />
      </div>
      <div class="pb-2 lg:pb-1">
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
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.clientLocale') }}
          </div>
        </div>
      </div>
      <div class="pb-2 lg:pb-0">
        <Alert
          :value="true"
          :close="false"
          text-color="text-pink-500"
          bg-color="bg-pink-500 bg-opacity-10"
          icon-color="text-pink-500"
          max-width="none"
          class="py-4"
        >
          {{ $t('companyDetail.privacyWarning') }}
        </Alert>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          :value="item.firstName"
          :label="$t('companyDetail.label.givenName')"
          :placeholder="$t('companyDetail.placeholder.givenName')"
          @input="$emit('update', 'firstName', $event)"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            :value="item.lastName"
            :label="$t('companyDetail.label.familyName')"
            :placeholder="$t('companyDetail.placeholder.familyName')"
            class="pb-2 flex-grow"
            @input="$emit('update', 'lastName', $event)"
          />
          <div class="relative flex-shrink-0 relative w-12 pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              {{ $t('companyDetail.label.matches') }}
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput disabled hide-details />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            {{ $t('companyDetail.hint.familyName') }}
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          :value="item.middleName"
          :label="$t('companyDetail.label.middleName')"
          :placeholder="$t('companyDetail.placeholder.middleName')"
          @input="$emit('update', 'middleName', $event)"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          :label="$t('companyDetail.label.birthdate')"
          :placeholder="$t('companyDetail.placeholder.date')"
          label-no-wrap
          class="w-1/2 pr-4"
          disabled
        >
          <template v-slot:prepend>
            <i class="zi-calendar text-lg" />
          </template>
        </TextField>
        <div class="w-1/2 pl-4 opacity-40">
          <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
            {{ $t('companyDetail.label.avatar') }}
          </label>
          <div class="h-10 flex justify-start relative pl-12">
            <div class="absolute bottom-0 pl-4">
              <div class="flex items-center justify-center w-14 h-14 border border-gray-200 text-gray-200 bg-gray-400 rounded-full">
                <i class="zi-user text-3xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          {{ $t('companyDetail.label.ucn') }}
        </label>
        <div class="h-10 flex items-center text-white mb-2 px-sm">
          {{ item.uid || 'B00001' }}
        </div>
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          {{ $t('companyDetail.hint.ucn') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NaturalInfo',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
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
  },
}
</script>
