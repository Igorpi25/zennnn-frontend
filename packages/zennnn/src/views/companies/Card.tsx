import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Progress, Btn } from '@zennnn/core'
import Dialog from 'shared/components/Dialog'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { GET_ORG_REQUISITE } from '@/graphql/queries'
import {
  CREATE_REQUISITE,
  UPDATE_REQUISITE,
  NOTE_GREETING,
} from '@/graphql/mutations'
import Form from '@/components/company/Form'
import { useProfile } from '@/composables/profile'
import { useNotify } from '@/plugins'

import type {
  GetOrgRequisite,
  GetOrgRequisiteVariables,
  CreateRequisite,
  CreateRequisiteVariables,
  UpdateRequisite,
  UpdateRequisiteVariables,
  NoteGreeting,
} from '@/graphql/types'

export default defineComponent({
  props: {
    create: Boolean,
  },

  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const notify = useNotify()
    const { profile } = useProfile()

    const routeReplaceLoading = ref(false)
    const showFillLaterButton = ref(false)
    const welcomeDialog = ref()

    const userInitKeyStore = computed(
      () => `zn.is-user-init.${profile.value?.id}`
    )

    const { loading: getCompanyLoading, result: getCompanyResult } = useQuery<
      GetOrgRequisite,
      GetOrgRequisiteVariables
    >(
      GET_ORG_REQUISITE,
      () => ({
        id: route.params.companyId as string,
      }),
      () => ({
        enabled: !props.create,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
      })
    )

    const item = computed(() => getCompanyResult.value?.getOrgRequisite)

    const { mutate: createMutate } = useMutation<
      CreateRequisite,
      CreateRequisiteVariables
    >(CREATE_REQUISITE)

    const { mutate: updateMutate } = useMutation<
      UpdateRequisite,
      UpdateRequisiteVariables
    >(UPDATE_REQUISITE)

    const { mutate: noteGreetingMutate } =
      useMutation<NoteGreeting>(NOTE_GREETING)

    onMounted(() => {
      if (route.query.welcome) {
        const isUserInit = localStorage.getItem(userInitKeyStore.value)
        if (!isUserInit) {
          welcomeDialog.value = true
          showFillLaterButton.value = true
          localStorage.setItem(userInitKeyStore.value, '1')
          noteGreetingMutate()
        }
      }
    })

    async function onUpdate(input: any) {
      if (props.create) {
        const response = await createMutate({
          orgId: route.params.orgId as string,
          input: input,
        })
        if (response?.data?.createRequisite) {
          notify(t('requisite.created'))
          await router.replace({
            name: 'company',
            params: {
              orgId: route.params.orgId,
              companyId: response.data.createRequisite.id,
            },
          })
        }
      } else if (item.value?.id) {
        await updateMutate({
          id: item.value.id,
          input: input,
        })
      }
    }

    function goBack() {
      if (showFillLaterButton.value) {
        router.push({ name: 'main' })
      } else {
        router.go(-1)
      }
    }

    return () => (
      <div class="container relative pt-8 pb-12">
        <Form
          key={route.fullPath}
          orgId={route.params.orgId as string}
          companyId={route.params.companyId as string}
          item={item.value || undefined}
          loading={getCompanyLoading.value}
          create={props.create}
          {...{
            onUpdate: onUpdate,
          }}
          v-slots={{
            back: () => (
              <Btn outlined {...{ onClick: goBack }}>
                {showFillLaterButton.value
                  ? t('requisite.fillLater')
                  : t('requisite.back')}
              </Btn>
            ),
          }}
        />

        {routeReplaceLoading.value && (
          <div class="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 backdrop-blur-lg transition-all">
            <Progress class="text-blue-500" size={42} indeterminate />
          </div>
        )}

        <Dialog v-model={welcomeDialog.value} width="100%" maxWidth="448">
          <div class="text-white">
            <img
              src={require('@zennnn/icons/colorfull/Hello48.svg').default}
              class="mb-4"
            />
            <h5 class="text-lg font-semibold pb-4">{t('welcomeModal.head')}</h5>
            <div class="pb-8">
              <p>{t('welcomeModal.content')}</p>
              <br />
              <p>
                {t('welcomeModal.footer')}
                &nbsp;
                {t('welcomeModal.myCompanies')}
                &nbsp;
                {t('welcomeModal.footerInMenu')}
              </p>
            </div>
            <div class="flex justify-between">
              <Btn
                outlined
                {...{
                  onClick: goBack,
                }}
              >
                {t('requisite.fillLater')}
              </Btn>
              <Btn
                primary
                {...{
                  onClick: () => {
                    welcomeDialog.value = false
                  },
                }}
              >
                {t('welcomeModal.fillRequisites')}
              </Btn>
            </div>
          </div>
        </Dialog>
      </div>
    )
  },
})
