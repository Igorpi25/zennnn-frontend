import { defineComponent } from 'vue'
import { ziUserCircle, ziStarOutlineLg, ziSettings } from '@zennnn/icons'
import { Modal, Icon } from '@zennnn/core'
import Avatar from './Avatar'
import AccountInfo from './AccountInfo'
import SubscriptionLabel from './SubscriptionLabel'

export default defineComponent({
  setup(props, { slots }) {
    return () => (
      <Modal
        v-slots={{
          activator: () => slots.activator?.(),
        }}
        width="100%"
        maxWidth="448px"
        contentClass="!mx-4"
      >
        <div class="bg-light-gray-300 dark:bg-gray-500 flex items-center space-x-2 p-4">
          <Icon large>{ziUserCircle}</Icon>
          <h5 class="dark:text-white font-semibold text-lg">Select Account</h5>
        </div>
        <div class="px-4 py-6">
          <div class="pb-2">Director Role</div>

          <div class="space-y-4">
            <div class="bg-light-gray-550 dark:bg-gray-400 small-form-day dark:small-form-night rounded-lg flex space-x-4 p-4">
              <Avatar
                size={88}
                src="https://via.placeholder.com/48x48"
                class={['bg-light-gray-400 dark:bg-gray-700 text-xl']}
              />
              <div class="flex flex-col flex-grow">
                <h5 class="dark:text-white font-semibold text-lg leading-none mb-1">
                  BERLOGGA LLC
                </h5>
                <div class="text-gray-200 dark:text-gray-100 mb-4">
                  Mikhail Boltenkov
                </div>
                <div class="flex space-x-4">
                  <div class="flex-grow flex items-center justify-between">
                    <Icon>{ziStarOutlineLg}</Icon>
                    <Icon>{ziSettings}</Icon>
                  </div>
                  <SubscriptionLabel status="trial">Trial</SubscriptionLabel>
                </div>
              </div>
            </div>

            <div class="bg-light-gray-300 dark:bg-gray-600 flex items-center justify-between rounded space-x-2 p-2">
              <AccountInfo
                avatarSize={40}
                avatarSrc="https://via.placeholder.com/48x48"
                avatarClass="mr-2"
                infoClass="space-y-1"
                title="Чайная мама"
                subtitle="Александр Игнатович"
              />
              <SubscriptionLabel status="paid">Advanced</SubscriptionLabel>
            </div>

            <div class="bg-light-gray-300 dark:bg-gray-600 flex items-center justify-between rounded space-x-2 p-2">
              <AccountInfo
                avatarSize={40}
                avatarSrc="https://via.placeholder.com/48x48"
                avatarClass="mr-2"
                infoClass="space-y-1"
                title="ivanleunte@gmail.com"
                subtitle="Михаил Болтенков"
              />
              <SubscriptionLabel status="paid">Premium</SubscriptionLabel>
            </div>
          </div>

          <div class="pt-6 pb-2">Manager Role</div>

          <div class="space-y-4">
            <div class="bg-light-gray-300 dark:bg-gray-600 flex items-center justify-between rounded space-x-2 p-2">
              <AccountInfo
                avatarSize={40}
                avatarSrc="https://via.placeholder.com/48x48"
                avatarClass="mr-2"
                infoClass="space-y-1"
                title="Чайная мама"
                subtitle="Николай Слоквенко"
              />
              <SubscriptionLabel>Expired</SubscriptionLabel>
            </div>
          </div>
        </div>
      </Modal>
    )
  },
})
