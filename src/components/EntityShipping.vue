<template>
  <div>
    <div class="flex items-center text-lg leading-tight pt-10">
      <div class="flex-grow text-white font-semibold tracking-widest" @click="toggleExpand">
        Информация для отгрузки
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
      <div v-show="expanded" class="pt-4">
        <div class="pb-2">
          <TextField
            label="Грузополучатель"
            placeholder="Наименование компании"
          />
        </div>
        <div class="pb-2">
          <TextField
            label="Адрес выдачи товара (адрес доставки груза)"
            placeholder="оф. 8, стр. 11, ул. Строительная 84, Москва, Россия"
          />
        </div>
        <div class="pb-2 lg:pb-1">
          <div class="flex justify-between">
            <TextField
              label="Индекс адреса доставки"
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
              Если у компании совпадают адрес доставки и фактический адрес, активируйте переключатель для автозаполнения.
            </div>
          </div>
        </div>
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
        <div>
          <TextField
            label="Мобильный телефон"
            placeholder="123-4567-8901"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: 'EntityShipping',
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
