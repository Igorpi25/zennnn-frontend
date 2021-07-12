import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { ziUserCircle, ziStarOutlineLg, ziSettings } from '@zennnn/icons'
import { Icon } from '@zennnn/core'
import Avatar from 'shared/components/Avatar'
import AccountListItem from 'shared/components/AccountListItem'
import Dialog from 'shared/components/Dialog'
import { useOrgs } from '@/composables/orgs'
import { RoleInProject } from '@/graphql/types'

import type { GetOrgs_getOrgs } from '@/graphql/types'

export default defineComponent({
  emits: ['change'],

  setup(props, { slots, emit }) {
    const { t } = useI18n()
    const { orgsByRole } = useOrgs()

    return () => (
      <Dialog
        v-slots={{
          activator: (props: { attrs: any; listeners: any }) =>
            slots.activator?.(props),
        }}
        icon={ziUserCircle}
        iconClass="dark:text-gray-100"
        title="Select Account"
        bodyClass="px-4 pb-6"
        hideClose
      >
        {orgsByRole.value.map((group, groupIndex) => (
          <>
            <div class="pt-6 pb-2">{t(`header.role.${group[0]}`)}</div>

            <div class="space-y-4">
              {(group[1] as GetOrgs_getOrgs[]).map((item, i) =>
                groupIndex === 0 &&
                group[0] === RoleInProject.OWNER &&
                i === 0 ? (
                  <div class="bg-light-gray-550 dark:bg-gray-400 small-form-day dark:small-form-night rounded-lg flex space-x-4 p-4">
                    <Avatar
                      size={88}
                      src={item.picture}
                      class="bg-light-gray-400 dark:bg-gray-700 text-4xl"
                    >
                      {item?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div class="flex flex-col flex-grow">
                      <h5 class="dark:text-white font-semibold text-lg leading-none mb-1">
                        {item.name}
                      </h5>
                      <div class="text-gray-200 dark:text-gray-100 mb-4">
                        {[item.owner?.givenName, item.owner?.familyName]
                          .filter((e) => !!e)
                          .join(' ')}
                      </div>
                      <div class="flex space-x-4">
                        <div class="flex-grow flex items-center justify-between">
                          <Icon class="text-gray-200">{ziStarOutlineLg}</Icon>
                          <Icon class="text-gray-200">{ziSettings}</Icon>
                        </div>
                        {/* TODO: orgs need SubscriptionLabel */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    class="bg-light-gray-300 dark:bg-gray-600 flex items-center justify-between rounded space-x-2 hover:bg-white dark:hover:bg-gray-650 focus:outline-none focus:ring focus:ring-blue-400 with-focus-visible p-2"
                    {...{
                      role: 'button',
                      tabindex: 0,
                      onClick: () => {
                        emit('change', item.id)
                      },
                    }}
                  >
                    <AccountListItem
                      avatarSize={40}
                      avatarClass="mr-2"
                      infoClass="space-y-1"
                      avatarSrc={item.picture}
                      title={item?.name}
                      subtitle={[item.owner?.givenName, item.owner?.familyName]
                        .filter((e) => !!e)
                        .join(' ')}
                      initials={item?.name?.charAt(0).toUpperCase()}
                    />
                    {/* TODO: orgs need SubscriptionLabel */}
                  </div>
                )
              )}
            </div>
          </>
        ))}
      </Dialog>
    )
  },
})
