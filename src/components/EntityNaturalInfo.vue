<template>
  <div class="flex flex-wrap">
    <div class="w-full lg:w-1/2 lg:pr-5">
      <div class="flex items-end pb-2">
        <TextField
          label="Контактное лицо"
          label-no-wrap
          placeholder="Имя"
          class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
        />
        <TextField
          placeholder="Фамилия"
          class="flex-grow"
        />
      </div>
      <div class="pb-2">
        <TextField
          label="Мобильный телефон"
          label-hint="Убедитесь в безошибочности введенного номера мобильного. Данный телефон будет использован для отправки автоматических уведомлений, которые существенно упрастят совместную работу."
          placeholder="123-4567-8901"
        />
      </div>
      <div class="pb-2">
        <TextField
          label="Электронная почта"
          label-hint="Убедитесь в безошибочности введенного адреса электронной почты. Данный адрес будет использован для отправки автоматических уведомлений, которые существенно упрастят совместную работу."
          placeholder="example@mail.com"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <TextField
          label="Язык для отправки уведомлений и печати документов"
          placeholder="Выберите язык"
          class="pb-2"
        />
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            Для того, чтобы ваши клиенты получали уведомления на понятном для них языке, необходимо установить язык для отправки уведомлений. Также все документы будут содержать установленный вами язык и английский.
          </div>
        </div>
      </div>
      <div class="pb-2 lg:pb-0">
        <div class="flex text-pink-500 bg-pink-500 bg-opacity-10 rounded-md p-4">
          <div class="pr-4 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.3832 0 0 5.38327 0 12.0001C0 18.6169 5.3832 24 12 24C18.6168 24 24 18.6169 24 12.0001C24 5.38327 18.6168 0 12 0ZM12 21.8182C6.58618 21.8182 2.18182 17.4138 2.18182 12.0001C2.18182 6.58633 6.58618 2.18182 12 2.18182C17.4138 2.18182 21.8182 6.58633 21.8182 12.0001C21.8182 17.4138 17.4137 21.8182 12 21.8182Z" fill="currentColor"/>
              <path d="M12.0002 5.09082C11.1983 5.09082 10.5459 5.74362 10.5459 6.54602C10.5459 7.34769 11.1983 7.99991 12.0002 7.99991C12.802 7.99991 13.4544 7.34769 13.4544 6.54602C13.4544 5.74362 12.802 5.09082 12.0002 5.09082Z" fill="currentColor"/>
              <path d="M12.0001 10.1816C11.3976 10.1816 10.9092 10.6701 10.9092 11.2725V17.818C10.9092 18.4205 11.3976 18.9089 12.0001 18.9089C12.6026 18.9089 13.091 18.4205 13.091 17.818V11.2725C13.091 10.6701 12.6026 10.1816 12.0001 10.1816Z" fill="currentColor"/>
            </svg>
          </div>
          <div class="flex-grow text-sm leading-tight">
            ZENNNN не рекомендует хранить паспортные данные физических лиц в системе. Обычно, для заключения договоров и контрактов достаточно имени, фамилии и даты рождения клиента. Если местное законодатель- ство требует включения паспортных данных в качестве реквизитов, то эти данные можно указать ниже. Они будут автоматически подставлены во все необходимые документы. Идеальным решением будет сделать копию паспорта клиента и хранить ее в безопасном месте, а в системе указать только имя, фамилию и дату рождения.
          </div>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-1/2 lg:pl-5">
      <div class="pb-2">
        <TextField
          label="Имя клиента"
          placeholder="Иван"
        />
      </div>
      <div class="pb-2 lg:pb-1">
        <div class="flex">
          <TextField
            label="Фамилия клиента"
            placeholder="Иванов"
            class="pb-2 flex-grow"
          />
          <div class="relative flex-shrink-0 relative w-10 pl-sm">
            <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
              Совпадает
            </label>
            <div class="h-full flex items-center pt-8" />
          </div>
        </div>
        <div class="relative lg:pb-20">
          <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
            Если клиент и контактное лицо — это один и тот же человек, активируйте переключатель для автозаполнения. Убедитесь, что имя и фамилия указаны, как в паспорте (ID) и на языке клиента или английском.
          </div>
        </div>
      </div>
      <div class="pb-2">
        <TextField
          label="Отчество (если есть)"
          placeholder="Иванович"
        />
      </div>
      <div class="flex items-end pb-2">
        <TextField
          label="Дата рождения"
          label-no-wrap
          placeholder="Дата"
          class="w-1/2 pr-4"
        >
          <template v-slot:prepend>
            <i class="icon-calendar text-lg" />
          </template>
        </TextField>
        <div class="w-1/2 pl-4 opacity-40">
          <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
            Аватар
          </label>
          <div class="h-10 flex justify-start relative pl-12">
            <div class="absolute bottom-0 pl-4">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="28" cy="28" r="27.5" fill="#404040" stroke="#676767"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M27.9998 18.4C25.2841 18.4 23.0826 20.6015 23.0826 23.3172C23.0826 26.0328 25.2841 28.2343 27.9998 28.2343C30.7154 28.2343 32.9169 26.0328 32.9169 23.3172C32.9169 20.6015 30.7154 18.4 27.9998 18.4ZM32.4974 29.0892C34.2135 27.7502 35.3169 25.6625 35.3169 23.3172C35.3169 19.276 32.0409 16 27.9998 16C23.9586 16 20.6826 19.276 20.6826 23.3172C20.6826 25.6625 21.786 27.7502 23.5021 29.0892C19.527 30.6649 16.5766 34.2674 15.9242 38.6222L15.7178 40H40.2818L40.0753 38.6222C39.4229 34.2674 36.4725 30.6649 32.4974 29.0892ZM27.9998 30.6343C23.5713 30.6343 19.8266 33.5693 18.6075 37.6H37.3921C36.1729 33.5693 32.4282 30.6343 27.9998 30.6343Z" fill="#676767"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
          Уникальный номер клиента
        </label>
        <div class="h-10 flex items-center text-white mb-2 px-sm">
          B00001
        </div>
        <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
          Уникальный номер клиента (УНК) генерируется системой автоматически. Литера «А» соответствует коммерческим организациям (юр. лицам), «В» — частным лицам (физ. лицам), «С» — некоммерческим организациям и прочим.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EntityNaturalInfo',
}
</script>
