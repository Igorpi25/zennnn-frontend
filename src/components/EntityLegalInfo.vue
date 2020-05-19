<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <TextField
        :value="supplier ? item.manager : item.contactPerson"
        label="Контактное лицо"
        label-hint="Убедитесь в безошибочности введенного номера мобильного. Данный телефон будет использован для отправки автоматических уведомлений, которые существенно упрастят совместную работу."
        placeholder="Имя"
        @input="supplier ? $emit('update', 'manager', $event) : $emit('update', 'contactPerson', $event)"
      />
      <div class="pb-2">
        <TextField
          :value="supplier ? item.mobilePhone : ''"
          :disabled="!supplier"
          label="Мобильный телефон"
          label-hint="Убедитесь в безошибочности введенного номера мобильного. Данный телефон будет использован для отправки автоматических уведомлений, которые существенно упрастят совместную работу."
          placeholder="123-4567-8901"
          @input="$emit('update', 'mobilePhone', $event)"
        />
      </div>
      <div class="pb-2">
        <TextField
          :value="item.email"
          label="Электронная почта"
          label-hint="Убедитесь в безошибочности введенного адреса электронной почты. Данный адрес будет использован для отправки автоматических уведомлений, которые существенно упрастят совместную работу."
          placeholder="example@mail.com"
          @input="$emit('update', 'email', $event)"
        />
      </div>
      <div>
        <!-- <TextField
          label="Язык для отправки уведомлений и печати документов"
          placeholder="Выберите язык"
          class="pb-2"
        /> -->
        <Select
          :value="item.language"
          :items="langs"
          label="Язык для отправки уведомлений и печати документов"
          placeholder="Выберите язык"
          item-value="value"
          item-text="text"
          hide-details
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
            label="Наименование компании по-английски"
            placeholder="Укажите наименование компании"
            class="pb-2 flex-grow"
            @input="supplier ? $emit('update', 'companyNameSl', $event) : $emit('update', 'companyName', $event)"
          />
          <div class="relative flex-shrink-0 relative w-12 pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              Только англ.
            </label>
            <div class="h-full flex items-center justify-end pt-8 pb-1">
              <SwitchInput disabled hide-details />
            </div>
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            Если у компании существует наименование только на английском языке, активируйте переключатель для автозаполнения.
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          disabled
          label="Наименование компании (местное)"
          placeholder="На русском, китайском, любом другом языке"
        />
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          Уникальный номер клиента
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
  name: 'EntityLegalInfo',
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
        ? 'Для того, чтобы ваши поставщики получали уведомления на понятном для них языке, необходимо установить язык для отправки уведомлений. Также все документы будут содержать установленный вами язык и английский.'
        : 'Для того, чтобы ваши клиенты получали уведомления на понятном для них языке, необходимо установить язык для отправки уведомлений. Также все документы будут содержать установленный вами язык и английский.'
    },
    uidHint () {
      return this.supplier
        ? 'Уникальный номер поставщика (УНП) генерируется системой автоматически.'
        : 'Уникальный номер клиента (УНК) генерируется системой автоматически. Литера «А» соответствует коммерческим организациям (юр. лицам), «В» — частным лицам (физ. лицам), «С» — некоммерческим организациям и прочим.'
    },
    uidPlaceholder () {
      return this.supplier ? 'Z00001' : 'A00001'
    },
  },
}
</script>
