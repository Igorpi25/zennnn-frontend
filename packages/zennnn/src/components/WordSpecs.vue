<template>
  <div class="flex flex-wrap w-full relative">
    <div
      v-for="item in items"
      :key="item.specId"
      class="w-1/4 text-gray-100"
    >
      <transition name="fade-transition">
        <div
          v-show="loading"
          class="absolute inset-0 text-gray-200 flex items-center justify-center cursor-wait"
        >
          <Progress
            indeterminate
            size="24"
            width="2"
          />
        </div>
      </transition>
      <router-link
        :to="{ name: 'spec', params: { specId: item.specId, orgId } }"
        class="group inline-flex max-w-full py-1"
      >
        <span class="flex-grow truncate text-gray-100 group-hover:text-white">
          {{ item.specNo }}
        </span>
        <Icon class="flex-shrink-0 align-middle text-gray-200 group-hover:text-gray-100 mx-1">
          {{ icons.ziSearch }}
        </Icon>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useQuery, useResult } from '@vue/apollo-composable'

import { GET_WORD_SPECS } from '../graphql/queries'

import { ziSearch } from '../assets/icons'

import { Icon, Progress } from '@zennnn/core'

export default {
  name: 'WordSpecs',
  components: {
    Icon,
    Progress,
  },
  props: {
    orgId: String,
    wordId: {
      type: String,
      required: true,
    },
  },
  setup (props) {
    const { result, loading } = useQuery(GET_WORD_SPECS, () => ({
      orgId: props.orgId,
      id: props.wordId,
    }), {
      fetchPolicy: 'cache-and-network',
    })
    const items = useResult(result, [], data => data.getWordSpecs)

    return {
      icons: {
        ziSearch,
      },
      loading,
      items,
    }
  },
}
</script>
