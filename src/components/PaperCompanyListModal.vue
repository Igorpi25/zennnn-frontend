<template>
  <div class="p-8 supplier-list-container">
    <ul class="ml-6 text-primary">
      <li
        v-for="supplier in supplierList"
        :key="supplier.id"
        class="supplier__company-name"
        @click="$emit('chooseSupplier', supplier.id)"
      >
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
      <span>{{ $t('requisites.addRequisites') }}</span>
    </Button>
  </div>
</template>

<script>
import { mdiPlusCircleOutline } from '@mdi/js'
import { ziGear } from '@/assets/icons'

import { LIST_ORG_REQUISITES } from '../graphql/queries'

export default {
  name: 'PaperCompanyListModal',
  apollo: {
    listOrgRequisites: {
      query: LIST_ORG_REQUISITES,
      variables () {
        return {
          orgId: this.orgId,
        }
      },
    },
  },
  data () {
    return {
      icons: {
        ziGear,
        mdiPlusCircleOutline,
      },
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    supplierList () {
      return this.listOrgRequisites
    },
  },
}
</script>

<style scoped lang="postcss">
  .supplier__company-name {
    @apply relative cursor-pointer;
  }
  .supplier__company-name:hover {
    color: #6996B2;
  }
  .supplier__company-name:hover  span {
    display: block;
  }
  .supplier__company-name > span {
    display: none;
    position: absolute;
    left: -28px;
  }
  .supplier-list-container {
    background-color: #dddddd;
  }
</style>
