<template>
  <div>
    <div class="flex items-center pt-10">
      <div class="flex-grow text-lg leading-tight" @click="toggleExpand">
        <span class="text-white uppercase font-semibold tracking-widest">РЕКВИЗИТЫ КОМПАНИИ</span>
        <span class="text-gray-200 mr-1">{{ titleHint }}</span>
        <v-tooltip top max-width="272" nudge-bottom="5" nudge-right="104">
          <template v-slot:activator="{ on }">
            <i class="zi-help align-middle text-base text-blue-500 hover:text-blue-600 cursor-pointer" v-on="on" />
          </template>
          <span>
            Для правильности составления документов предназначенных для страны отправления или страны продажи товара, указываейте реквизиты компании клиента на его радном языке, попросите клиента прислать их вам и укажите эти реквизиты в полях ниже. В крайнем случае указывайте все реквизиты на английском языке.
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
              :value="item.itn"
              label="ИНН / VAT"
              placeholder="Номер ИНН или VAT"
              @input="$emit('update', 'itn', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddress"
              label="Адрес регистрации компании (юр. адрес)"
              placeholder="Of. 1010, Miramar Tower, 35 Nathan Rd., Kowloon, Hong Kong"
              @input="$emit('update', 'legalAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.legalAddressPostcode"
              label="Индекс юр. адреса"
              placeholder="000000"
              class="w-48"
              @input="$emit('update', 'legalAddressPostcode', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.mailingAddress"
              label="Фактический адрес (почтовый адрес)"
              placeholder="Of. 1010, Miramar Tower, 35 Nathan Rd., Kowloon, Hong Kong"
              @input="$emit('update', 'mailingAddress', $event)"
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <div class="flex justify-between">
              <TextField
                :value="item.mailingAddressPostcode"
                label="Индекс почтового адреса"
                placeholder="000000"
                class="w-48 pb-2"
                @input="$emit('update', 'mailingAddressPostcode', $event)"
              />
              <div class="relative flex-shrink-0 relative w-12 pl-sm">
                <label class="absolute top-0 right-0 block text-base text-gray-100 whitespace-no-wrap leading-5 py-2">
                  Совпадает
                </label>
                <div class="h-full flex items-center justify-end pt-8 pb-1">
                  <SwitchInput disabled hide-details />
                </div>
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-sm">
                Если у компании совпадают адрес регистрации и фактический адрес, активируйте переключатель для автозаполнения.
              </div>
            </div>
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.iec"
              label="КПП"
              placeholder="Номер КПП"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="$emit('update', 'iec', $event)"
            />
            <TextField
              :value="item.okpo"
              label="ОКПО"
              placeholder="Номер ОКПО"
              class="flex-grow"
              @input="$emit('update', 'okpo', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.psrn"
              label="ОГРН"
              placeholder="Номер ОГРН"
              @input="$emit('update', 'psrn', $event)"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.ownerFullName"
              label="ФИО директора"
              placeholder="Имя"
              class="w-1/2 md:w-56 flex-shrink-0 pr-sm"
              @input="$emit('update', 'ownerFullName', $event)"
            />
            <!-- <TextField
              class="flex-grow"
              placeholder="Фамилия"
            /> -->
          </div>
        </div>
        <div class="w-full lg:w-1/2 lg:pl-5">
          <div class="pb-2">
            <TextField
              :value="item.bankName"
              label="Банк получателя"
              placeholder="Наименование банка получателя"
              @input="$emit('update', 'bankName', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAddress"
              label="Адрес банка получателя"
              placeholder="1/F, Causeway Bay Plaza 2, 463-483 Lockhart Rd., Causeway Bay, Hong Kong"
              @input="$emit('update', 'bankAddress', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              :value="item.bankAccountNumber"
              label="Номер счёта"
              placeholder="Номер счёта"
              @input="$emit('update', 'bankAccountNumber', $event)"
            />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.swift"
              label="SWIFT"
              placeholder="HSBCHKHHHKH"
              class="w-1/2 md:w-48 flex-shrink-0 pr-sm"
              @input="$emit('update', 'swift', $event)"
            />
            <TextField
              :value="item.bic"
              label="БИК"
              placeholder="Номер БИК"
              class="flex-grow"
              @input="$emit('update', 'bic', $event)"
            />
          </div>
          <div class="pb-2">
            <TextField
              label="Банк корреспондент"
              placeholder="Наименование банка корреспондента"
              disabled
            />
          </div>
          <div class="pb-2 lg:pb-1">
            <TextField
              :value="item.correspondentAccountNumber"
              label="Корреспондентский счёт"
              placeholder="Номер счёта"
              class="pb-2"
              @input="$emit('update', 'correspondentAccountNumber', $event)"
            />
            <div class="lg:pb-20 mr-10" />
          </div>
          <div class="flex items-end pb-2">
            <TextField
              :value="item.phone"
              label="Телефон"
              placeholder="123-4567-8901"
              class="w-1/2 pr-2"
              @input="$emit('update', 'phone', $event)"
            />
            <TextField
              :value="item.fax"
              label="Факс"
              placeholder="123-4567-8901"
              class="w-1/2 pl-2"
              @input="$emit('update', 'fax', $event)"
            />
          </div>
          <div>
            <TextField
              label="Сайт"
              placeholder="https://www.site.com"
              disabled
            />
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'LegalDetail',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    supplier: Boolean,
  },
  data () {
    return {
      expanded: true,
    }
  },
  computed: {
    titleHint () {
      return this.supplier
        ? ' (указывайте на языке поставщика или английском)'
        : ' (указывайте на языке клиента или английском)'
    },
  },
  methods: {
    toggleExpand () {
      this.expanded = !this.expanded
    },
  },
}
</script>
