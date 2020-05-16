<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight" @click="toggleExpand">
        <span class="text-white uppercase font-semibold tracking-widest">РЕКВИЗИТЫ клиента</span>
        <span class="text-gray-200 mr-1"> (указывайте, как в паспорте)</span>
        <v-tooltip top max-width="272" nudge-bottom="5" nudge-right="104">
          <template v-slot:activator="{ on }">
            <i class="zi-help align-middle text-base text-blue-500 hover:text-blue-600 cursor-pointer" v-on="on" />
          </template>
          <span>
            Все указанные в этом разделе данные будут подставлены в договор, контракт, инвойс и прочие документы, которые система подготовит автоматически. Также в документах будет использовано ФИО и дата рождения клиента. Непосредственно перед тем как поделится с клиентом данными о совместной сделке, вы сможете устаовить, какие документы показать клиенту.
          </span>
        </v-tooltip>
      </div>
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
      <div v-show="expanded" class="flex flex-wrap pt-2">
        <div class="w-full lg:w-1/2 lg:pr-5">
          <div class="pb-2">
            <TextField
              label="Номер паспорта или ID"
              placeholder="Номер документа"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Гражданство"
              placeholder="Выберите страну"
            >
              <template v-slot:prepend>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 18.63 5.37012 24 12 24C18.63 24 24 18.63 24 12C24 5.37012 18.63 0 12 0C5.37012 0 0 5.37012 0 12ZM2.49993 12C2.49993 11.23 2.59007 10.48 2.76486 9.76511L4.99991 12L4.49999 15L6.5 16.9999V19.7451C4.08009 18.025 2.49993 15.1954 2.49993 12ZM9.81491 2.75484C10.5149 2.58496 11.2451 2.49998 12 2.49998C12.835 2.49998 13.645 2.61005 14.415 2.81004L14 3.5001L14.5 4.00002H16.0001L16.4152 3.58501C16.7646 3.77004 17.0948 3.97003 17.4151 4.195L16.5002 4.49999L15.5 5.49994L16.5002 5.99997V6.5H15.5V7.49995C15.5 7.49995 16.1899 7.99998 16.9999 7.99998C17.795 7.99998 17.4401 6.90499 18.0001 6.5C18.5651 6.0949 19.2502 6.18499 19.2502 6.18499L19.5752 6.26997C20.1852 7.07488 20.6699 7.97511 21 8.94991V8.99993C21 8.99993 20.295 8.4999 19.0001 8.4999C17.7052 8.4999 16.5002 8.99993 16.5002 8.99993C16.5002 8.99993 15.0898 9.41009 15 10.5C14.8448 12.3749 15.5 13 15.5 13L18.0001 14.4999V19.3653C16.3653 20.7002 14.275 21.5 12 21.5C10.9251 21.5 9.89504 21.3253 8.92998 20.9951L11.5 15L11.0001 12.5C11.0001 12.5 9.01496 9.99994 8.00004 9.99994C6.98517 9.99994 6.50006 11.4999 6.50006 11.4999L5.5 9.50002L8.49996 7.49995L9.99999 3.49999L9.81491 2.75484Z" fill="#676767"/>
                </svg>
              </template>
            </TextField>
          </div>
          <div class="pb-2">
            <div class="flex">
              <TextField
                label="Дата выдачи"
                label-no-wrap
                placeholder="Дата"
                class="w-1/2 pr-sm"
                style="max-width: 232px"
              >
                <template v-slot:prepend>
                  <i class="zi-calendar text-lg" />
                </template>
              </TextField>
              <TextField
                label="Действителен до"
                label-no-wrap
                placeholder="Дата"
                class="w-1/2"
                style="max-width: 232px"
              >
                <template v-slot:prepend>
                  <i class="zi-calendar text-lg" />
                </template>
              </TextField>
            </div>
          </div>
          <div class="pb-2">
            <TextField
              label="Кем выдано"
              placeholder="Наименование органа власти"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Адрес места жительства"
              placeholder="Of. 1010, Miramar Tower, 35 Nathan Rd., Kowloon, Hong Kong"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Индекс юр. адреса"
              placeholder="000000"
              class="w-48"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Почтовый адрес"
              placeholder="Of. 1010, Miramar Tower, 35 Nathan Rd., Kowloon, Hong Kong"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                label="Индекс почтового адреса"
                placeholder="000000"
                class="w-48 pb-2"
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
                Если у клиента совпадают адрес места жительства и почтовый адрес, активируйте переключатель для автозаполнения.
              </div>
            </div>
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              label="ИНН / VAT"
              placeholder="Номер ИНН или VAT"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Банк получателя"
              placeholder="Наименование банка получателя"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Адрес банка получателя"
              placeholder="1/F, Causeway Bay Plaza 2, 463-483 Lockhart Rd., Causeway Bay, Hong Kong"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Номер счёта"
              placeholder="Номер счёта"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              label="SWIFT"
              placeholder="HSBCHKHHHKH"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
            />
            <TextField
              label="БИК"
              placeholder="Номер БИК"
              class="flex-grow"
            />
          </div>
          <div>
            <div class="flex items-end pb-2">
              <TextField
                label="Телефон"
                placeholder="123-4567-8901"
                class="w-1/2 pr-2"
              />
              <TextField
                label="Факс"
                placeholder="123-4567-8901"
                class="w-1/2 pl-2"
              />
            </div>
            <div class="text-sm text-gray-200 leading-tight pl-sm pb-2 lg:pb-0">
              Этот телефон и факс будут указаны во всех документах, как контактные данные клиента.
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'EntityNaturalDetail',
  data () {
    return {
      expanded: true,
    }
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
