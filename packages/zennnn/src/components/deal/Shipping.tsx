import { computed, defineComponent, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { ziPlus, ziBoxes, ziWeight, ziVolume, ziCalendar } from '@zennnn/icons'
import { Icon, Select, Switch } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import { ContainerSize, ContainerMode } from '@/graphql/types'
import { SET_SPEC_CONTAINER_SIZE } from '@/graphql/mutations'

import type {
  GetSpec_getSpec_containers,
  SetSpecContainerSize,
  SetSpecContainerSizeVariables,
} from '@/graphql/types'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    estimateShippingDate: [String, Date] as PropType<string | Date | null>,
    totalVolume: Number as PropType<number | null>,
    qtyOfPackages: Number as PropType<number | null>,
    totalWeight: Number as PropType<number | null>,
    containers: {
      type: Array as PropType<GetSpec_getSpec_containers[] | null>,
      default: () => [],
    },
    shipped: Boolean,
    hideContainers: Boolean,
    actions: Boolean,
    specId: {
      type: String,
      required: true,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, n, d } = useI18n()

    const containerTypes = computed(() => [
      {
        size: ContainerSize._20,
        mode: ContainerMode._DC,
        value: '_20_DC',
        text: `20'DC`,
      },
      {
        size: ContainerSize._40,
        mode: ContainerMode._HC,
        value: '_40_HC',
        text: `40'HC`,
      },
      {
        size: ContainerSize._45,
        mode: ContainerMode._HC,
        value: '_45_HC',
        text: `45'HC`,
      },
    ])

    const {
      mutate: setSpecContainerSizeMutate,
      loading: setSpecContainerSizeLoading,
    } = useMutation<SetSpecContainerSize, SetSpecContainerSizeVariables>(
      SET_SPEC_CONTAINER_SIZE
    )

    function getSelectedContainerText(
      size: ContainerSize | null,
      mode: ContainerMode | null
    ) {
      const val = `${size}${mode}`
      const result = containerTypes.value.find(
        (item) => item.size === size && item.mode === mode
      )
      return result ? result.text : val
    }

    return () => (
      <div class="w-full">
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          {t('shipping.cargoInfo')}
        </h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
          <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
            <div class="flex text-gray-200 pb-2">
              <Icon class="text-gray-300 mr-2">{ziCalendar}</Icon>
              <span>{t('shipping.estimateDate')}</span>
            </div>
            <div class="text-white text-lg font-semibold pl-8">
              {props.estimateShippingDate
                ? d(parseDate(props.estimateShippingDate), 'short')
                : t('placeholder.emptyDate')}
            </div>
          </div>
          <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
            <div class="flex text-gray-200 pb-2">
              <Icon class="text-gray-300 mr-2">{ziVolume}</Icon>
              <span>{t('shipping.totalVolume')}</span>
            </div>
            <div class="text-white text-lg font-semibold pl-8">
              {n(props.totalVolume || 0)} {t('measure.m3')}
            </div>
          </div>
          <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
            <div class="flex text-gray-200 pb-2">
              <Icon class="text-gray-300 mr-2">{ziBoxes}</Icon>
              <span>{t('shipping.totalPackages')}</span>
            </div>
            <div class="text-white text-lg font-semibold pl-8">
              {n(props.qtyOfPackages || 0)}
            </div>
          </div>
          <div class="flex flex-col justify-between bg-gray-700 rounded-md py-4 px-5 leading-6 h-full">
            <div class="flex text-gray-200 pb-2">
              <Icon class="text-gray-300 mr-2">{ziWeight}</Icon>
              <span>{t('shipping.totalWeight')}</span>
            </div>
            <div class="text-white text-lg font-semibold pl-8">
              {n(props.totalWeight || 0)} {t('measure.kg')}
            </div>
          </div>
        </div>

        <Transition
          name="slide-y-transition"
          onLeave={(el: Element) => {
            ;(el as HTMLElement).style.display = 'none'
          }}
        >
          {!props.hideContainers && (
            <div class="relative sm:flex bg-gray-700 rounded-md overflow-hidden">
              <div class="flex-grow p-5 leading-4">
                {props.containers?.map((item) => (
                  <>
                    <div class="flex flex-col xl:flex-row items-center justify-center">
                      {item.full && item.full > 0 ? (
                        <>
                          <div
                            style="min-height: 160px"
                            class="text-sm text-gray-200"
                          >
                            <div>
                              <span class="text-white text-xl font-semibold pr-1">
                                {item.full}
                              </span>
                              <span>{t('shipping.container', item.full)}</span>
                              <span class="text-white text-xl font-semibold pl-1">{`${item.size?.replace(
                                '_',
                                ''
                              )}'${item.mode?.replace('_', '')}`}</span>
                            </div>
                            <div
                              class={[
                                'h-[56px] relative my-2',
                                item.size === ContainerSize._40 ||
                                item.size === ContainerSize._45
                                  ? 'w-[245px]'
                                  : 'w-[140px]',
                              ]}
                            >
                              <div class="py-[3px] px-[5px] w-full h-full">
                                <div
                                  style={{
                                    width: '100%',
                                    willChange: 'width',
                                    transition:
                                      'width 0.4s cubic-bezier(0.61, 1, 0.88, 1)',
                                  }}
                                  class="relative w-0 h-full"
                                >
                                  <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                                </div>
                              </div>
                              <div class="absolute inset-0">
                                {item.size === ContainerSize._20 ? (
                                  <img
                                    src={
                                      require('@/assets/icons/c20_2x.png')
                                        .default
                                    }
                                    alt="20'"
                                  />
                                ) : (
                                  <img
                                    src={
                                      require('@/assets/icons/c40_2x.png')
                                        .default
                                    }
                                    alt="40'"
                                  />
                                )}
                              </div>
                              <div class="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
                                100%
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center px-4 py-2">
                            <Icon base={false} class="text-4xl text-gray-400">
                              {ziPlus}
                            </Icon>
                          </div>
                        </>
                      ) : undefined}
                      <div
                        class="text-sm text-gray-200"
                        style="min-height: 160px"
                      >
                        <div>
                          <span class="text-white text-xl font-semibold pl-1">{`${item.size?.replace(
                            '_',
                            ''
                          )}'${item.mode?.replace('_', '')}`}</span>
                        </div>
                        <div
                          class={[
                            'h-[56px] relative my-2',
                            item.size === ContainerSize._40 ||
                            item.size === ContainerSize._45
                              ? 'w-[245px]'
                              : 'w-[140px]',
                          ]}
                        >
                          <div class="py-[3px] px-[5px] h-full">
                            <div
                              style={{
                                width: (item.loaded || 0) + '%',
                                willChange: 'width',
                                transition:
                                  'width 0.4s cubic-bezier(0.61, 1, 0.88, 1)',
                              }}
                              class="relative w-0 h-full"
                            >
                              <div class="absolute top-0 left-0 bg-blue-500 w-full h-full" />
                            </div>
                          </div>
                          <div class="absolute inset-0">
                            {item.size === ContainerSize._20 ? (
                              <img
                                src={
                                  require('@/assets/icons/c20_2x.png').default
                                }
                                alt="20'"
                              />
                            ) : (
                              <img
                                src={
                                  require('@/assets/icons/c40_2x.png').default
                                }
                                alt="40'"
                              />
                            )}
                          </div>
                          <div class="absolute inset-0 flex items-center justify-center text-2xl text-white font-bold">
                            {item.loaded || 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* TODO: need work with containers */}
                    {props.actions && (
                      <div class="flex items-center justify-between pt-6">
                        <Select
                          modelValue={
                            containerTypes.value.find(
                              (i) =>
                                i.size === item.size && i.mode === item.mode
                            ) || `${item.size}${item.mode}`
                          }
                          loading={setSpecContainerSizeLoading.value}
                          items={containerTypes.value}
                          returnObject
                          solo
                          showArrow={true}
                          inputClass="w-0 !m-0"
                          {...{
                            'onUpdate:modelValue': (
                              val: typeof containerTypes.value[0]
                            ) =>
                              setSpecContainerSizeMutate({
                                specId: props.specId,
                                containerId: item.id,
                                inputSize: val.size,
                                inputMode: val.mode,
                              }),
                          }}
                          // TODO: in select replace input to div
                          v-slots={{
                            prepend: () => (
                              <span class="pl-1">
                                {getSelectedContainerText(item.size, item.mode)}
                              </span>
                            ),
                            item: ({
                              item,
                            }: {
                              item: typeof containerTypes.value[0]
                            }) => <span class="px-2">{item.text}</span>,
                          }}
                        />
                        <Switch
                          modelValue={props.shipped}
                          {...{
                            onChange: (val: boolean) => {
                              emit('update', { shipped: val })
                            },
                          }}
                        >
                          <span class="ml-2">{t('shipping.setShipped')}</span>
                        </Switch>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          )}
        </Transition>
      </div>
    )
  },
})
