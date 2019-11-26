<template>
  <div class="p-8 supplier-list-container">
    <ul class="ml-6 text-primary">
      <li
        v-for="(supplier, index) in supplierList"
        :key="index"
        @click="$emit('chooseSupplier', supplier.id)"
        class="supplier__company-name">
        <span>
            <Icon>
              {{ icons.ziGear }}
            </Icon>
          </span>
        {{ supplier.name }}
      </li>
    </ul>
    <Button
      outline
      class="mt-4"
    >
      <template>
        <Icon class="-ml-4 mr-2">{{ icons.mdiPlusCircleOutline }}</Icon>
      </template>
      <span>{{ $t('paper.addParagraph') }}</span>
    </Button>
  </div>
</template>

<script>
import { mdiPlusCircleOutline } from '@mdi/js'
import { ziGear } from '@/assets/icons'

export default {
  name: 'PaperCompanyListModal',
  data () {
    return {
      supplierList: [
        { id: 1, name: 'Nowaday Union Limited' },
        { id: 2, name: ' OOO «Рoга и Копыта»' },
        { id: 3, name: 'ОАО «Лесспецстройгазмонтажпром»' },
        { id: 4, name: 'ИП Васильев. И.П.' },
      ],
      icons: {
        ziGear,
        mdiPlusCircleOutline,
      },
    }
  },
}
</script>

<style scoped lang="postcss">
  li:hover  span {
    display: block;
  }
  li > span {
    display: none;
    position: absolute;
    left: -28px;
  }
  .supplier-list-container {
    background-color: #dddddd;
  }
  .supplier__company-name {
    @apply relative cursor-pointer;
  }
  .supplier__company-name {
    color: #6996B2;
  }
</style>
