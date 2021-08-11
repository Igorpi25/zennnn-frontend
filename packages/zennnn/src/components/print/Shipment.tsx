import { defineComponent, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziCalendar } from '@zennnn/icons'
import { Icon, TextField, DatePicker, Autocomplete } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import { ShipmentType } from '@/graphql/types'

import type { PropType } from 'vue'
import type { GetSpec_getSpec_shipment } from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetSpec_getSpec_shipment | null>,
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, d } = useI18n()

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    const activeType = computed(() => props.item?.activeType)

    const hasExportDate = computed(
      () =>
        activeType.value === ShipmentType.MARINE ||
        activeType.value === ShipmentType.RAILWAY ||
        activeType.value === ShipmentType.CAR ||
        activeType.value === ShipmentType.MIXED
    )

    const exportDateKey = computed(() => {
      switch (activeType.value) {
        case ShipmentType.MARINE:
          return 'marine'
        case ShipmentType.RAILWAY:
          return 'railway'
        case ShipmentType.CAR:
          return 'car'
        case ShipmentType.MIXED:
          return 'mixed'
        default:
          return ''
      }
    })

    const exportDate = computed(() => {
      if (activeType.value && exportDateKey.value) {
        return props.item?.[exportDateKey.value]?.exportDate
      }
      return null
    })

    const shipmentTypes = computed(() =>
      Object.values(ShipmentType)
        .filter((el) => el !== ShipmentType.UNDEFINED)
        .map((el) => ({
          text: t(`shipmentType.${el}`),
          value: el,
        }))
    )

    function updateExportDate(val: EmptyString) {
      const key = exportDateKey.value
      emit('update', { shipment: { [key]: { exportDate: val } } })
    }

    return () => (
      <>
        <h5 class="flex-grow text-lg leading-tight mb-3">
          <span class="text-white uppercase font-semibold tracking-widest">
            {t('shipping.forDeliver')}
          </span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <TextField
                modelValue={props.item?.sentFrom}
                debounce={500}
                label={t('shipping.fromLabel')}
                placeholder={t('shipping.deliveryPlaceholder')}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                onInput={(val: EmptyString) =>
                  emit('update', { shipment: { sentFrom: val } })
                }
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.sentThrough}
                debounce={500}
                label={t('shipping.viaLabel')}
                placeholder={t('shipping.deliveryPlaceholder')}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="warn"
                onInput={(val: EmptyString) =>
                  emit('update', { shipment: { sentThrough: val } })
                }
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.sentDestination}
                debounce={500}
                label={t('shipping.toLabel')}
                placeholder={t('shipping.deliveryPlaceholder')}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                onInput={(val: EmptyString) =>
                  emit('update', { shipment: { sentDestination: val } })
                }
              />
            </div>
            <div v-show={hasExportDate.value} class="pr-2">
              <DatePicker
                modelValue={exportDate.value}
                {...{ 'onUpdate:modelValue': updateExportDate }}
                v-slots={{
                  activator: () => (
                    <div style="max-width: 232px">
                      <TextField
                        modelValue={
                          exportDate.value
                            ? d(parseDate(exportDate.value), 'short')
                            : ''
                        }
                        label={t('shipping.exportDate')}
                        placeholder={t('companyDetail.placeholder.date')}
                        rules={[rules.required]}
                        stateIcon
                        stateErrorColor="warn"
                        readonly
                        v-slots={{
                          prepend: () => (
                            <Icon
                              small
                              class="text-gray-200 flex-shrink-0 mr-2.5"
                            >
                              {ziCalendar}
                            </Icon>
                          ),
                        }}
                      />
                    </div>
                  ),
                }}
              />
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="pb-2">
              <Autocomplete
                modelValue={activeType.value}
                label={t('shipping.shipmentType')}
                placeholder={t('shipping.methodOfDispatchPlaceholder')}
                items={shipmentTypes.value}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                onSelect={(val: ShipmentType) =>
                  emit('update', { shipment: { activeType: val } })
                }
              />
            </div>
            {/* <!-- MARINE --> */}
            <div
              v-show={props.item?.activeType === ShipmentType.MARINE}
              key="marine"
            >
              <TextField
                modelValue={props.item?.marine?.containersCount}
                debounce={500}
                label={t('shipping.containersCount')}
                placeholder={t('placeholder.notIndicated')}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                onInput={(val: EmptyString) =>
                  emit('update', {
                    shipment: { marine: { containersCount: val } },
                  })
                }
              />
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.marine?.billOfLadingNo}
                  debounce={500}
                  label={t('shipping.billOfLadingNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { marine: { billOfLadingNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.marine?.ship}
                  debounce={500}
                  label={t('shipping.ship')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { marine: { ship: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.marine?.containersNo}
                  debounce={500}
                  label={t('shipping.containersNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { marine: { containersNo: val } },
                    })
                  }
                />
              </div>
            </div>
            {/* <!-- AIR --> */}
            <div v-show={props.item?.activeType === ShipmentType.AIR} key="air">
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.air?.airWaybillNo}
                  debounce={500}
                  label={t('shipping.airWaybillNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { air: { airWaybillNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.air?.flight}
                  debounce={500}
                  label={t('shipping.flight')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { air: { flight: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.air?.numbersOfPkg}
                  debounce={500}
                  label={t('shipping.numbersOfPkg')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { air: { numbersOfPkg: val } },
                    })
                  }
                />
              </div>
            </div>
            {/* <!-- RAILWAY --> */}
            <div
              v-show={props.item?.activeType === ShipmentType.RAILWAY}
              key="railway"
            >
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.railway?.internationalWaybillNo}
                  debounce={500}
                  label={t('shipping.internationalWaybillNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { railway: { internationalWaybillNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.railway?.train}
                  debounce={500}
                  label={t('shipping.train')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { railway: { train: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.railway?.containersCount}
                  debounce={500}
                  label={t('shipping.trainContainersCount')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { railway: { containersCount: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.railway?.containersNo}
                  debounce={500}
                  label={t('shipping.trainContainersNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { railway: { containersNo: val } },
                    })
                  }
                />
              </div>
            </div>
            {/* <!-- CAR --> */}
            <div v-show={props.item?.activeType === ShipmentType.CAR} key="car">
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.car?.internationalWaybillNo}
                  debounce={500}
                  label={t('shipping.internationalWaybillNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { car: { internationalWaybillNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.car?.vehicleNo}
                  debounce={500}
                  label={t('shipping.vehicleNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { car: { vehicleNo: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.car?.semitrailerNo}
                  debounce={500}
                  label={t('shipping.semitrailerNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { car: { semitrailerNo: val } },
                    })
                  }
                />
              </div>
            </div>
            {/* <!-- MIXED --> */}
            <div
              v-show={props.item?.activeType === ShipmentType.MIXED}
              key="mixed"
            >
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.mixed?.internationalWaybillNo}
                  debounce={500}
                  label={t('shipping.internationalWaybillNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { mixed: { internationalWaybillNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.mixed?.ship}
                  debounce={500}
                  label={t('shipping.ship')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { ship: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.mixed?.train}
                  debounce={500}
                  label={t('shipping.train')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { train: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.mixed?.flight}
                  debounce={500}
                  label={t('shipping.flight')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { flight: val } } })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.mixed?.vehicleNo}
                  debounce={500}
                  label={t('shipping.vehicleAndSemitrailerNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { mixed: { vehicleNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-4">
                <TextField
                  modelValue={props.item?.mixed?.containersNo}
                  debounce={500}
                  label={t('shipping.containersNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { mixed: { containersNo: val } },
                    })
                  }
                />
              </div>
            </div>
            {/* <!-- EXPRESS --> */}
            <div
              v-show={props.item?.activeType === ShipmentType.EXPRESS}
              key="express"
            >
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.express?.postalNo}
                  debounce={500}
                  label={t('shipping.postalNo')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { express: { postalNo: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.express?.deliveryService}
                  debounce={500}
                  label={t('shipping.deliveryService')}
                  placeholder={t('placeholder.notIndicated')}
                  rules={[rules.required]}
                  stateIcon
                  stateErrorColor="warn"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { express: { deliveryService: val } },
                    })
                  }
                />
              </div>
              <div class="pb-2">
                <TextField
                  modelValue={props.item?.express?.numbersOfPkg}
                  debounce={500}
                  label={t('shipping.numbersOfPkg')}
                  placeholder={t('placeholder.notChosen')}
                  rules={[rules.required]}
                  hideDetails={false}
                  stateIcon
                  required
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { express: { numbersOfPkg: val } },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  },
})
