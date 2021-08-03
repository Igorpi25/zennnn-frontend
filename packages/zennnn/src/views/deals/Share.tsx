import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ziCloseDelete, ziShare, ziCopy } from '@zennnn/icons'
import { TextField, Btn, Icon, LoadingSpinner, Tooltip } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { useNotify } from 'shared/composables/notify'
import { GET_SPEC_LINK_ACCESS, GET_SPEC_EMAIL_ACCESS } from '@/graphql/queries'
import {
  REMOVE_EMAIL_ACCESS_TO_SPEC,
  SEND_LINK_ACCESS_TO_EMAIL,
  OPEN_LINK_ACCESS,
  CLOSE_LINK_ACCESS,
} from '@/graphql/mutations'
import { logger } from '@/plugins'

import type {
  GetSpecLinkAccess,
  GetSpecLinkAccessVariables,
  GetSpecEmailAccess,
  GetSpecEmailAccessVariables,
  RemoveEmailAccessToSpec,
  RemoveEmailAccessToSpecVariables,
  SendLinkAccessToEmail,
  SendLinkAccessToEmailVariables,
  OpenLinkAccess,
  OpenLinkAccessVariables,
  CloseLinkAccess,
  CloseLinkAccessVariables,
} from '@/graphql/types'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()

    const dialog = ref(false)
    const linkInputRef = ref()
    const emailAccessInputRef = ref()
    const emailAccessInput = ref('')
    const removeEmailAccessToSpecEmail = ref()

    const link = computed(
      () =>
        `${window.location.protocol}//${window.location.host}/preview/${route.params.specId}`
    )

    watch(dialog, (val) => {
      if (!val) {
        router.push({
          name: 'spec',
          params: {
            orgId: route.params.orgId,
            specId: route.params.specId,
          },
        })
      }
    })

    onMounted(() => {
      dialog.value = true
    })

    const {
      result: getSpecLinkAccessResult, // eslint-disable-line
      loading: getSpecLinkAccessLoading, // eslint-disable-line
    } = useQuery<GetSpecLinkAccess, GetSpecLinkAccessVariables>(
      GET_SPEC_LINK_ACCESS,
      () => ({
        id: route.params.specId as string,
      })
    )

    const {
      result: getSpecEmailAccessResult,
      loading: getSpecEmailAccessLoading,
    } = useQuery<GetSpecEmailAccess, GetSpecEmailAccessVariables>(
      GET_SPEC_EMAIL_ACCESS,
      () => ({
        id: route.params.specId as string,
      })
    )

    const { mutate: removeEmailAccessToSpecMutate } = useMutation<
      RemoveEmailAccessToSpec,
      RemoveEmailAccessToSpecVariables
    >(REMOVE_EMAIL_ACCESS_TO_SPEC, {
      refetchQueries: ['GetSpecEmailAccess'],
    })

    const {
      mutate: sendLinkAccessToEmailMutate,
      loading: sendLinkAccessToEmailLoading,
      onDone: onSendLinkAccessToEmailDone,
      onError: onSendLinkAccessToEmailError,
    } = useMutation<SendLinkAccessToEmail, SendLinkAccessToEmailVariables>(
      SEND_LINK_ACCESS_TO_EMAIL
    )

    const {
      mutate: openLinkAccessMutate,
      loading: openLinkAccessLoading, // eslint-disable-line
      onDone: onOpenLinkAccessDone,
    } = useMutation<OpenLinkAccess, OpenLinkAccessVariables>(OPEN_LINK_ACCESS)

    const {
      mutate: closeLinkAccessMutate,
      loading: closeLinkAccessLoading, // eslint-disable-line
      onDone: onCloseLinkAccessDone,
    } = useMutation<CloseLinkAccess, CloseLinkAccessVariables>(
      CLOSE_LINK_ACCESS
    )

    onSendLinkAccessToEmailDone(() => {
      notify.success(t('message.emailSent', { email: emailAccessInput.value }))
      emailAccessInput.value = ''
    })

    onSendLinkAccessToEmailError(() => {
      notify.error(t('message.failedToSent'))
    })

    onOpenLinkAccessDone(() => {
      notify(t('shipping.linkAccessUpdated'))
    })

    onCloseLinkAccessDone(() => {
      notify(t('shipping.linkAccessUpdated'))
    })

    function copyLink() {
      let selection: Range | null | undefined = null
      try {
        const input = linkInputRef.value?.$el?.querySelector('input')
        if (!input) {
          throw new Error('Input not find.')
        }
        selection = document.getSelection()?.rangeCount
          ? document.getSelection()?.getRangeAt(0)
          : null
        input.select()
        const successful = document.execCommand('copy')
        if (successful) {
          notify.success(t('message.linkCopied'))
        } else {
          throw new Error('Unsuccessful.')
        }
      } catch (error) {
        logger.info('Copy link error: ', error)
        notify.warn(t('message.linkNotCopied'))
      }
      document.getSelection()?.removeAllRanges()
      if (selection) {
        document.getSelection()?.addRange(selection)
      }
    }

    // eslint-disable-next-line
    function updateLinkAccess(value: boolean | null) {
      if (value) {
        openLinkAccessMutate({
          specId: route.params.specId as string,
        })
      } else {
        closeLinkAccessMutate({
          specId: route.params.specId as string,
        })
      }
    }

    return () => (
      <Dialog
        v-model={dialog.value}
        icon={ziShare}
        title={t('shipping.access')}
      >
        {/* <Switch
            modelValue={getSpecLinkAccessResult.value?.getSpecLinkAccess}
            loading={getSpecLinkAccessLoading.value || openLinkAccessLoading.value || closeLinkAccessLoading.value}
            class="mb-2"
            onChange={updateLinkAccess}
          >
            <span>{t('shipping.linkAccess')}</span>
          </Switch> */}
        <TextField
          ref={linkInputRef}
          modelValue={link.value}
          readonly
          class="pb-4"
          v-slots={{
            append: () => (
              <Tooltip
                v-slots={{
                  activator: () => (
                    <Btn icon text mini {...{ onClick: copyLink }}>
                      <Icon>{ziCopy}</Icon>
                    </Btn>
                  ),
                }}
              >
                {t('shipping.copyLink')}
              </Tooltip>
            ),
          }}
        />

        <h4 class="py-5 font-semibold">{t('shipping.sendAccessLink')}</h4>

        <TextField
          ref={emailAccessInputRef}
          v-model={emailAccessInput.value}
          loading={sendLinkAccessToEmailLoading.value}
          label="Email"
          placeholder="example@mail.com"
          type="email"
          required
          class="pb-8"
        />
        <Btn
          loading={sendLinkAccessToEmailLoading.value}
          {...{
            onClick: () =>
              sendLinkAccessToEmailMutate({
                specId: route.params.specId as string,
                email: emailAccessInput.value,
              }),
          }}
        >
          {t('shipping.sendEmail')}
        </Btn>

        {getSpecEmailAccessResult.value?.getSpecEmailAccess?.length ? (
          <div class="py-4">
            <h4 class="font-semibold">{t('shipping.hasAccess')}</h4>
            {getSpecEmailAccessResult.value?.getSpecEmailAccess?.map((item) => (
              <div class="flex py-2">
                <div class="flex-grow">{item.email}</div>
                <Btn
                  icon
                  text
                  mini
                  loading={removeEmailAccessToSpecEmail.value === item.email}
                  class="text-gray-200"
                  {...{
                    onClick: async () => {
                      try {
                        removeEmailAccessToSpecEmail.value = item.email
                        await removeEmailAccessToSpecMutate({
                          specId: route.params.specId as string,
                          email: item.email,
                        })
                      } catch (error) {
                        // eslint-disable-line
                      } finally {
                        removeEmailAccessToSpecEmail.value = undefined
                      }
                    },
                  }}
                >
                  <Icon>{ziCloseDelete}</Icon>
                </Btn>
              </div>
            ))}
            {getSpecEmailAccessLoading.value && <LoadingSpinner />}
          </div>
        ) : undefined}
      </Dialog>
    )
  },
})
