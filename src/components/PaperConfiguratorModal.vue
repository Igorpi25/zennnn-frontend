<template>
  <div class="modal">

    <v-dialog
      v-model="supplierList"
      max-width="400"
    >
      <PaperCompanyListModal
        @chooseSupplier="chooseSupplier"
      />
    </v-dialog>

    <div class="modal-header">
      <Icon size="28">
        {{ icons.ziPencil }}
      </Icon>
      <TextField
        :placeholder="$t('paper.name')"
        v-model="blank.name"
        outlined
        hide-details
        class="w-5/6 ml-6"
      />
    </div>
    <div class="modal-body">

      <div class="modal-paper">
        <div class="paper-title">
          <div class="flex flex-col md:flex-row justify-between">
            <span class="paper-title__title mb-8 md:mt-0">
              <Editable
                :placeholder="$t('paper.heading')"
                v-model="blank.heading"
                type="editable"
                single-line
                text-dark
                hide-details
              />
            </span>
            <v-tooltip top max-width="600">
              <template v-slot:activator="{ on }">
                <span class="paper-title__number" v-on="on">A0000-26082020-1</span>
              </template>
              <span class="text-sm">
                {{ $t('paper.specNumber') }}
              </span>
            </v-tooltip>
          </div>
          <div class="paper-title__info">
            <span>
              <TextField
                :placeholder="$t('paper.location')"
                v-model="blank.location"
                single-line
                text-dark
                hide-details
              />
            </span>
            <v-tooltip top max-width="340">
              <template v-slot:activator="{ on }">
                <span class="mt-8 sm:mt-0" v-on="on">{{ $t('paper.date') }}</span>
              </template>
              <span class="text-sm">
                {{ $t('paper.paperDate') }}
              </span>
            </v-tooltip>
          </div>
          <div class="paper-title__textfield mt-8">
            <TextArea
              :placeholder="$t('paper.textField')"
              hide-details
              single-line
              text-dark
              transparent
              :rows="blank.textFieldRows"
              v-model="blank.textField"
            />
          </div>
          <Checkbox
            class="-ml-6 text-primary"
            hide-details
            vertical-align
            @input="useStandardHeader"
          >
            <span class="ml-2 mb-2 text-sm text-black">{{ $t('paper.contractHeader') }}</span>
          </Checkbox>
        </div>

        <div class="paper-custom-paragraph mt-10" v-for="(item, index) in blank.items" :key="index">
          <div class="paper-custom-paragraph__title heading">
            <span class="heading__number flex items-center cursor-pointer" @click="changePos(index, blank.items)">
              <i v-if="index > 0" class="text-primary">
                <Icon
                  size="24"
                  class="icon-move-up--heading"
                >
                  {{ icons.ziChevronUpCircle }}
                </Icon>
              </i>
              <span>{{ index + 1 }}.</span>
            </span>
            <TextField
              :placeholder="$t('paper.paragraphHeading')"
              v-model="item.heading"
              single-line
              text-dark
              hide-details
            />
            <span
              @click="removeItem(blank.items, index)"
              class="remove-item">
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
              <!-- <Icon icon-name="delete-circle" /> -->
            </span>
          </div>
          <div>
            <div class="paragraph relative" v-for="(paragraph, idx) in item.paragraphs" :key="idx">
              <span class="paragraph__number flex cursor-pointer" @click="changePos(idx, item.paragraphs)">
                <i v-if="idx > 0" class="text-primary">
                  <Icon
                    size="24"
                    class="icon-move-up--paragraph"
                  >
                    {{ icons.ziChevronUpCircle }}
                  </Icon>
                </i>
                <span>{{ index + 1 }}.{{ idx + 1 }}.</span>
              </span>
              <TextArea
                :placeholder="$t('paper.paragraph')"
                hide-details
                single-line
                text-dark
                transparent
                rows="1"
                auto-grow
                v-model="paragraph.paragraph"
              />
              <span
                @click="removeParagraph(blank.items, index, idx)"
                class="remove-item">
                <i>
                  <img src="@/assets/icons/delete-circle.svg" alt="Remove">
                </i>
                <!-- <Icon icon-name="delete-circle" /> -->
              </span>
            </div>
          </div>
          <Button
            small
            outline
            class="mt-4"
            @click="addParagraph(blank.items, index)"
          >
            <template v-slot:icon>
              <Icon size="16">{{ icons.mdiPlusCircleOutline }}</Icon>
            </template>
            <span class="text-sm">{{ $t('paper.addParagraph') }}</span>
          </Button>
        </div>

        <Button
          outline
          class="mt-10"
          @click="addHeading(blank.items)"
        >
          <template v-slot:icon>
            <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
          </template>
          <span>{{ $t('paper.addHeading') }}</span>
        </Button>

        <div class="paper-requisites mt-10">
          <div class="paper-requsites__title heading">
            <span class="heading__number flex items-center">
                <span>{{ blank.items.length + 1 }}.</span>
              </span>
            <span>{{ $t('paper.details') }}</span>
          </div>

          <div class="paper-details mt-16 flex flex-col md:flex-row justify-around text-sm">
            <div class="w-full md:w-1/2 pl-4 md:pr-10 leading-none relative">
              <ul v-for="(supplier, index) in currentSupplier" :key="index">
                <li class="flex">
                  <span class="-ml-4 mr-2">{{ $t('suppliers.supplier') }}:</span>
                  <div
                    @click="openSupplierList"
                    class="paper-details__supplier"
                  >
                    <Icon>
                      {{ icons.ziGear }}
                    </Icon>
                    <span class="supplier__company-name">{{ supplier.companyName }}</span>
                  </div>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('suppliers.address') }}:</span>
                  <span class="w-2/3">{{ supplier.address }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">Индекс:</span>
                  <span class="w-2/3">_ _ _ _ _ _</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('suppliers.phone') }}:</span>
                  <span class="w-2/3">0086 186 200 00 000</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">Факс:</span>
                  <span class="w-2/3">0086 (20) 8421-7387</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">E-mail:</span>
                  <span class="w-2/3">infonowadays@gmail.com</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">Банк получателя:</span>
                  <span class="w-2/3">HSBC</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">Адрес банка:</span>
                  <span class="w-2/3">4/F HSBC, Tsim Sha Tsui Branch, 82-84 Nathan Rd., Kowloon, Hong Kong</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">Номер счета:</span>
                  <span class="w-2/3">817 - 636210 - 838</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">SWIFT:</span>
                  <span class="w-2/3">HSBCHKHHHKH</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">ФИО:</span>
                  <span class="w-2/3">{{ supplier.fullName }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">Должность:</span>
                  <span class="w-2/3">Директор</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">Подпись / Печать:</span>
                  <span class="w-2/3">_____________________</span>
                </li>
              </ul>
            </div>
            <div class="w-full md:w-1/2 mt-8 -ml-5 md:ml-0 md:mt-0 paper-buyer-details">
              {{ $t('paper.buyerDetails') }}
            </div>
          </div>

        </div>
      </div>

      <div class="modal-paper mt-4">
        <div class="paper-title">
          <div class="paper-title__title">
            <span>{{ $t('paper.specification') }} №A0000-26082020-1</span>
            <span class="block"> {{ $t('paper.to') }}
              <span class="text-gray-lighter">{{ blank.heading }}</span>
            </span>
          </div>
          <div class="paper-title__info">
            <span>
               <TextField
                :placeholder="$t('paper.location')"
                v-model="blank.location"
                single-line
                text-dark
                hide-details
              />
            </span>
              <v-tooltip top max-width="340">
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ $t('paper.date') }}</span>
                </template>
                <span class="text-sm">
                  {{ $t('paper.paperDate') }}
                </span>
              </v-tooltip>
            </div>
          </div>
        <div class="paper-delivery-item mt-10">
          <div class="paper-delivery-item__title heading">
            <span class="heading__number heading__nubmer--first">
                <span>1.</span>
              </span>
              <!-- SET VALUE {paper.deliveryItem} BY DEFAULT -->
            <TextField
              :placeholder="$t('paper.deliveryItem')"
              v-model="blank.specItems[0].heading"
              single-line
              text-dark
              hide-details
            />
          </div>
          <div class="paper-table">
            {{ $t('paper.table') }}
          </div>

        </div>
        <div
          class="paper-custom-paragraph mt-10"
         v-for="(item, index) in blank.specItems.slice(1)" :key="index"
        >
          <div class="paper-custom-paragraph__title heading">
            <span class="heading__number flex items-center cursor-pointer" @click="changePos(index + 1, blank.specItems)">
              <i v-if="index > 0" class="text-primary">
                <Icon
                  size="24"
                  class="icon-move-up--heading"
                >
                  {{ icons.ziChevronUpCircle }}
                </Icon>
              </i>
              <span>{{ index + 2 }}.</span>
            </span>
            <TextField
              :placeholder="$t('paper.paragraphHeading')"
              v-model="item.heading"
              single-line
              text-dark
              hide-details
            />
            <span
              @click="removeItem(blank.specItems, index + 1)"
              class="remove-item"
            >
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
              <!-- <Icon icon-name="delete-circle" /> -->
            </span>
          </div>
          <div
            class="paragraph relative"
            v-for="(paragraph, idx) in item.paragraphs" :key="idx"
          >
            <span class="paragraph__number flex cursor-pointer" @click="changePos(idx, item.paragraphs)">
              <i v-if="idx > 0" class="text-primary">
                <Icon
                  size="24"
                  class="icon-move-up--paragraph"
                >
                  {{ icons.ziChevronUpCircle }}
                </Icon>
              </i>
              <span>{{ index + 2 }}.{{ idx + 1 }}.</span>
            </span>
            <TextArea
              :placeholder="$t('paper.paragraph')"
              hide-details
              single-line
              text-dark
              transparent
              rows="1"
              v-model="paragraph.paragraph"
            />
            <span
              @click="removeParagraph(blank.specItems, index + 1, idx)"
              class="remove-item"
            >
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
              <!-- <Icon icon-name="delete-circle" /> -->
            </span>
          </div>
          <Button
            small
            outline
            class="mt-4"
            @click="addParagraph(blank.specItems, index + 1)"
          >
            <template v-slot:icon>
              <Icon size="16">{{ icons.mdiPlusCircleOutline }}</Icon>
            </template>
            <span class="text-sm">{{ $t('paper.addParagraph') }}</span>
          </Button>
        </div>

        <Button
          outline
          class="mt-10"
          @click="addHeading(blank.specItems)"
        >
          <template v-slot:icon>
            <Icon>{{ icons.mdiPlusCircleOutline }}</Icon>
          </template>
          <span>{{ $t('paper.addHeading') }}</span>
        </Button>
      </div>

    </div>
    <div class="modal-footer">
      <Button
        large
        class="mr-8"
        @click="$emit('savePaper')"
      >
        <span>{{ $t('action.save') }}</span>
      </Button>
    </div>
    <span class="close-btn" @click="$emit('close')">
      <Icon>{{ icons.mdiClose }}</Icon>
    </span>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiClose } from '@mdi/js'
import { ziGear, ziPencil, ziChevronUpCircle } from '@/assets/icons'

import PaperCompanyListModal from '@/components/PaperCompanyListModal.vue'

export default {
  name: 'PaperConfiguratorModal',
  components: {
    PaperCompanyListModal,
  },
  props: {
    blank: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      icons: {
        ziGear,
        ziPencil,
        ziChevronUpCircle,
        mdiPlusCircleOutline,
        mdiClose,
      },
      isStandardHeader: false,
      supplierList: false,
      suppliers: [
        {
          id: 1,
          companyName: 'Nowaday Union Limited',
          fullName: 'John Doe',
          address: 'Unit 1010, 10/F Miramar Tower, 132 Nathan Road, Tsim Sha Tsui, Kowloon, Hong Kong',
        },
        {
          id: 2,
          companyName: ' OOO «Рoга и Копыта»',
          fullName: 'Dow Johnes',
          address: 'Unit 1020, 20/B Trump Tower, 345 Faggot Road, Zinq Zanq Tao, Beijing',
        },
        {
          id: 3,
          companyName: 'ОАО «Лесспецстройгазмонтажпром»',
          fullName: 'Jow Dodge',
          address: 'Ulitsa Petrovskogo, 19, Yakutsk, Sakha Republic, 677027',
        },
        {
          id: 4,
          companyName: 'ИП Васильев. И.П.',
          fullName: 'Dog Von Staffordshire Terrier',
          address: '221b Baker St, Marylebone, London NW1 6XE, United Kingdom',
        },
      ],
      currentSupplier: [
        {
          id: 1,
          companyName: 'Nowaday Union Limited',
          fullName: 'John Doe',
          address: 'Unit 1010, 10/F Miramar Tower, 132 Nathan Road, Tsim Sha Tsui, Kowloon, Hong Kong',
        },
      ],
    }
  },
  methods: {
    addHeading (blank) {
      blank.push({
        heading: '',
        paragraphs: [
          { paragraph: '' },
        ],
      })
    },
    addParagraph (blank, index) {
      blank[index].paragraphs.push({ paragraph: '' })
    },
    removeItem (blank, index) {
      blank.splice(index, 1)
    },
    removeParagraph (blank, index, idx) {
      blank[index].paragraphs.splice(idx, 1)
    },
    useStandardHeader () {
      this.isStandardHeader = !this.isStandardHeader
      this.setStandardHeader()
    },
    setStandardHeader () {
      if (this.isStandardHeader) {
        this.blank.textFieldRows = 2
        this.blank.textField = `${this.currentSupplier[0].companyName} именуемое в дальнейшем «Поставщик» в лице генерального директора ${this.currentSupplier[0].fullName} и так далее и бла бла бла`
      } else {
        this.blank.textFieldRows = 1
        this.blank.textField = ''
      }
    },
    changePos (index, arr) {
      const curr = arr[index]
      const prev = arr[index - 1]

      arr.splice(index - 1, 1, curr)
      arr.splice(index, 1, prev)
    },
    openSupplierList () {
      this.supplierList = true
    },
    chooseSupplier (id) {
      this.supplierList = false
      this.currentSupplier = this.suppliers.filter(supplier => supplier.id === id)
      this.setStandardHeader()
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    display: flex;
    flex-direction: column;
    position: relative;
    @apply bg-accent1;
  }
  .modal-header {
    max-width: 906px;
    height: 70px;
    padding: 25px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    z-index: 999;
    color: #aaaaaa;
    background-color: #666666;
  }
  .modal-header > input {
    @apply w-3/4 h-8 ml-4 pl-4;
    font-size: 18px;
    background-color: #565656;
    outline: none;
  }
  .modal-header > input::placeholder {
    font-size: 18px;
    color: #7e7e7e;
  }
  .modal-body {
    height: 100%;
    flex-grow: 1;
    overflow-y: auto;
    color: #CDCDCD;
    background-color: #131313;
  }
  .modal-paper {
    width: 100%;
    height: auto;
    padding: 50px 10px 60px 50px;
    color: #131313;
    background-color: #d0d0d0;
  }
  .paper-title input {
    min-width: 250px;
    width: auto;
    background-color: #d0d0d0;
    border-bottom: 1px solid #888888;
    outline: none;
  }
  .paper-title input::placeholder {
    color: #888888;
  }
  .paper-title__title,
  .paper-title__number {
    font-size: 24px;
  }
  .paper-title__info {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #888888;
  }
  .paragraph {
    margin-top: 25px;
  }
  .modal-footer {
    width: 100%;
    height: 80px;
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background-color: #666666;
  }
  .heading {
    position: relative;
    font-size: 21px;
    font-weight: 700 !important;
  }
  .heading .text-field--single-line input {
    width: 100%;
    font-weight: 700 !important;
    outline: none;
  }
  .heading > input::placeholder {
    color: #888888;
  }
  .heading__number,
  .paragraph__number {
    position: absolute;
    top: 0;
    left: -24px;
    color: #888888
  }
  .paragraph__number {
    left: -28px;
  }
  .icon-move-up--heading,
  .icon-move-up--paragraph {
    width: 20px;
    position: absolute;
    top: 2px;
    left: -26px
  }
  .icon-move-up--paragraph {
    top: -1px;
    left: -21px;
  }
  .remove-item {
    position: absolute;
    top: 0;
    right: 0;
    font-weight: normal;
    font-size: 16px;
    cursor: pointer;
  }
  .paper-details__supplier {
    @apply flex items-center text-primary cursor-pointer;
    position: absolute;
    top: -5px;
    left: 25%;
  }
  .supplier__company-name {
    @apply ml-2;
  }
  .supplier__company-name:hover {
    color: #6996B2;
  }
  .paper-buyer-details {
    padding: 96px 30px;
    font-size: 14px;
    text-align: center;
    color: #888888;
    background-color: #cbcbcb;
  }
  .paper-table {
    margin-top: 15px;
    margin-left: -30px;
    padding: 50px 20px;
    font-size: 14px;
    text-align: center;
    color: #888888;
    background-color: #cbcbcb;
  }
  .close-btn {
    position: absolute;
    top: 5px;
    right: 15px;
    z-index: 1000;
    color: #fff;
    cursor: pointer;
  }
  .access {
    margin: 0;
  }

  @screen md {
    .modal-header > input {
      @apply ml-10
    }
    .modal-paper {
      padding: 50px 60px 60px 110px;
    }
    /* .paper-details__supplier {
      right: 80px;
    } */
    .paper-table {
      margin-left: -60px;
      padding: 50px 145px;
    }
  }
  @screen sm {
    .paper-title__info {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .modal-paper {
      padding: 50px 30px 60px 90px;
    }
    .heading__number,
    .paragraph__number {
      left: -37px;
    }
    .icon-move-up--heading,
    .icon-move-up--paragraph {
      width: 25px;
      position: absolute;
      top: 0;
      left: -37px
    }
    .icon-move-up--heading,
    .paragraph__number {
      left: -42px;
    }
    .icon-move-up--heading {
      top: 2px;
    }
    .remove-item {
      right: -25px;
    }
  }
</style>
