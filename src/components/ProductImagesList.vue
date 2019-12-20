<template>
  <div
    class="flex px-1 overflow-x-auto"
  >
    <div
      v-for="(img, i) in imagesList"
      :key="img"
    >
      <v-img
        :src="`${img}${ICON_IMAGE_POSTFIX}`"
        :class="[
          'rounded-sm h-6 w-6',
          { 'mr-1' : i + 1 < imagesList.length },
        ]"
        aspect-ratio="1"
      >
        <template v-slot:placeholder>
          <div class="flex justify-center items-center w-full h-full">
            <Spinner />
          </div>
        </template>
      </v-img>
    </div>
  </div>
</template>

<script>
import { ICON_IMAGE_POSTFIX } from '../config/globals'

export default {
  name: 'ProductImagesList',
  props: {
    productId: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: undefined,
    },
  },
  data () {
    return {
      ICON_IMAGE_POSTFIX,
    }
  },
  computed: {
    imagesList () {
      return this.images || []
    },
  },
}
</script>
