import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziArrow } from '@zennnn/icons'
import { TextField, DatePicker, Autocomplete, Icon } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import { ShipmentType } from '@/graphql/types'

import type { PropType } from 'vue'
import type { GetSpec_getSpec_shipment } from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<GetSpec_getSpec_shipment | null>,
      default: () => ({}),
    },
  },

  emits: ['update'],

  setup(props, { emit }) {
    const { t, d } = useI18n()

    const shipmentTypes = computed(() =>
      Object.values(ShipmentType)
        .filter((el) => el !== ShipmentType.UNDEFINED)
        .map((el) => ({
          text: t(`shipmentType.${el}`),
          value: el,
        }))
    )

    return () => (
      <div class="w-full flex-grow lg:w-auto pb-8 lg:pb-0 lg:pr-3">
        <h4 class="text-white text-xl font-semibold leading-6 mb-4">
          {t('shipping.forDeliver')}
        </h4>
        <div class="bg-gray-700 rounded-t-md flex flex-wrap md:flex-nowrap items-center mb-1 py-2 px-2.5">
          <div class="w-full pb-5 md:p-0 md:w-1/3">
            <TextField
              modelValue={props.item?.sentFrom}
              debounce={250}
              placeholder={t('shipping.sentFrom')}
              dense
              onInput={(val: EmptyString) =>
                emit('update', { shipment: { sentFrom: val } })
              }
            />
          </div>

          <div class="flex justify-center w-full md:w-auto px-1 xl:px-2">
            <Icon class="text-gray-200 transform rotate-90 md:rotate-0">
              {ziArrow}
            </Icon>
          </div>

          <div class="w-full flex-1 py-5 md:p-0">
            <TextField
              modelValue={props.item?.sentThrough}
              debounce={250}
              placeholder={t('shipping.sentThrough')}
              dense
              onInput={(val: EmptyString) =>
                emit('update', { shipment: { sentThrough: val } })
              }
            />
          </div>

          <div class="flex justify-center w-full md:w-auto px-1 xl:px-2">
            <Icon class="text-gray-200 transform rotate-90 md:rotate-0">
              {ziArrow}
            </Icon>
          </div>

          <div class="w-full flex-1 pt-5 md:p-0">
            <TextField
              modelValue={props.item?.sentDestination}
              debounce={250}
              placeholder={t('shipping.destination')}
              dense
              onInput={(val: EmptyString) =>
                emit('update', { shipment: { sentDestination: val } })
              }
            />
          </div>
        </div>

        <div
          class="bg-gray-700 rounded-b-md flex flex-wrap pt-4 pb-5"
          style="padding-left: 6px; padding-right: 6px"
        >
          <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1 pb-2">
            <Autocomplete
              modelValue={props.item?.activeType}
              placeholder={t('shipping.shipmentType')}
              items={shipmentTypes.value}
              dense
              onSelect={(val: ShipmentType | null | undefined) =>
                emit('update', { shipment: { activeType: val } })
              }
            />
          </div>
          <div class="w-full sm:w-2/3 md:w-full lg:w-2/3 px-1 pb-2">
            <div class="h-8" />
          </div>
          {/* <!-- MARINE --> */}
          {props.item?.activeType === ShipmentType.MARINE && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.marine?.billOfLadingNo}
                  debounce={250}
                  placeholder={t('shipping.billOfLadingNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { marine: { billOfLadingNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.marine?.ship}
                  debounce={250}
                  placeholder={t('shipping.ship')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { marine: { ship: val } } })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.containersCount')}
                  >
                    {t('shipping.containersCount')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.marine?.containersCount}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { marine: { containersCount: val } },
                        })
                      }
                    />
                  </div>
                </div>
                <div class="px-1 pb-2">
                  <TextField
                    modelValue={props.item?.marine?.containersNo}
                    debounce={250}
                    placeholder={t('shipping.containersNo')}
                    dense
                    onInput={(val: EmptyString) =>
                      emit('update', {
                        shipment: { marine: { containersNo: val } },
                      })
                    }
                  />
                </div>
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.exportDate')}
                  >
                    {t('shipping.exportDate')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <DatePicker
                      modelValue={props.item?.marine?.exportDate}
                      {...{
                        'onUpdate:modelValue': (val: any) => {
                          emit('update', {
                            shipment: { marine: { exportDate: val } },
                          })
                        },
                      }}
                      v-slots={{
                        activator: () => (
                          <TextField
                            modelValue={
                              props.item?.marine?.exportDate
                                ? d(
                                    parseDate(props.item.marine.exportDate),
                                    'short'
                                  )
                                : ''
                            }
                            placeholder={t('placeholder.notIndicated')}
                            dense
                            readonly
                          />
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <!-- AIR --> */}
          {props.item?.activeType === ShipmentType.AIR && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.air?.airWaybillNo}
                  debounce={250}
                  placeholder={t('shipping.airWaybillNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { air: { airWaybillNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.air?.flight}
                  debounce={250}
                  placeholder={t('shipping.flight')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { air: { flight: val } } })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.numbersOfPkg')}
                  >
                    {t('shipping.numbersOfPkg')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.air?.numbersOfPkg}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { air: { numbersOfPkg: val } },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <!-- RAILWAY --> */}
          {props.item?.activeType === ShipmentType.RAILWAY && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.railway?.internationalWaybillNo}
                  debounce={250}
                  placeholder={t('shipping.internationalWaybillNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { railway: { internationalWaybillNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.railway?.train}
                  debounce={250}
                  placeholder={t('shipping.train')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { railway: { train: val } } })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.trainContainersCount')}
                  >
                    {t('shipping.trainContainersCount')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.railway?.containersCount}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { railway: { containersCount: val } },
                        })
                      }
                    />
                  </div>
                </div>
                <div class="px-1 pb-2">
                  <TextField
                    modelValue={props.item?.railway?.containersNo}
                    debounce={250}
                    placeholder={t('shipping.trainContainersNo')}
                    dense
                    onInput={(val: EmptyString) =>
                      emit('update', {
                        shipment: { railway: { containersNo: val } },
                      })
                    }
                  />
                </div>
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.exportDate')}
                  >
                    {t('shipping.exportDate')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <DatePicker
                      modelValue={props.item?.railway?.exportDate}
                      {...{
                        'onUpdate:modelValue': (val: any) => {
                          emit('update', {
                            shipment: { railway: { exportDate: val } },
                          })
                        },
                      }}
                      v-slots={{
                        activator: () => (
                          <TextField
                            modelValue={
                              props.item?.railway?.exportDate
                                ? d(
                                    parseDate(props.item.railway.exportDate),
                                    'short'
                                  )
                                : ''
                            }
                            placeholder={t('placeholder.notIndicated')}
                            dense
                            readonly
                          />
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <!-- CAR --> */}
          {props.item?.activeType === ShipmentType.CAR && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.car?.internationalWaybillNo}
                  debounce={250}
                  placeholder={t('shipping.internationalWaybillNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { car: { internationalWaybillNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.car?.vehicleNo}
                  debounce={250}
                  placeholder={t('shipping.vehicleNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { car: { vehicleNo: val } } })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.semitrailerNo')}
                  >
                    {t('shipping.semitrailerNo')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.car?.semitrailerNo}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { car: { semitrailerNo: val } },
                        })
                      }
                    />
                  </div>
                </div>
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.exportDate')}
                  >
                    {t('shipping.exportDate')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <DatePicker
                      modelValue={props.item?.car?.exportDate}
                      {...{
                        'onUpdate:modelValue': (val: any) => {
                          emit('update', {
                            shipment: { car: { exportDate: val } },
                          })
                        },
                      }}
                      v-slots={{
                        activator: () => (
                          <TextField
                            modelValue={
                              props.item?.car?.exportDate
                                ? d(
                                    parseDate(props.item.car.exportDate),
                                    'short'
                                  )
                                : ''
                            }
                            placeholder={t('placeholder.notIndicated')}
                            dense
                            readonly
                          />
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <!-- MIXED --> */}
          {props.item?.activeType === ShipmentType.MIXED && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.mixed?.internationalWaybillNo}
                  debounce={250}
                  placeholder={t('shipping.internationalWaybillNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { mixed: { internationalWaybillNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.mixed?.ship}
                  debounce={250}
                  placeholder={t('shipping.ship')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { ship: val } } })
                  }
                />
                <TextField
                  modelValue={props.item?.mixed?.train}
                  debounce={250}
                  placeholder={t('shipping.train')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { train: val } } })
                  }
                />
                <TextField
                  modelValue={props.item?.mixed?.flight}
                  debounce={250}
                  placeholder={t('shipping.flight')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', { shipment: { mixed: { flight: val } } })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.vehicleAndSemitrailerNo')}
                  >
                    {t('shipping.vehicleAndSemitrailerNo')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.mixed?.vehicleNo}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { mixed: { vehicleNo: val } },
                        })
                      }
                    />
                  </div>
                </div>
                <div class="px-1">
                  <TextField
                    modelValue={props.item?.mixed?.containersNo}
                    debounce={250}
                    placeholder={t('shipping.containersNo')}
                    dense
                    class="pb-2"
                    onInput={(val: EmptyString) =>
                      emit('update', {
                        shipment: { mixed: { containersNo: val } },
                      })
                    }
                  />
                </div>
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.exportDate')}
                  >
                    {t('shipping.exportDate')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <DatePicker
                      modelValue={props.item?.mixed?.exportDate}
                      {...{
                        'onUpdate:modelValue': (val: any) => {
                          emit('update', {
                            shipment: { mixed: { exportDate: val } },
                          })
                        },
                      }}
                      v-slots={{
                        activator: () => (
                          <TextField
                            modelValue={
                              props.item?.mixed?.exportDate
                                ? d(
                                    parseDate(props.item.mixed.exportDate),
                                    'short'
                                  )
                                : ''
                            }
                            placeholder={t('placeholder.notIndicated')}
                            dense
                            readonly
                          />
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* <!-- EXPRESS --> */}
          {props.item?.activeType === ShipmentType.EXPRESS && (
            <>
              <div class="w-full sm:w-1/3 md:w-full lg:w-1/3 px-1">
                <TextField
                  modelValue={props.item?.express?.postalNo}
                  debounce={250}
                  placeholder={t('shipping.postalNo')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { express: { postalNo: val } },
                    })
                  }
                />
                <TextField
                  modelValue={props.item?.express?.deliveryService}
                  debounce={250}
                  placeholder={t('shipping.deliveryService')}
                  dense
                  class="pb-2"
                  onInput={(val: EmptyString) =>
                    emit('update', {
                      shipment: { express: { deliveryService: val } },
                    })
                  }
                />
              </div>
              <div class="w-full sm:w-2/3 md:w-full lg:w-2/3">
                <div class="flex items-center pb-2">
                  <div
                    class="w-1/2 text-right px-1 truncate"
                    title={t('shipping.numbersOfPkg')}
                  >
                    {t('shipping.numbersOfPkg')}:
                  </div>
                  <div class="w-1/2 px-1">
                    <TextField
                      modelValue={props.item?.express?.numbersOfPkg}
                      debounce={250}
                      placeholder={t('placeholder.notIndicated')}
                      dense
                      onInput={(val: EmptyString) =>
                        emit('update', {
                          shipment: { express: { numbersOfPkg: val } },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  },
})
