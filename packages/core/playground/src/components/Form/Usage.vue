<template>
  <Form
    ref="formRef"
    v-model:valid="validity"
    class="max-w-sm"
    @submit="onSubmit"
  >
    <TextField
      v-model="formModel.firstName"
      placeholder="First name"
      :rules="[rules.required]"
      :hide-details="false"
      class="pb-6"
    />
    <TextField
      v-model="formModel.lastName"
      placeholder="Last name"
      :rules="[rules.required]"
      :hide-details="false"
      class="pb-6"
    />
    <Btn
      :disabled="!validity"
      :loading="loading"
      class="w-full sm:w-48"
    >
      Submit
    </Btn>
  </Form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { wait } from 'vue-supp'

const { t } = useI18n()

const formRef = ref()
const loading = ref(false)
const validity = ref(false)

const formModel = reactive({
  firstName: '',
  lastName: '',
})

const rules = {
  required: v => !!v || t('rule.required'),
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
</script>
