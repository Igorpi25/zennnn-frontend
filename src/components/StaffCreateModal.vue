<template>
  <div class="modal">
    <div class="modal__title">
      <Icon size="30" class="mr-2">
        {{ icons.ziUserPlus }}
      </Icon>
      <span>{{ $t('staff.addStaff') }}</span>
    </div>
    <div class="modal__form">
      <Form
        ref="form"
        rounded
        shadow
        class="form--max-w-sm mx-auto m-0"
        body-class="pt-8 md:pt-12 pb-10 px-0"
      >
        <div class="w-full">
          <TextField
            v-model="formModel.firstName"
            :label="$t('staff.firstName')"
            name="firstName"
            required
            autofocus
            state-icon
          />
        </div>
        <div class="w-full">
          <TextField
            v-model="formModel.lastName"
            :label="$t('staff.lastName')"
            name="lastName"
            required
            state-icon
          />
        </div>
        <div class="w-full">
          <TextField
            v-model="formModel.mobilePhone"
            :label="$t('staff.mobilePhone')"
            name="lastName"
            required
            state-icon
          />
        </div>
        <div class="w-full">
          <TextField
            ref="email"
            v-model="formModel.email"
            :label="$t('staff.login')"
            type="email"
            name="email"
            required
            state-icon
          />
        </div>
        <div class="w-full">
          <TextField
            v-model="formModel.password"
            :label="$t('staff.password')"
            name="password"
            required
            minlength="8"
            state-icon
          >
          </TextField>
        </div>
        <v-menu
          v-model="accessMenu"
          bottom
          left
          offset-y
        >
          <template v-slot:activator="{ on }">
            <div class="access w-full text-gray-lighter" v-on="on">
              <span class="block text-xs mt-5 mb-1">{{ $t('staff.access') }}</span>
              <span class="flex items-center text-primary cursor-pointer">
                {{ currentAccess }}
                <Icon v-if="!accessMenu">{{ icons.mdiChevronUp }}</Icon>
                <Icon v-else>{{ icons.mdiChevronDown }}</Icon>
              </span>
            </div>
          </template>
          <template>
            <ul
              class="lang-picker min-w-0"
              role="menu"
            >
              <li
                v-for="acc in formModel.access"
                :key="acc.text"
                :value="acc.text"
                :class="[
                  'lang-picker__item',
                  { 'lang-picker__item--selected': acc.text === currentAccess }
                ]"
                tabindex="0"
                role="menuitem"
                @click="changeAccess(acc.text)"
              >
                <span>{{ acc.text }}</span>
              </li>
            </ul>
          </template>
        </v-menu>
        <Button
          large
          class="mt-10 mx-auto"
        >
          <span>{{ $t('action.save') }}</span>
        </Button>
      </Form>
    </div>
    <span class="close-btn" @click="$emit('close')">
      &times;
    </span>
  </div>
</template>

<script>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { ziUserPlus } from '@/assets/icons'

export default {
  name: 'StaffCreateModal',
  data () {
    return {
      formModel: {
        firstName: '',
        lastName: '',
        mobilePhone: '',
        email: '',
        password: '',
        access: [
          { text: this.$t('access.freelancer') },
          { text: this.$t('access.manager') },
          { text: this.$t('access.accountant') },
          { text: this.$t('access.ceo') },
        ],
      },
      currentAccess: this.$t('access.freelancer'),
      accessMenu: false,
      icons: {
        ziUserPlus,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  methods: {
    changeAccess (acc) {
      localStorage.setItem('staff-access', acc)
      this.currentAccess = acc
      this.accessMenu = false
    },
  },
}
</script>

<style scoped lang="postcss">
  .modal {
    position: relative;
    @apply bg-accent1;
  }
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
  .access {
    margin: 0;
  }
</style>
