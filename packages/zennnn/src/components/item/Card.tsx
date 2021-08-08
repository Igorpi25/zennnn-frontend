import { defineComponent, ref, computed, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ziBolt,
  ziStatusPointSm,
  ziAction,
  ziStarOutlineLg,
  ziHandshake,
  ziBarcode,
  ziImages,
  ziShare,
} from '@zennnn/icons'
import { Icon, Image, Menu, MenuItem, Modal, Btn } from '@zennnn/core'
import ItemLabel, { ItemLabelProps } from '@/components/item/Label'

export enum LabelTypes {
  New = 'NEW',
  Sale = 'SALE',
  Models = 'MODELS',
  Colors = 'COLORS',
  Sizes = 'SIZES',
}

export type LabelOptions = ItemLabelProps & { text?: string }
export type Label = LabelTypes | [LabelTypes] | [LabelTypes, LabelOptions]

export interface CardItem {
  name: string
  article?: string
  rate?: {
    percent: number
    count: number
  }
  picture?: string
  labels?: Array<Label>
  price?: number
  owner?: {
    fullName: string
    isVerified: boolean
    picture?: string
  }
}

export default defineComponent({
  props: {
    pictureOnly: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object as PropType<CardItem>,
      default: () => ({
        name: '',
      }),
    },
    isMobile: Boolean,
  },

  setup(props) {
    const { n } = useI18n()
    const isMenuActive = ref(false)

    const statusColor = computed(() => {
      const rate = (props.item.rate && props.item.rate.percent) || 0
      return rate > 70
        ? 'text-green-500'
        : rate > 30
        ? 'text-yellow-500'
        : 'text-pink-500'
    })

    const menuItems = computed(() => [
      {
        icon: ziStarOutlineLg,
        text: 'Add to Favorites',
      },
      {
        icon: ziHandshake,
        text: 'Request a Price',
      },
      {
        icon: ziBarcode,
        text: 'Request full Product info',
      },
      {
        icon: ziImages,
        text: 'Catologue',
      },
      {
        icon: ziShare,
        text: 'Share',
      },
    ])

    return () => (
      <div
        class={{
          'bg-light-gray-300 dark:bg-gray-650 relative flex flex-col items-start justify-start w-full xs:rounded-lg':
            true,
          'overflow-hidden': props.pictureOnly,
        }}
      >
        <div
          class={{
            'flex space-x-4 items-start justify-between w-full p-4 pl-2': true,
            'absolute inset-x-0 top-0 z-1': props.pictureOnly,
          }}
        >
          <div class="flex items-center justify-start text-gray-200 dark:text-gray-100">
            <Icon
              class={[
                'flex-shrink-0',
                statusColor.value,
                { 'stroke-white stroke-1': props.pictureOnly },
              ]}
            >
              {ziStatusPointSm}
            </Icon>
            {!props.pictureOnly && <p>{props.item.rate?.percent}%</p>}
          </div>
          <div class="flex space-x-1 items-center justify-start">
            {!props.pictureOnly && (
              <span class="text-gray-200 dark:text-gray-100">
                {props.item.rate?.count}
              </span>
            )}
            <Icon
              class={[
                'text-gray-100 dark:text-gray-200',
                { 'stroke-white stroke-1': props.pictureOnly },
              ]}
            >
              {ziBolt}
            </Icon>
          </div>
        </div>
        <div
          class={{
            'relative w-full ring-1 ring-light-gray-300 dark:ring-gray-650 ring-inset aspect-w-5 aspect-h-4 xs:aspect-w-4 xs:aspect-h-3 sm:aspect-w-4 sm:aspect-h-5 md:aspect-w-5 md:aspect-h-6 lg:aspect-w-6 lg:aspect-h-7 xl:aspect-w-1 xl:aspect-h-1':
              true,
            'xs:rounded-lg': props.pictureOnly,
          }}
        >
          {props.item.picture && (
            <img class="object-cover" src={props.item.picture} />
          )}
          {props.item.price && (
            <div class="absolute left-0 inset-y-0 flex items-center justify-start pointer-events-none">
              <div class="bg-white dark:bg-gray-900 backdrop-blur-sm pointer-events-auto rounded-r p-2">
                <span>$</span>&nbsp;
                <span>{n(props.item.price || 0, 'fixed')}</span>
              </div>
            </div>
          )}
          {!props.pictureOnly && (
            <div class="absolute right-0 inset-y-0 flex items-center justify-end pointer-events-none">
              <div class="flex flex-col items-end space-y-2 pointer-events-auto pr-2">
                {props.item.labels &&
                  props.item.labels.map((item: any) => {
                    const labelProps = {} as ItemLabelProps
                    const labelSlots = {} as any
                    const isArray = Array.isArray(item)
                    const opt = isArray ? item[1] : undefined
                    labelProps.preset =
                      typeof item === 'string'
                        ? item
                        : isArray
                        ? item[0]
                        : undefined
                    if (opt && opt.preset && !labelProps.preset) {
                      labelProps.preset = opt.preset
                    }
                    if (opt && opt.text) {
                      labelSlots.default = () => opt.text
                    }
                    if (opt) {
                      ;['count', 'background', 'maxWidth'].forEach((key) => {
                        if (opt[key]) {
                          labelProps[key as keyof ItemLabelProps] = opt[key]
                        }
                      })
                    }
                    return <ItemLabel {...labelProps} v-slots={labelSlots} />
                  })}
              </div>
            </div>
          )}
        </div>
        {!props.pictureOnly && (
          <div class="px-4 py-2">
            <h5 class="leading-tight dark:text-white">{props.item.name}</h5>
          </div>
        )}
        <div
          class={{
            'flex space-x-2 items-start justify-start w-full p-4 pt-2': true,
            'absolute inset-x-0 bottom-0 z-1': props.pictureOnly,
          }}
        >
          {!props.pictureOnly && props.item.owner?.picture && (
            <Image
              src={props.item.owner.picture}
              aspectRatio={1}
              class="w-6 h-6 flex-grow-0 flex-shrink-0 rounded-full"
            />
          )}
          <div class="flex-grow">
            {!props.pictureOnly && (
              <span class="text-gray-200 dark:text-gray-100 text-sm">
                {props.item.owner?.fullName}
              </span>
            )}
            {props.item.owner?.isVerified && (
              <div class="inline-flex items-center justify-center align-middle relative w-6 h-6">
                {props.pictureOnly && (
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="4.5"
                      y="5.5"
                      width="11"
                      height="11"
                      rx="5.5"
                      stroke="white"
                    />
                  </svg>
                )}
                <img
                  src={
                    require('@zennnn/icons/colorfull/Check-blue-xs.svg').default
                  }
                  alt="verified"
                  class="absolute top-0 left-0 w-full h-full"
                />
              </div>
            )}
          </div>
          {props.isMobile ? (
            <Modal
              v-slots={{
                activator: () => (
                  <Icon
                    class={{
                      'text-gray-100 dark:text-gray-200 flex-shrink-0': true,
                      'stroke-white stroke-1': props.pictureOnly,
                    }}
                  >
                    {ziAction}
                  </Icon>
                ),
              }}
              v-model={[isMenuActive.value]}
              class="flex items-end min-h-full h-full px-0"
              contentClass="bg-white dark:bg-gray-900 w-full h-auto flex flex-col space-y-2 rounded-none overflow-auto px-6 py-12 my-0"
              overlayClass="bg-gray-900 dark:bg-white bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg"
              top="auto"
              hideOverflow
              transition={{
                appear: true,
                enterActiveClass: 'transition ease-out duration-300',
                enterFromClass: 'translate-y-full',
                enterToClass: 'translate-y-0',
                leaveActiveClass: 'transition ease-in duration-300',
                leaveFromClass: 'translate-y-0',
                leaveToClass: 'translate-y-full',
              }}
            >
              {menuItems.value.map((item) => (
                <Btn
                  outlined
                  class="text-gray-900 dark:text-white"
                  onClick={() => {
                    isMenuActive.value = false
                  }}
                >
                  <Icon class="flex-shrink-0 mr-2">{item.icon}</Icon>
                  <div>{item.text}</div>
                </Btn>
              ))}
            </Modal>
          ) : (
            <Menu
              v-model={[isMenuActive.value]}
              v-slots={{
                activator: () => (
                  <Icon
                    class={{
                      'text-gray-100 dark:text-gray-200 flex-shrink-0': true,
                      'stroke-white stroke-1': props.pictureOnly,
                    }}
                  >
                    {ziAction}
                  </Icon>
                ),
              }}
              arrow={false}
              distance={-40}
              skidding={16}
              placement="top-end"
              openDelay={75}
              attach={false}
              class="menu-item-card"
            >
              {menuItems.value.map((item, i) => (
                <MenuItem index={i} class="h-12 px-4">
                  <Icon class="flex-shrink-0 mr-2">{item.icon}</Icon>
                  <div>{item.text}</div>
                </MenuItem>
              ))}
            </Menu>
          )}
        </div>
      </div>
    )
  },
})
