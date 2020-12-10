<template>
  <v-dialog
    v-model="dialog"
    :max-width="458"
  >
    <div class="relative bg-gray-400">
      <div class="bg-gray-500 flex items-center text-lg text-white font-semibold px-8 py-5">
        <i class="zi-user-plus text-3xl text-blue-500 mr-4" />
        <div>
          {{ $t('staff.addStaff') }}
        </div>
      </div>
      <div class="text-gray-100 px-8 pt-6 pb-8">
        <v-window v-model="invitationStep">
          <v-window-item :value="1">
            <Form
              ref="emailForm"
              v-model:error-message="emailErrorMessage"
              lazy-validation
            >
              <TextField
                ref="email"
                v-model="emailFormModel.email"
                :label="$t('staff.login')"
                :rules="[rules.required, rules.email]"
                placeholder="example@mail.com"
                validate-on-blur
                type="email"
                name="email"
                class="pb-6"
                @input="emailErrorMessage = ''"
              />
              <div class="text-right">
                <Button
                  :loading="emailFormLoading"
                  min-width="120"
                  @click="getInviteUser"
                >
                  <span>{{ $t('staff.next') }}</span>
                </Button>
              </div>
            </Form>
          </v-window-item>
          <v-window-item :value="2">
            <Form
              ref="inviteForm"
              v-model:error-message="inviteErrorMessage"
              lazy-validation
            >
              <TextField
                ref="givenNameInput"
                v-model="inviteFormModel.givenName"
                :label="$t('staff.firstName')"
                :placeholder="$t('staff.firstName')"
                :rules="[rules.required]"
                :readonly="!!inviteUser"
                validate-on-blur
                name="firstName"
                autofocus
                class="pb-2"
              />
              <TextField
                v-model="inviteFormModel.familyName"
                :label="$t('staff.lastName')"
                :placeholder="$t('staff.lastName')"
                :rules="[rules.required]"
                :readonly="!!inviteUser"
                validate-on-blur
                name="lastName"
                class="pb-2"
              />
              <Select
                v-model="inviteFormModel.role"
                :label="$t('staff.access')"
                :placeholder="$t('staff.access')"
                :items="roles"
                :rules="[rules.requiredSelect]"
                validate-on-blur
                flat
                class="pb-2"
              />
              <Select
                v-model="inviteFormModel.locale"
                :label="$t('companyDetail.label.language')"
                :placeholder="$t('companyDetail.label.language')"
                :items="langs"
                :rules="[rules.requiredSelect]"
                validate-on-blur
                flat
                class="pb-6"
              />
              <div class="flex flex-wrap sm:flex-nowrap justify-between">
                <Button
                  :disabled="inviteFormLoading"
                  :merge-class="inviteFormLoading ? 'text-gray-300 border-gray-200' : 'border-gray-200'"
                  outlined
                  class="w-full sm:w-1/2 order-1 sm:order-none sm:mr-3"
                  @click="invitationStep = 1"
                >
                  <span>{{ $t('staff.back') }}</span>
                </Button>
                <Button
                  :loading="inviteFormLoading"
                  block
                  class="w-full sm:w-1/2  mb-4 sm:mb-0 sm:ml-3"
                  @click="submit"
                >
                  <span>{{ $t('staff.invite') }}</span>
                </Button>
              </div>
            </Form>
          </v-window-item>
        </v-window>
      </div>
      <span
        class="absolute top-0 right-0 text-2xl text-gray-200 hover:text-gray-100 cursor-pointer mt-2 mr-2"
        @click="dialog = false"
      >
        <i class="zi-close" />
      </span>
    </div>
  </v-dialog>
</template>

<script>
import { Role } from '../graphql/enums'
import { GET_INVITE_USER_TO_ORG } from '../graphql/queries'
import { INVITE_USER_TO_ORG } from '../graphql/mutations'
import { LOCALES_LIST } from '../config/globals'

export default {
  name: 'StaffCreateModal',
  props: {
    value: Boolean,
  },
  data () {
    return {
      emailErrorMessage: '',
      inviteErrorMessage: '',
      dialog: false,
      loading: false,
      invitationStep: 1,
      emailFormLoading: false,
      inviteFormLoading: false,
      inviteUser: null,
      emailFormModel: {
        email: '',
      },
      inviteFormModel: {
        givenName: '',
        familyName: '',
        role: '',
        locale: '',
      },
      roleMenu: false,
      rules: {
        required: v => !!v || this.$t('rule.required'),
        requiredSelect: v => !!v || this.$t('rule.requiredSelect'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
      },
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    langs () {
      return LOCALES_LIST
    },
    roles () {
      return [
        { value: Role.MANAGER, text: this.$t(`role.${Role.MANAGER}`) },
        { value: Role.ACCOUNTANT, text: this.$t(`role.${Role.ACCOUNTANT}`) },
        { value: Role.WAREHOUSEMAN, text: this.$t(`role.${Role.WAREHOUSEMAN}`) },
        { value: Role.FREELANCER, text: this.$t(`role.${Role.FREELANCER}`) },
      ]
    },
  },
  watch: {
    value (val) {
      this.dialog = val
    },
    dialog (val) {
      this.$emit('input', val)
      if (!val) {
        this.invitationStep = 1
        this.resetInviteForm()
      }
    },
  },
  methods: {
    reset () {
      this.invitationStep = 1
      if (this.$refs.emailForm) {
        this.$refs.emailForm.reset()
      }
      this.emailErrorMessage = ''
      this.inviteErrorMessage = ''
      this.resetInviteForm()
    },
    resetInviteForm () {
      this.inviteUser = null
      this.inviteErrorMessage = ''
      if (this.$refs.inviteForm) {
        this.$refs.inviteForm.reset()
      }
      this.inviteFormModel = {
        givenName: '',
        familyName: '',
        role: '',
        locale: '',
      }
    },
    async getInviteUser () {
      try {
        if (this.$refs.emailForm.validate(true)) {
          this.emailFormLoading = true
          this.resetInviteForm()
          const { data } = await this.$apollo.query({
            query: GET_INVITE_USER_TO_ORG,
            variables: {
              orgId: this.orgId,
              email: this.emailFormModel.email,
            },
            fetchPolicy: 'no-cache',
          })
          this.inviteUser = data && data.getInviteUserToOrg
          if (this.inviteUser) {
            this.inviteFormModel.givenName = this.inviteUser.givenName
            this.inviteFormModel.familyName = this.inviteUser.familyName
            this.inviteFormModel.role = ''
            this.inviteFormModel.locale = ''
          } else {
            setTimeout(() => {
              if (this.$refs.givenNameInput) {
                this.$refs.givenNameInput.focus()
              }
            }, 75)
          }
          this.invitationStep = 2
        }
      } catch (error) {
        if (error.message === 'GraphQL error: Error: User already exist in org.') {
          this.emailErrorMessage = this.$t('staff.userAlreadyExistInOrg')
        } else {
          this.$notify({
            color: 'error',
            text: error.message,
          })
          throw new Error(error)
        }
      } finally {
        this.emailFormLoading = false
      }
    },
    async submit (e) {
      e.preventDefault()
      try {
        if (this.$refs.inviteForm.validate(true)) {
          this.inviteFormLoading = true
          const input = {
            invitationEmail: this.emailFormModel.email,
            invitationGivenName: this.inviteFormModel.givenName,
            invitationFamilyName: this.inviteFormModel.familyName,
            invitationRole: this.inviteFormModel.role,
            invitationLocale: this.inviteFormModel.locale,
          }
          await this.$apollo.mutate({
            mutation: INVITE_USER_TO_ORG,
            variables: {
              orgId: this.orgId,
              input,
            },
          })
          this.dialog = false
          setTimeout(() => {
            this.reset()
          }, 250)
          this.$emit('update', true)
        }
      } catch (error) {
        if (error.message === 'GraphQL error: UsernameExistsException: An account with the given email already exists.') {
          this.inviteErrorMessage = this.$t('staff.userNotActive')
        } else {
          this.$notify({
            color: 'error',
            text: error.message,
          })
          throw new Error(error)
        }
      } finally {
        this.inviteFormLoading = false
      }
    },
  },
}
</script>
