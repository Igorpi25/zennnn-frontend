<template>
  <div
    class="invoice-header"
    @click="onHeaderClick"
  >
    <span
      :class="[
        'status-indicator mr-2 md:mr-6 flex-shrink-0',
        invoiceStatus,
      ]"
    >
    </span>
    <slot />
    <div class="flex-grow" />
    <div
      v-if="expanded"
      @click="$emit('click', item.id)"
      :class="[
        'invoice-header__expand',
        {'text-primary hover:text-primary-accent': iconColorPrimary}
      ]"
    >
      <template v-if="expanded.includes(item.id)">
        <span
          v-text="hasIconText ? $t('action.collapse') : ''"
          class="mr-2 hidden lg:inline"
        />
        <div class="invoice-header__expand__icon">
          <Icon :title="$t('action.collapse')">
            {{ icons.mdiMinus }}
          </Icon>
        </div>
      </template>
      <template v-else>
        <span
          v-text="hasIconText ? $t('action.expand') : ''"
          class="mr-2 hidden lg:inline"
        />
        <div class="invoice-header__expand__icon">
          <Icon :title="$t('action.expand')">
            {{ icons.mdiPlus }}
          </Icon>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mdiMinus, mdiPlus } from '@mdi/js'
import { InvoiceStatus } from '../graphql/enums'

export default {
  name: 'InvoiceHeader',
  props: {
    item: {
      type: [Array, Object],
      default: () => ({}),
    },
    expanded: {
      type: Array,
      default: () => ([]),
    },
    iconColorPrimary: {
      type: Boolean,
      default: false,
    },
    hasIconText: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      icons: {
        mdiMinus,
        mdiPlus,
      },
    }
  },
  computed: {
    invoiceStatus () {
      return this.item.invoiceStatus === InvoiceStatus.IN_STOCK
        ? 'status-indicator--green' : this.item.invoiceStatus === InvoiceStatus.IN_PRODUCTION
          ? 'status-indicator--orange' : this.item.invoiceStatus === InvoiceStatus.IN_PROCESSING
            ? 'status-indicator--pink' : 'bg-transparent'
    },
  },
  methods: {
    onHeaderClick (e) {
      if (e.target !== this.$el) return
      this.$emit('click', this.item.id)
    },
  },
}
</script>

<style lang="postcss">
.invoice-header {
  padding: 5px 10px;
  @apply relative flex items-center mx-auto w-full select-none;
  @apply rounded-sm bg-accent1 text-right;
  color: #252525;
}

.invoice-header__expand {
  @apply ml-auto flex justify-end;
  @apply text-sm cursor-pointer select-none;
}
.invoice-header__expand__icon {
  @apply w-5 h-5;
  @apply flex justify-center items-center;
  @apply border-2;
}
</style>
