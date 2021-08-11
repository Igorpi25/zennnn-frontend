import { defineComponent } from 'vue'
import { useModel } from 'vue-supp'
import {
  ziSearch,
  ziFilterOutline,
  ziSortAmountDown,
  ziCloseWindow,
  ziChevronDown,
} from '@zennnn/icons'
import { TextField, Icon, Btn, Modal } from '@zennnn/core'
import { useDisplay } from 'shared/composables/display'

export default defineComponent({
  props: {
    visible: Boolean,
  },

  emits: ['update:visible'],

  setup(props) {
    const { mobile } = useDisplay()
    const isActive = useModel(props, 'visible')

    const categories = [
      {
        title: 'Agriculture & Food',
        items: ['Agriculture', 'Food & Beverage'],
      },
      {
        title: 'Apparel,Textiles & Accessories',
        items: [
          'Apparel',
          'Timepieces, Jewelry, Eyewear',
          'Fashion Accessories',
          'Textile & Leather Product',
        ],
      },
      {
        title: 'Auto & Transportation',
        items: ['Vehicles & Accessories'],
      },
      {
        title: 'Bags, Shoes & Accessories',
        items: ['Luggage, Bags & Cases', 'Shoes & Accessories'],
      },
      {
        title: 'Electronics',
        items: [
          'Consumer Electronic',
          'Home Appliance',
          'Security & Protection',
        ],
      },
      {
        title: 'Electrical Equipment, Components & Telecoms',
        items: ['Electrical Equipment & Supplies'],
      },
      {
        title: 'Gifts, Sports & Toys',
        items: ['Sports & Entertainment', 'Gifts & Crafts', 'Toys & Hobbies'],
      },
      {
        title: 'Health & Beauty',
        items: ['Health & Medical', 'Beauty & Personal Care'],
      },
      {
        title: 'Home, Lights & Construction',
        items: [
          'Construction & Real Estate',
          'Home & Garden',
          'Lights & Lighting',
          'Furniture',
        ],
      },
      {
        title: 'Machinery, Industrial Parts & Tools',
        items: ['Machinery', 'Fabrication Services', 'Tools & Hardware'],
      },
      {
        title: 'Metallurgy, Chemicals, Rubber & Plastics',
        items: [
          'Minerals & Metallurgy',
          'Chemicals',
          'Rubber & Plastics',
          'Energy',
        ],
      },
      {
        title: 'Packaging, Advertising & Office',
        items: [
          'Packaging & Printing',
          'Office & School Supplies',
          'Service Equipment',
        ],
      },
    ]

    return () => (
      <Modal
        v-model={isActive.value}
        v-slots={{
          activator: () => (
            <div class="hidden sm:flex space-x-4 pb-6">
              <div class="flex-grow flex items-center h-12 rounded-lg ring-1 ring-inset ring-light-gray-550 dark:ring-gray-400 dark:text-white space-x-2 px-4">
                <Icon>{ziSearch}</Icon>
                <div>Search</div>
              </div>
              <div class="flex items-center justify-between space-x-2 h-12 rounded-lg ring-1 ring-inset ring-light-gray-550 dark:ring-gray-400 dark:text-white w-28 md:w-[182px] pl-4 pr-3">
                <Icon>{ziFilterOutline}</Icon>
                <div class="hidden md:block flex-grow text-left">By Newest</div>
                <Icon>{ziSortAmountDown}</Icon>
              </div>
            </div>
          ),
        }}
        width="100%"
        maxWidth="1162px"
        class="sm:px-2"
        contentClass="origin-top"
        overlayClass="bg-gray-900 dark:bg-white bg-opacity-60 dark:bg-opacity-60 backdrop-blur-lg"
        top={80} // 96px(header height) - 16px (modal padding-top)
        fullscreen={mobile.value}
      >
        <div class="dark:bg-gray-900 p-4">
          <div class="flex flex-wrap justify-between sm:flex-nowrap sm:space-x-4 pb-4 sm:pb-12">
            {mobile.value && (
              <Btn
                icon
                class="sm:hidden bg-light-gray-300 dark:bg-gray-650 text-gray-900 dark:text-white"
                onClick={() => {
                  isActive.value = !isActive.value
                }}
              >
                <Icon>{ziCloseWindow}</Icon>
              </Btn>
            )}
            <TextField
              class="flex-grow w-full sm:w-auto order-last sm:order-none mt-8 sm:mt-0"
              controlClass="rounded-lg ring-1 ring-inset ring-light-gray-550 dark:ring-gray-400 dark:text-white focus-within:ring-blue-500 dark:focus-within:ring-blue-500 focus-within:shadow-main-day dark:focus-within:shadow-main-night !pr-3"
              inputClass="min-h-[3rem] placeholder-base pl-4"
              placeholder="Search product"
              v-slots={{
                append: () => <Icon class="flex-shrink-0">{ziSearch}</Icon>,
              }}
            />
            <div class="flex space-x-4">
              {mobile.value && (
                <Btn
                  outlined
                  minWidth="none"
                  class="text-gray-900 dark:text-white pl-4 pr-0"
                >
                  <Icon class="xs:hidden">{ziFilterOutline}</Icon>
                  <div class="hidden xs:block flex-grow">
                    Show by Sharing Amount
                  </div>
                  <Icon class="mx-2">{ziChevronDown}</Icon>
                </Btn>
              )}
              <Btn
                outlined
                minWidth="none"
                class="justify-between text-gray-900 dark:text-white w-12 sm:w-28 md:w-[182px] px-3 sm:pl-4 sm:space-x-2"
              >
                <Icon class="hidden sm:inline-flex">{ziFilterOutline}</Icon>
                <div class="hidden md:block flex-grow text-left">By Newest</div>
                <Icon>{ziSortAmountDown}</Icon>
              </Btn>
            </div>
          </div>
          <div class="md:list-cols-2">
            {categories.map((cat) => (
              <div class="inline-block py-4 sm:px-4">
                <div class="text-lg font-semibold leading-tight dark:text-white pb-4">
                  {cat.title}
                </div>
                <div class="flex flex-wrap gap-x-2 gap-y-4">
                  {cat.items.map((item) => (
                    <Btn outlined small>
                      {item}
                    </Btn>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div class="text-right p-4">
            <Btn small>All Categories</Btn>
          </div>
        </div>
      </Modal>
    )
  },
})
