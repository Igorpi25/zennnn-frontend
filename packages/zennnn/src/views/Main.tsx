import { defineComponent, ref } from 'vue'
import Search from '@/components/item/Search'
import Card, { CardItem, LabelTypes } from '@/components/item/Card'
import MainAppBar from '@/components/core/MainAppBar'
import { useDisplay } from '@/plugins'

export default defineComponent({
  setup() {
    const isPictureOnly = ref(false)
    const isSearchActive = ref(false)

    const items = Array.from(Array(12).keys()).map((key) => {
      const i = key + 1
      return {
        name: `T-Shirt Man Seven Collection - ${i}`,
        article: '', // model
        rate: {
          percent: 97,
          count: 1,
        },
        picture: 'https://via.placeholder.com/265x279',
        labels: [LabelTypes.New, [LabelTypes.Colors, { count: 2 }]],
        price: 111.11,
        owner: {
          picture: 'https://via.placeholder.com/24x24',
          fullName: 'FOG',
          isVerified: true,
        },
      } as CardItem
    })

    const { mobile } = useDisplay()

    return () => (
      <>
        <MainAppBar
          v-models={[
            [isPictureOnly.value, 'pictureOnly'],
            [isSearchActive.value, 'searchActive'],
          ]}
          hasPictureOnly
          hasSearch
        />
        <main class="container px-0 xs:px-4 sm:px-6 pb-40 md:pb-32">
          <Search v-model={[isSearchActive.value, 'visible']} />
          <div class="grid gap-1 sm:gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <Card
                item={item}
                pictureOnly={isPictureOnly.value}
                isMobile={mobile.value}
              />
            ))}
          </div>
        </main>
      </>
    )
  },
})
