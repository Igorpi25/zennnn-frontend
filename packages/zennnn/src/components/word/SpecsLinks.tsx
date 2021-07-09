import { computed, defineComponent, Transition } from 'vue'

import { useQuery } from '@vue/apollo-composable'
import { ziSearch } from '@zennnn/icons'
import { Icon, Progress, Btn } from '@zennnn/core'
import { GET_WORD_SPECS } from '@/graphql/queries'

import type { GetWordSpecs, GetWordSpecsVariables } from '@/graphql/types'

export default defineComponent({
  props: {
    orgId: {
      type: String,
      required: true,
    },
    wordId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { result, loading } = useQuery<GetWordSpecs, GetWordSpecsVariables>(
      GET_WORD_SPECS,
      () => ({
        orgId: props.orgId as string,
        id: props.wordId,
      }),
      {
        fetchPolicy: 'cache-and-network',
      }
    )

    const items = computed(() => result.value?.getWordSpecs || [])

    return () => (
      <div class="flex flex-wrap w-full relative">
        <Transition
          name="fade-transition"
          v-slots={{
            default: () =>
              loading.value && (
                <div class="absolute inset-0 text-gray-200 flex items-center justify-center cursor-wait">
                  <Progress indeterminate size="24" width="2" />
                </div>
              ),
          }}
        />
        {items.value.map((item) => (
          <div class="w-1/4">
            <Btn
              to={{
                name: 'spec',
                params: { specId: item.specId, orgId: props.orgId },
              }}
              text
              class="text-gray-200 dark:text-gray-100 max-w-full h-7 px-0"
            >
              <span class="flex-grow truncate">{item.specNo}</span>
              <Icon class="mx-1">{ziSearch}</Icon>
            </Btn>
          </div>
        ))}
      </div>
    )
  },
})
