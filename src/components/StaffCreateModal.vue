<template>
  <v-dialog
    v-model="dialog"
    :adaptive="true"
    :max-width="460"
  >
    <div class="relative bg-accent1">
      <div class="modal__title">
        <Icon size="30" class="mr-2">
          {{ icons.ziUserPlus }}
        </Icon>
        <span>{{ $t('staff.addStaff') }}</span>
      </div>
      <div class="modal__form">
        <Form
          ref="form"
          lazy-validation
          rounded
          shadow
          class="form--max-w-sm mx-auto m-0"
          body-class="pt-8 md:pt-12 pb-10 px-0"
        >
          <div class="w-full">
            <TextField
              v-model="formModel.invitationGivenName"
              :label="$t('staff.firstName')"
              :rules="[rules.required]"
              name="firstName"
              autofocus
              state-icon
            />
          </div>
          <div class="w-full">
            <TextField
              v-model="formModel.invitationFamilyName"
              :label="$t('staff.lastName')"
              :rules="[rules.required]"
              name="lastName"
              state-icon
            />
          </div>
          <div class="w-full">
            <TextField
              ref="email"
              v-model="formModel.invitationEmail"
              :label="$t('staff.login')"
              :rules="[rules.required, rules.email]"
              type="email"
              name="email"
              state-icon
            />
          </div>
          <div class="w-full">
            <Select
              v-model="compRole"
              :label="$t('staff.access')"
              :items="roles"
              flat
              return-object
              colored
              hide-details
              class="text-sm mr-2 md:p-0 leading-normal max-w-sm"
            >
              <template v-slot:append="{ menu }">
                <Icon v-if="menu">{{ icons.mdiChevronUp }}</Icon>
                <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
              </template>
            </Select>
          </div>
          <Button
            :disabled="loading"
            large
            class="mt-10 mx-auto"
            @click="submit"
          >
            <span>{{ $t('staff.invite') }}</span>
          </Button>
        </Form>
      </div>
      <span class="close-btn" @click="dialog = false">
        <Icon>{{ icons.mdiClose }}</Icon>
      </span>
    </div>
  </v-dialog>
</template>

<script>
import { mdiChevronUp, mdiChevronDown, mdiClose } from '@mdi/js'
import { ziUserPlus } from '../assets/icons'
import { Role } from '../graphql/enums'
import { INVITE_USER_TO_ORG } from '../graphql/mutations'

export default {
  name: 'StaffCreateModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      dialog: false,
      loading: false,
      formModel: {
        invitationGivenName: '',
        invitationFamilyName: '',
        invitationEmail: '',
        invitationRole: Role.MANAGER,
      },
      roleMenu: false,
      icons: {
        ziUserPlus,
        mdiChevronUp,
        mdiChevronDown,
        mdiClose,
      },
      rules: {
        required: v => !!v || this.$t('rule.required'),
        email: v => /.+@.+\..+/.test(v) || this.$t('rule.email'),
      },
    }
  },
  computed: {
    orgId () {
      return this.$route.params.orgId
    },
    compRole: {
      get () {
        return {
          value: this.formModel.invitationRole,
          text: this.$t(`role.${this.formModel.invitationRole}`),
        }
      },
      set (val) {
        this.formModel.invitationRole = val.value
      },
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
    },
  },
  methods: {
    async submit (e) {
      e.preventDefault()
      try {
        this.loading = true
        if (this.$refs.form.validate()) {
          await this.$apollo.mutate({
            mutation: INVITE_USER_TO_ORG,
            variables: {
              orgId: this.orgId,
              input: this.formModel,
            },
            fetchPolicy: 'no-cache',
          })
          this.dialog = false
          this.$emit('update', true)
        }
      } catch (error) {
        throw new Error(error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal__title {
    padding: 25px;
    display: flex;
    align-items: center;
    color: #aaaaaa;
    @apply bg-gray-darker;
  }
  .modal__form {
    padding: 0 60px;
    color: #CDCDCD;
  }
  .close-btn {
    position: absolute;
    top: 5px;
    right: 15px;
    color: #fff;
    cursor: pointer;
  }
</style>
