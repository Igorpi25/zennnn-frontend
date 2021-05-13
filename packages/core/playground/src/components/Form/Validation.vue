<template>
  <Form
    ref="formRef"
    v-model:valid="validity"
    lazy-validation
    class="max-w-sm"
    @submit="onSubmit"
  >
    <TextField
      v-model="formModel.login"
      placeholder="Login"
      :rules="[rules.required]"
      :hide-details="false"
      class="pb-6"
    />
    <TextField
      v-model="formModel.password"
      placeholder="Password"
      :type="showPassword ? 'text' : 'password'"
      :rules="[rules.required, rules.passwordMinLength]"
      :hide-details="false"
      class="pb-6"
      minlength="8"
    >
      <template v-slot:append>
        <Icon
          tag="image"
          class="text-gray-500 hover:text-gray-300 pr-1"
          role="image"
          @click.prevent="showPassword = !showPassword"
        >
          {{ showPassword ? ziVisible : ziHide }}
        </Icon>
      </template>
    </TextField>
    <div class="flex flex-col space-y-4">
      <Btn
        :disabled="!validity"
        :loading="loading"
        class="sm:w-48"
      >
        Submit
      </Btn>
      <Btn
        outlined
        class="sm:w-48"
        @click.prevent="onReset"
      >
        Reset
      </Btn>
      <Btn
        outlined
        class="sm:w-48"
        @click.prevent="onResetValidation"
      >
        Reset validation
      </Btn>
    </div>
  </Form>
</template>

<script setup>
import { ziVisible, ziHide } from '@zennnn/icons'
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { wait } from 'vue-supp'

const { t } = useI18n()

const formRef = ref()
const loading = ref(false)
const validity = ref(false)
const showPassword = ref(false)

const formModel = reactive({
  login: '',
  password: '',
})

const rules = {
  required: v => !!v || t('rule.required'),
  passwordMinLength: v => (v && v.length > 7) || t('rule.minLength', { n: 8 }),
}

async function onSubmit (e) {
  try {
    e.preventDefault()
    loading.value = true
    if (formRef.value.validate()) {
      await wait(300)
    }
  } catch (error) {
    throw new Error(error)
  } finally {
    loading.value = false
  }
}

function onReset (e) {
  e.preventDefault()
  formRef.value.reset()
}

function onResetValidation (e) {
  e.preventDefault()
  formRef.value.resetValidation()
}
</script>
