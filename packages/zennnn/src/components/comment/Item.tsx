import { defineComponent } from 'vue'
import Card from './Card'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    isPreview: Boolean,
    isProduct: Boolean,
    specId: String,
    productId: String,
  },

  setup(props) {
    return () => (
      <div>
        <Card item={props.item} />
        <div class="pt-4 pl-4">
          {props.item.comments?.map((item: any) => (
            <Card item={item} />
          ))}
        </div>
        <div class="border-b my-4 border-light-gray-400 dark:border-gray-200" />
      </div>
    )
  },
})
