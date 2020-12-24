<template>
  <div class="p-8 requisite-list-container">
    <div v-if="loading" class="flex justify-center items-center w-full h-full">
      <Spinner />
    </div>
    <ul class="ml-6 text-blue-500">
      <li
        v-for="requisite in requisiteList"
        :key="requisite.id"
        class="requisite__company-name"
        @click="$emit('chooseRequisite', requisite.id)"
      >
        <span>
            <Icon>
              {{ icons.ziGear }}
            </Icon>
          </span>
        {{ requisite.name }}
      </li>
    </ul>
    <Btn
      outlined
      class="mt-4"
      @click="$emit('openRequisiteDialog')"
    >
      <template>
        <Icon class="-ml-4 mr-2">{{ icons.mdiPlusCircleOutline }}</Icon>
      </template>
      <span>{{ $t('contract.addRequisites') }}</span>
    </Btn>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useQuery, useResult } from '@vue/apollo-composable'

import { mdiPlusCircleOutline } from '@mdi/js'
import { ziGear } from '@/assets/icons'

import { LIST_ORG_REQUISITES } from '../graphql/queries'

export default {
  name: 'ContractCompanyListModal',
  setup () {
    const route = useRoute()
    const orgId = route.params.orgId

    const { result, loading } = useQuery(LIST_ORG_REQUISITES, () => ({
      orgId: orgId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const listOrgRequisites = useResult(result)

    return {
      orgId,
      loading,
      listOrgRequisites,
    }
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
    requisiteList () {
      return this.listOrgRequisites
    },
  },
  methods: {
    update () {
      this.$apollo.queries.listOrgRequisites.refetch()
    },
  },
}
</script>

<style scoped lang="postcss">
  .requisite__company-name {
    @apply relative cursor-pointer;
  }
  .requisite__company-name:hover {
    color: #6996B2;
  }
  .requisite__company-name:hover  span {
    display: block;
  }
  .requisite__company-name > span {
    display: none;
    position: absolute;
    left: -28px;
  }
  .requisite-list-container {
    background-color: #dddddd;
  }
</style>
