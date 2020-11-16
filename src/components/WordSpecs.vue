<template>
  <div class="flex flex-wrap w-full relative">
    <div
      v-for="item in items"
      :key="item.specId"
      class="w-1/4 text-gray-100"
    >
      <v-fade-transition>
        <div
          v-show="loading"
          class="absolute inset-0 text-gray-200 flex items-center justify-center cursor-wait"
        >
          <v-progress-circular
            indeterminate
            size="24"
            width="2"
          />
        </div>
      </v-fade-transition>
      <router-link
        :to="{ name: 'spec', params: { specId: item.specId, orgId } }"
        class="group inline-flex max-w-full py-1"
      >
        <span class="flex-grow truncate text-gray-100 group-hover:text-white">
          {{ item.specNo }}
        </span>
        <i class="flex-shrink-0 zi-magnifier align-middle text-2xl text-gray-200 group-hover:text-gray-100 mx-1" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { GET_WORD_SPECS } from '../graphql/queries'

export default {
  props: {
    orgId: String,
    wordId: {
      type: String,
      required: true,
    },
  },
  apollo: {
    getWordSpecs: {
      query: GET_WORD_SPECS,
      variables () {
        return {
          orgId: this.orgId,
          id: this.wordId,
        }
      },
      fetchPolicy: 'cache-and-network',
    },
  },
  computed: {
    loading () {
      return this.$apollo.queries.getWordSpecs && this.$apollo.queries.getWordSpecs.loading
    },
    items () {
      return this.getWordSpecs || []
    },
  },
}
</script>
