<template>
  <div class="spec-summary">

    <v-dialog
      v-model="paperList"
      max-width="443"
    >
       <PaperListModal
        :paper-list="papers"
        @close="paperList = false"
        @createPaper="createPaper"
        @editPaper="editPaper"
        @removePaper="removePaper"
      />
    </v-dialog>

    <v-dialog
      v-model="paperConfigurator"
      :fullscreen="$vuetify.breakpoint.xs || $vuetify.breakpoint.sm"
      content-class="dialog-full-height paper-configurator-dialog"
      max-width="906"
      scrollable
      persistent
    >
      <PaperConfiguratorModal
        ref="paper"
        :blank="blank"
        @close="beforeClose"
        @savePaper="savePaper"
      />
    </v-dialog>

    <v-dialog
      v-model="saveBeforeClose"
      max-width="520"
    >
      <SaveBeforeCloseModal
        :text=" `${$t('paper.saveChanges')} ${$t('paper.supplyContract')} ${$t('paper.beforeClosing')}`"
        :postScriptum="$t('paper.ifNotSave')"
        @dontSave="doNotSavePaperChanges"
        @cancel="cancel"
        @save="savePaperChanges"
      />
    </v-dialog>

    <div>
      <h4 class="text-lg mb-4">
        {{ $t('shipping.summaryTitle') }}
      </h4>
      <div class="spec-summary__wrapper flex-col lg:flex-row">
        <div class="spec-summary__info">
          <div v-if="spec.containers" class="relative">
            <div
              v-if="spec.shipped"
              class="spec-summary__container__image spec-summary__container__image--shipped w-full"
              style="left: -20px; width: 350px; background-size: auto; z-index: 1;"
            />
            <div
              v-if="spec.containers.length === 1"
              class="spec-summary__container"
            >
              <div
                class="spec-summary__container__image spec-summary__container__image--full"
                :style="{
                  width: (spec.containers[0].loaded || 0) + '%',
                  height: '85px'
                }"
              />
              <img width="210" height="85" src="/img/container-empty.svg" alt="">
            </div>
            <div v-else>
              <div
                v-for="(c, i) in loadedContainers"
                :key="`loaded-${i}`"
                class="spec-summary__container"
              >
                <div
                  class="spec-summary__container__image spec-summary__container__image--full-sm"
                  :style="{
                    width: '100%',
                    height: '48px'
                  }"
                />
                <div class="spec-summary__container__label">
                  {{ loadedContainers.length }} x {{ c.type }}′
                </div>
                <img width="210" height="48" src="/img/container-empty-sm.svg" alt="">
              </div>
              <div
                v-for="(c, i) in unloadedContainers"
                :key="`unloaded-${i}`"
                class="spec-summary__container"
              >
                <div
                  class="spec-summary__container__image spec-summary__container__image--full-sm"
                  :style="{
                    width: (c.loaded || 0) + '%',
                    height: '48px'
                  }"
                />
                <img width="210" height="48" src="/img/container-empty-sm.svg" alt="">
              </div>
            </div>
          </div>
          <div>
            <ul class="leaders">
              <li
                v-for="(c, i) in unloadedContainers"
                :key="i"
              >
                <span>
                  <span class="leaders__num">
                    {{ c.type || '20' }}{{ $t('shipping.containerMeasure') }}
                  </span>
                  {{ ` ${$t('shipping.container')} ${$t('shipping.containerLoaded')}` }}
                </span>
                <span class="leaders__num">
                  {{ c.loaded }}%
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.estimateDate') }}</span>
                <span class="leaders__num">
                  {{ $d($parseISO(spec.estimateShippingDate), 'short') }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalVolume') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalVolume, 'formatted') }} {{ $t('measure.m') }}<sup>3</sup>
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.totalWeight') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.totalWeight, 'formatted') }} {{ $t('measure.kg') }}
                </span>
              </li>
              <li>
                <span>{{ $t('shipping.qtyOfPackages') }}</span>
                <span class="leaders__num">
                  {{ $n(spec.qtyOfPackages, 'formatted') }}
                </span>
              </li>
            </ul>
            <ToggleButton
              :value="isSent"
              @input="isSent = !isSent"
              class="my-6"
            >
              <span>{{ $t('shipping.setShipped') }}</span>
            </ToggleButton>
          </div>
        </div>
        <div class="spec-summary__cost">
          <div class="spec-summary__cost__card">
            <ul class="leaders">
              <li>
                <span>
                  {{ $t('shipping.finalCost') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <!-- TODO to custom component or Intl polyfill -->
                <!-- i18n-n has Error formatter.formatToParts is not a function. -->
                <span class="flex">
                  <div class="cost-card__cost">{{ $n(spec.finalCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                </span>
                <!-- <i18n-n :value="spec.finalCost" format="decimal" class="flex">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n> -->
              </li>
              <li>
                <span>
                  {{ $t('shipping.finalObtainCost') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <span class="flex">
                  <div class="cost-card__cost">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                </span>
                <!-- <i18n-n :value="spec.finalObtainCost" format="decimal" class="flex">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n> -->
              </li>
              <li>
                <span>
                  {{ $t('shipping.profit') }}  {{ $t('currency.CNY.symbol') }}
                </span>
                <span class="flex">
                  <div style="color: #00ff16;">{{ $n(spec.profit, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.profit, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.profit, 'decimal').slice(-2) }}</div>
                </span>
                <!-- <i18n-n :value="spec.profit" format="decimal" class="flex">
                  <template v-slot:integer="slotProps">
                    <div style="color: #00ff16;">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n> -->
              </li>
            </ul>
          </div>
          <div class="spec-summary__cost__card" style="background-image: linear-gradient(to top, #272727 0%, #272727 80%, #1d1d1b 95%, #1d1d1b 100%);">
            <ul class="leaders">
              <li>
                <span>
                  {{ $t('shipping.totalPrepay') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <span class="flex">
                  <div class="text-white">{{ $n(spec.finalCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalCost, 'decimal').slice(-2) }}</div>
                </span>
                <!-- <i18n-n :value="spec.finalCost" format="decimal" class="flex">
                  <template v-slot:integer="slotProps">
                    <div class="text-white">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n> -->
              </li>
              <li>
                <span>
                  {{ $t('shipping.totalClientDebt') }} {{ $t('currency.CNY.symbol') }}
                </span>
                <span class="flex">
                  <div style="color: #ff2900;">{{ $n(spec.finalObtainCost, 'integer') }}</div>
                  <div style="padding-left: 1px; letter-spacing: -1px">{{ $n(spec.finalObtainCost, 'decimal').slice(-3, -2) }}</div>
                  <div class="text-sm">{{ $n(spec.finalObtainCost, 'decimal').slice(-2) }}</div>
                </span>
                <!-- <i18n-n :value="spec.finalObtainCost" format="decimal" class="flex">
                  <template v-slot:integer="slotProps">
                    <div style="color: #ff2900;">{{ slotProps.integer }}</div>
                  </template>
                  <template v-slot:group="slotProps">
                    <div class="text-sm">{{ slotProps.group }}</div>
                  </template>
                  <template v-slot:fraction="slotProps">
                    <div class="text-sm">{{ slotProps.fraction }}</div>
                  </template>
                </i18n-n> -->
              </li>
            </ul>
          </div>
          <div class="flex justify-end items-center pt-2 pr-4">
            <span>{{ $t('shipping.documentRate') }}</span>
            <span>&nbsp;=&nbsp;</span>
            <TextField
              :debounce="250"
              :placeholder="$t('placeholder.emptyNumber')"
              type="number"
              inputmode="decimal"
              solo
              colored
              outlined
              hide-details
              class="text-sm text-right w-16 mr-2 sm:p-0 leading-normal"
            />
          </div>
        </div>
        <div class="spec-summary__actions">
          <Button text class="mb-4" @click="openPaperList">
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziSettings }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.paperConfigurator') }}</span>
          </Button>
          <Button text class="mb-4" @click.prevent>
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziPaperPlane }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.notifyClient') }}</span>
          </Button>
          <Button text class="mb-4" @click.prevent>
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziPrint }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.print') }}</span>
          </Button>
          <Button text @click.prevent>
            <template v-slot:icon>
              <Icon size="32" color="#aaaaaa">
                {{ icons.ziShare }}
              </Icon>
            </template>
            <span class="text-left">{{ $t('shipping.share') }}</span>
          </Button>
        </div>
      </div>
    </div>
    <div>
      <div style="max-width: 300px;">
        <Button
          large
          squared
          outline
        >
          <span class="text-lg">{{ $t('shipping.overview') }}</span>
        </Button>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import deepEqual from 'deep-equal'

import { ziSettings, ziPaperPlane, ziPrint, ziShare } from '@/assets/icons'

import PaperListModal from '@/components/PaperListModal.vue'
import PaperConfiguratorModal from '@/components/PaperConfiguratorModal.vue'
import SaveBeforeCloseModal from '@/components/SaveBeforeCloseModal.vue'

export default {
  name: 'SpecSummary',
  components: {
    PaperListModal,
    PaperConfiguratorModal,
    SaveBeforeCloseModal,
  },
  data () {
    return {
      blank: {},
      papers: [],
      existing: [],
      filledFields: [],
      paperList: false,
      paperConfigurator: false,
      saveBeforeClose: false,
      editMode: false,
      blankClone: {},
      isSent: false,
      icons: {
        ziSettings,
        ziPaperPlane,
        ziPrint,
        ziShare,
      },
    }
  },
  computed: {
    spec () {
      return {
        shipped: false,
        containers: [
          { type: '20', loaded: 100 },
          { type: '20', loaded: 28 },
        ],
        estimateShippingDate: '2019-09-23T17:28:48.880Z',
        totalVolume: 7.3,
        totalWeight: 799,
        qtyOfPackages: 27,
        finalCost: 260906.20,
        finalObtainCost: 101300,
        profit: 37759.37,
        totalPrepay: 101300,
        totalClientDebt: 159606.2,
        currencyRate: 9.256,
      }
    },
    containers () {
      return this.spec.containers || []
    },
    // TODO group by type and laoded
    loadedContainers () {
      return this.containers.filter(c => c.loaded === 100)
    },
    unloadedContainers () {
      return this.containers.filter(c => c.loaded !== 100)
    },
  },
  watch: {
    paperConfigurator (val) {
      if (!val) {
        setTimeout(() => {
          const dialog = document.querySelector('.paper-configurator-dialog .modal-body')
          if (dialog) dialog.scrollTop = 0
        }, 200)
      }
    },
  },
  methods: {
    openPaperList () {
      this.papers = JSON.parse(localStorage.getItem('zennnn:papers'))
      this.paperList = true
    },
    createPaper () {
      this.blank = {
        id: 0,
        name: '',
        heading: '',
        location: '',
        textField: '',
        textFieldRows: 1,
        items: [
          {
            heading: '',
            paragraphs: [
              { paragraph: '' },
            ],
          },
        ],
        specItems: [
          {
            heading: '',
            paragraphs: [
              { paragraph: '' },
            ],
          },
        ],
      }
      this.blankClone = cloneDeep(this.blank)
      this.paperConfigurator = true
      this.paperList = false
      this.editMode = false
    },
    editPaper (name) {
      if (name !== null) {
        this.existing = JSON.parse(localStorage.getItem('zennnn:papers'))
        this.blank = this.existing.find(e => e.name === name)
        this.blankClone = cloneDeep(this.blank)
        this.editMode = true
      }
      this.paperConfigurator = true
      this.paperList = false
    },
    removePaper (index, papers) {
      papers.splice(index, 1)
      localStorage.setItem('zennnn:papers', JSON.stringify(papers))
    },
    beforeClose () {
      if (!deepEqual(this.blank, this.blankClone, true)) {
        this.saveBeforeClose = true
      } else {
        this.paperConfigurator = false
      }
    },
    doNotSavePaperChanges () {
      this.saveBeforeClose = false
      this.paperConfigurator = false
    },
    cancel () {
      this.saveBeforeClose = false
    },
    savePaperChanges () {
      this.existing = JSON.parse(localStorage.getItem('zennnn:papers'))
      this.savePaper()
      this.saveBeforeClose = false
      this.paperConfigurator = false
    },
    savePaper () {
      this.existing = JSON.parse(localStorage.getItem('zennnn:papers')) || []

      if (this.blank.name === '') {
        alert('Заполните поле с названием документа')
      }
      if (this.blank.heading === '') {
        alert('Заполните поле с заголовком документа')
      } else {
        if (!this.editMode) {
          this.blank.id = Math.floor(Math.random() * 1000)

          this.existing.push(this.blank)
          localStorage.setItem('zennnn:papers', JSON.stringify(this.existing))
        } else {
          const existingIndex = this.existing.findIndex(ex => ex.id === this.blank.id)
          this.existing.splice(existingIndex, 1, this.blank)
          localStorage.setItem('zennnn:papers', JSON.stringify(this.existing))
        }
        this.paperConfigurator = false
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.spec-summary {
  padding: 50px 0 50px;
}
..light-theme .spec-summary {
  @apply bg-background;
}

.spec-summary__wrapper {
  @apply flex justify-between;
}

.spec-summary__info {
  width: 340px;
}

.spec-summary__cost {
  @apply flex-grow;
  max-width: 490px;
}
.spec-summary__cost__card {
  padding: 40px 60px;
  background-color: #272727;
  border-radius: 4px;
  font-size: 18px;
}
.light-theme .spec-summary__cost__card {
  background: linear-gradient(to top, #f4f4f4 70%, #e5e5e5 100%);
  @apply text-accent1;
}
.cost-card__cost {
  @apply text-white;
}
.light-theme .cost-card__cost {
  @apply text-accent1;
}

.spec-summary__actions {
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
.spec-summary__actions > div {
  display: flex;
}
.spec-summary__actions > div:not(:last-child) {
  margin-bottom: 25px;
}
.spec-summary__actions a {
  @apply text-primary;
}
.spec-summary__actions a:hover {
  color: #28ACD9;
}
.spec-summary__actions__icon {
  width: 28px;
  margin-right: 8px;
}

@screen lg {
  .spec-summary__actions {
    width: 120px;
  }
}
.spec-summary__container {
  width: 210px;
  @apply mb-4 relative;
}
.spec-summary__container__label {
  @apply absolute inset-0 w-full h-full font-bold text-2xl text-white;
  @apply flex items-center justify-center;
}
/* TODO image import on component */
.spec-summary__container__image {
  @apply absolute inset-0 w-full h-full bg-cover bg-left bg-no-repeat;
}
.spec-summary__container__image--full {
  background-image: url("/img/container-full.png");
}
.spec-summary__container__image--full-sm {
  background-image: url("/img/container-full-sm.png");
}
.spec-summary__container__image--shipped {
  background-image: url("/img/container-shipped.png");
}

.spec-summary__info ul.leaders span:first-child,
.spec-summary__info ul.leaders span + span {
  @apply bg-chaos-black;
}
.light-theme .spec-summary__info ul.leaders span:first-child,
.light-theme .spec-summary__info ul.leaders span + span {
  @apply bg-background;
}
@screen md {
  .spec-summary__info ul.leaders span:first-child,
  .spec-summary__info ul.leaders span + span {
    background: #1e1e1e;
  }
  .light-theme .spec-summary__info ul.leaders span:first-child,
  .light-theme .spec-summary__info ul.leaders span + span {
    @apply bg-background;
  }
}
.spec-summary__cost ul.leaders span:first-child,
.spec-summary__cost ul.leaders span + span {
  background-color: #272727;
}

.light-theme .spec-summary__cost ul.leaders span:first-child,
.light-theme .spec-summary__cost ul.leaders span + span {
  background-color: #f4f4f4;
}

ul.leaders {
  line-height: 1.5rem;
  padding: 0;
  overflow-x: hidden;
  list-style: none}
ul.leaders li:after {
  float: left;
  width: 0;
  white-space: nowrap;
  content:
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "
 ". . . . . . . . . . . . . . . . . . . . "}
ul.leaders span:first-child {
  padding-right: 0.33em;}
ul.leaders span + span {
  float: right;
  padding-left: 0.33em;
  position: relative;
  z-index: 1
}
.leaders__num {
  @apply text-white font-bold
}
.light-theme .leaders__num {
  @apply text-black;
}
</style>
