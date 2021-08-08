import { defineComponent, ref, reactive, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import {
  Window,
  WindowItem,
  TextField,
  Alert,
  Btn,
  Select,
  Form,
} from '@zennnn/core'
import { LOCALES_LIST } from 'shared/config'
import { useRender } from 'shared/composables/render'
import { InvitationRole } from '@/graphql/types'
import { GET_INVITE_USER_TO_ORG } from '@/graphql/queries'
import { INVITE_USER_TO_ORG } from '@/graphql/mutations'

import type {
  InviteUserToOrg,
  InviteUserToOrgVariables,
  GetInviteUserToOrg,
  GetInviteUserToOrgVariables,
} from '@/graphql/types'

interface InviteForm {
  givenName: string
  familyName: string
  role: InvitationRole | undefined
  locale: string
}

export default defineComponent({
  props: {
    orgId: {
      type: String,
      required: true,
    },
  },

  emits: ['success'],

  setup(props, { emit }) {
    const { t } = useI18n()
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const step = ref(1)

    const getUserFormLoading = ref(false)
    const getUserFormRef = ref()
    const getUserEmailInputRef = ref()
    const getUserErrorMessage = ref('')
    const getUserFormModel = reactive({
      email: '',
    })

    const inviteFormLoading = ref(false)
    const inviteFormRef = ref()
    const inviteGivenNameInputRef = ref()
    const inviteErrorMessage = ref('')
    const inviteFormModel = reactive<InviteForm>({
      givenName: '',
      familyName: '',
      role: undefined,
      locale: '',
    })

    const inviteUser = ref<GetInviteUserToOrg['getInviteUserToOrg']>(null)

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      requiredSelect: (v: any) => !!v || t('rule.requiredSelect'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
    })

    const roles = computed(() => [
      {
        value: InvitationRole.MANAGER,
        text: t(`role.${InvitationRole.MANAGER}`),
      },
      {
        value: InvitationRole.ACCOUNTANT,
        text: t(`role.${InvitationRole.ACCOUNTANT}`),
      },
      {
        value: InvitationRole.WAREHOUSEMAN,
        text: t(`role.${InvitationRole.WAREHOUSEMAN}`),
      },
      {
        value: InvitationRole.FREELANCER,
        text: t(`role.${InvitationRole.FREELANCER}`),
      },
    ])

    function focus() {
      nextTick(() => {
        if (step.value === 1) {
          nextTick(() => {
            getUserEmailInputRef.value && getUserEmailInputRef.value.focus()
          })
        } else if (step.value === 2) {
          nextTick(() => {
            inviteGivenNameInputRef.value &&
              inviteGivenNameInputRef.value.focus()
          })
        }
      })
    }

    function reset() {
      step.value = 1
      getUserFormRef.value && getUserFormRef.value.reset()
      getUserErrorMessage.value = ''
      resetInviteForm()
    }

    function resetInviteForm() {
      inviteUser.value = null
      inviteErrorMessage.value = ''
      inviteFormRef.value && inviteFormRef.value.reset()
      inviteFormModel.givenName = ''
      inviteFormModel.familyName = ''
      inviteFormModel.role = undefined
      inviteFormModel.locale = ''
    }

    async function getInviteUserToOrg() {
      try {
        if (getUserFormRef.value.validate(true)) {
          getUserFormLoading.value = true

          resetInviteForm()

          const { data } = await apolloClient.query<
            GetInviteUserToOrg,
            GetInviteUserToOrgVariables
          >({
            query: GET_INVITE_USER_TO_ORG,
            variables: {
              orgId: props.orgId,
              email: getUserFormModel.email,
            },
            fetchPolicy: 'no-cache',
          })
          inviteUser.value = data && data.getInviteUserToOrg
          if (inviteUser.value) {
            inviteFormModel.givenName = inviteUser.value.givenName as string
            inviteFormModel.familyName = inviteUser.value.familyName as string
            inviteFormModel.role = undefined
            inviteFormModel.locale = ''
          }

          step.value = 2

          focus()
        }
      } catch (error) {
        if (
          error.message === 'GraphQL error: Error: User already exist in org.'
        ) {
          getUserErrorMessage.value = t('staff.userAlreadyExistInOrg')
        } else {
          throw new Error(error)
        }
      } finally {
        getUserFormLoading.value = false
      }
    }

    async function inviteUserToOrg() {
      try {
        if (inviteFormRef.value.validate(true)) {
          inviteFormLoading.value = true
          const input = {
            invitationEmail: getUserFormModel.email,
            invitationGivenName: inviteFormModel.givenName,
            invitationFamilyName: inviteFormModel.familyName,
            invitationRole: inviteFormModel.role as InvitationRole,
            invitationLocale: inviteFormModel.locale,
          }
          await apolloClient.mutate<InviteUserToOrg, InviteUserToOrgVariables>({
            mutation: INVITE_USER_TO_ORG,
            variables: {
              orgId: props.orgId,
              input,
            },
            refetchQueries: ['ListStaff'],
          })

          nextTick(reset)

          emit('success')
        }
      } catch (error) {
        if (
          error.message ===
          'GraphQL error: UsernameExistsException: An account with the given email already exists.'
        ) {
          inviteErrorMessage.value = t('staff.userNotActive')
        } else {
          throw new Error(error)
        }
      } finally {
        inviteFormLoading.value = false
      }
    }

    useRender(() => (
      <Window v-model={step.value}>
        <WindowItem value={1}>
          <Form ref={getUserFormRef} lazyValidation class="p-6">
            <TextField
              ref={getUserEmailInputRef}
              v-model={getUserFormModel.email}
              label={t('staff.login')}
              rules={[rules.required, rules.email]}
              hideDetails={false}
              placeholder="example@mail.com"
              validateOnBlur
              required
              type="email"
              name="email"
              class="pb-8"
              {...{
                'onUpdate:modelValue': () => {
                  getUserErrorMessage.value = ''
                },
              }}
            />
            <Alert
              v-model={getUserErrorMessage.value}
              close
              color="error"
              class="mb-6"
              transition="slide-y-transition"
            >
              {getUserErrorMessage.value}
            </Alert>
            <div class="text-right">
              <Btn
                loading={getUserFormLoading.value}
                type="submit"
                onClick={getInviteUserToOrg}
              >
                <span>{t('staff.next')}</span>
              </Btn>
            </div>
          </Form>
        </WindowItem>
        <WindowItem value={2}>
          <Form ref={inviteFormRef} lazyValidation class="p-6">
            <TextField
              ref={inviteGivenNameInputRef}
              v-model={inviteFormModel.givenName}
              label={t('staff.firstName')}
              placeholder={t('staff.firstName')}
              rules={[rules.required]}
              hideDetails={false}
              readonly={!!inviteUser.value}
              validateOnBlur
              autofocus
              required
              name="first-name"
              class="pb-2"
            />
            <TextField
              v-model={inviteFormModel.familyName}
              label={t('staff.lastName')}
              placeholder={t('staff.lastName')}
              rules={[rules.required]}
              hideDetails={false}
              readonly={!!inviteUser.value}
              validateOnBlur
              required
              name="last-name"
              class="pb-2"
            />
            <Select
              v-model={inviteFormModel.role}
              label={t('staff.access')}
              placeholder={t('staff.access')}
              items={roles.value}
              rules={[rules.requiredSelect]}
              hideDetails={false}
              validateOnBlur
              required
              class="pb-2"
            />
            <Select
              v-model={inviteFormModel.locale}
              label={t('companyDetail.label.language')}
              placeholder={t('companyDetail.label.language')}
              items={LOCALES_LIST}
              rules={[rules.requiredSelect]}
              hideDetails={false}
              validateOnBlur
              required
              class="pb-8"
            />
            <Alert
              v-model={inviteErrorMessage.value}
              close
              color="error"
              class="mb-6"
              transition="slide-y-transition"
            >
              {inviteErrorMessage.value}
            </Alert>
            <div class="flex justify-between">
              <Btn
                disabled={inviteFormLoading.value}
                minWidth="none"
                outlined
                onClick={() => {
                  step.value = 1
                  focus()
                }}
              >
                {t('staff.back')}
              </Btn>
              <Btn
                loading={inviteFormLoading.value}
                type="submit"
                onClick={inviteUserToOrg}
              >
                {t('staff.invite')}
              </Btn>
            </div>
          </Form>
        </WindowItem>
      </Window>
    ))

    return {
      focus,
      reset,
    }
  },
})
