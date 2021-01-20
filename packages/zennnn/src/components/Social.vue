<template>
  <div class="flex space-x-4">
    <Icon
      v-for="(icon, i) in icons"
      :key="i"
      class="text-gray-200 hover:text-blue-400 focus:ring focus:outline-none"
    >
      {{ icon }}
    </Icon>
  </div>
</template>

<script>
import { ziInstagram, ziFacebook, ziVk, ziTelegram, ziYoutube } from '../assets/icons'

import Icon from './Base/Icon'

export default {
  name: 'Social',

  components: { Icon },

  data () {
    return {
      icons: {
        ziInstagram,
        ziFacebook,
        ziVk,
        ziTelegram,
        ziYoutube,
      },
    }
  },
}
</script>
