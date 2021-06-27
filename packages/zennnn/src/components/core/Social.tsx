import { defineComponent } from 'vue'

import {
  ziInstagram,
  ziFacebook,
  ziVk,
  ziTelegram,
  ziYoutube,
} from '@zennnn/icons'
import { Icon, Btn } from '@zennnn/core'

export default defineComponent({
  setup() {
    const icons = [ziInstagram, ziFacebook, ziVk, ziTelegram, ziYoutube]

    return () => (
      <div class="flex space-x-3">
        {icons.map((item) => (
          <Btn icon mini text class="text-gray-200">
            <Icon>{item}</Icon>
          </Btn>
        ))}
      </div>
    )
  },
})
