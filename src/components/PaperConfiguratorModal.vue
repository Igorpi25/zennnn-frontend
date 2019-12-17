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
        v-model="blank.name"
        :placeholder="$t('paper.name')"
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
                v-model="blank.title"
                :placeholder="$t('paper.heading')"
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
                v-model="blank.country"
                :placeholder="$t('paper.location')"
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
              v-model="blank.docHeader"
              :disabled="isStandardHeader"
              :placeholder="$t('paper.textField')"
              hide-details
              single-line
              text-dark
              transparent
              rows="1"
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

        <div
          v-for="(item, index) in blank.items" :key="index"
          class="paper-custom-paragraph mt-10"
        >
          <div class="paper-custom-paragraph__title heading">
            <span
              class="heading__number flex items-center cursor-pointer"
              @click="changePos(index, blank.items)"
            >
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
              v-model="item.title"
              :placeholder="$t('paper.paragraphHeading')"
              single-line
              text-dark
              hide-details
            />
            <span
              class="remove-item"
              @click="removeItem(blank.items, index)"
            >
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
              <!-- <Icon icon-name="delete-circle" /> -->
            </span>
          </div>
          <div>
            <div
              v-for="(paragraph, idx) in item.paragraphs" :key="idx"
              class="paragraph relative"
            >
              <span
                class="paragraph__number flex cursor-pointer"
                @click="changePos(idx, item.paragraphs)"
              >
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
                v-model="item.paragraphs[idx]"
                :placeholder="$t('paper.paragraph')"
                hide-details
                single-line
                text-dark
                transparent
                rows="1"
                auto-grow
              />
              <span
                class="remove-item"
                @click="removeParagraph(blank.items, index, idx)"
              >
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
              <ul v-for="supplier in currentSupplier" :key="supplier.id">
                <li class="flex">
                  <span class="-ml-4 mr-2">{{ $t('paper.requisites.supplier') }}</span>
                  <div
                    class="paper-details__supplier"
                    @click="openSupplierList"
                  >
                    <Icon>
                      {{ icons.ziGear }}
                    </Icon>
                    <span class="supplier__company-name">{{ supplier.name }}</span>
                  </div>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.address') }}</span>
                  <span class="w-2/3">{{ supplier.legalAddress }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.postcode') }}</span>
                  <span class="w-2/3">{{ supplier.leagalAddressPostcode || '_ _ _ _ _ _' }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.phone') }}</span>
                  <span class="w-2/3">{{ supplier.phone }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.fax') }}</span>
                  <span class="w-2/3">{{ supplier.fax }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.email') }}</span>
                  <span class="w-2/3">{{ supplier.email }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.bank') }}</span>
                  <span class="w-2/3">{{ supplier.bankName }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.bankAddress') }}</span>
                  <span class="w-2/3">{{ supplier.bankAddress }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.accountNumber') }}</span>
                  <span class="w-2/3">{{ supplier.bankAccountNumber }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.swift') }}</span>
                  <span class="w-2/3">{{ supplier.swift }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.fullName') }}</span>
                  <span class="w-2/3">{{ supplier.ownerFullName }}</span>
                </li>
                <li class="flex">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.position') }}</span>
                  <span class="w-2/3">{{ supplier.ownerJobPosition }}</span>
                </li>
                <li class="flex mt-4">
                  <span class="w-1/3 -ml-4 mr-2">{{ $t('paper.requisites.signatureStamp') }}</span>
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
              <span class="text-gray-lighter">{{ blank.title }}</span>
            </span>
          </div>
          <div class="paper-title__info">
            <span>
               <TextField
                v-model="blank.country"
                :placeholder="$t('paper.location')"
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
              v-model="blank.specItems[0].title"
              :placeholder="$t('paper.deliveryItem')"
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
          v-for="(item, index) in blank.specItems.slice(1)" :key="index"
          class="paper-custom-paragraph mt-10"
        >
          <div class="paper-custom-paragraph__title heading">
            <span
              class="heading__number flex items-center cursor-pointer"
              @click="changePos(index + 1, blank.specItems)"
            >
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
              v-model="item.title"
              :placeholder="$t('paper.paragraphHeading')"
              single-line
              text-dark
              hide-details
            />
            <span
              class="remove-item"
              @click="removeItem(blank.specItems, index + 1)"
            >
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
            </span>
          </div>
          <div
            v-for="(paragraph, idx) in item.paragraphs" :key="idx"
            class="paragraph relative"
          >
            <span
              class="paragraph__number flex cursor-pointer"
              @click="changePos(idx, item.paragraphs)"
            >
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
              v-model="item.paragraphs[idx]"
              :placeholder="$t('paper.paragraph')"
              hide-details
              single-line
              text-dark
              transparent
              rows="1"
            />
            <span
              class="remove-item"
              @click="removeParagraph(blank.specItems, index + 1, idx)"
            >
              <i>
                <img src="@/assets/icons/delete-circle.svg" alt="Remove">
              </i>
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
    <span
      class="close-btn"
      @click="$emit('close')"
    >
      <Icon>{{ icons.mdiClose }}</Icon>
    </span>
  </div>
</template>

<script>
import { mdiPlusCircleOutline, mdiClose } from '@mdi/js'
import { ziGear, ziPencil, ziChevronUpCircle } from '@/assets/icons'

import { GET_ORG_REQUISITE } from '../graphql/queries'

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
  apollo: {
    getOrgRequisite: {
      query: GET_ORG_REQUISITE,
      variables () {
        return {
          id: this.reqId,
        }
      },
      fetchPolicy: 'cache-and-network',
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
      reqId: '5def49752edff60026562dca',
    }
  },
  computed: {
    currentSupplier () {
      return [this.getOrgRequisite]
    },
  },
  methods: {
    addHeading (blank) {
      blank.push({
        title: '',
        paragraphs: [''],
      })
    },
    addParagraph (blank, index) {
      blank[index].paragraphs.push('')
    },
    removeItem (blank, index) {
      blank.splice(index, 1)
    },
    removeParagraph (blank, index, idx) {
      blank[index].paragraphs.splice(idx, 1)
    },
    useStandardHeader () {
      this.isStandardHeader = !this.isStandardHeader
      if (this.isStandardHeader) this.blank.docHeader = ''
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
      this.reqId = id
      this.supplierList = false
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
