import { defineComponent, nextTick, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { Btn, Form, TextField } from '@zennnn/core'
import { useRender } from 'shared/composables/render'
import { PREMIUM_CONTACT } from '@/graphql/mutations'
import type { PremiumContact, PremiumContactVariables } from '@/graphql/types'

export default defineComponent({
  props: {
    hasCancel: Boolean,
  },

  emits: ['success', 'cancel'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const formRef = ref()
    const nameInputRef = ref()
    const formModel = reactive({
      name: '',
      email: '',
    })
    const validity = ref(false)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: string) => /.+@.+\..+/.test(v) || t('rule.email'),
    })

    const { loading, mutate, onDone } = useMutation<
      PremiumContact,
      PremiumContactVariables
    >(PREMIUM_CONTACT, {
      variables: {
        name: formModel.name,
        email: formModel.email,
      },
      fetchPolicy: 'no-cache',
    })

    onDone(() => {
      emit('success')
      nextTick(reset)
    })

    function focus() {
      nameInputRef.value && nameInputRef.value.focus()
    }

    function reset() {
      formRef.value && formRef.value.reset()
    }

    function onCancel() {
      emit('cancel')
      nextTick(reset)
    }

    function onSubmit() {
      if (!formRef.value.validate()) return
      mutate()
    }

    useRender(() => (
      <Form
        ref={formRef}
        v-model={[validity.value, 'valid']}
        {...{ onSubmit: onSubmit }}
      >
        <TextField
          ref={nameInputRef}
          v-model={formModel.name}
          label={t('pricing.nameLabel')}
          placeholder={t('pricing.namePlaceholder')}
          rules={[rules.required]}
          hideDetails={false}
          type="text"
          name="name"
          autocomplete="name"
          aria-label="name input"
          class="pb-4"
          controlClass="bg-light-gray-300"
          inputClass="placeholder-gray-200"
        />
        <TextField
          v-model={formModel.email}
          label={t('pricing.emailLabel')}
          rules={[rules.required, rules.email]}
          hideDetails={false}
          placeholder="example@mail.com"
          type="email"
          name="email"
          autocomplete="email"
          aria-label="email input"
          class="pb-6"
          controlClass="bg-light-gray-300"
          inputClass="placeholder-gray-200"
        />
        <div class="grid grid-cols-2 gap-x-6 pt-8">
          {props.hasCancel && (
            <Btn
              outlined
              minWidth="none"
              class="justify-self-start"
              onClick={onCancel}
            >
              {t('pricing.cancel')}
            </Btn>
          )}
          <Btn
            loading={loading.value}
            disabled={!validity.value}
            class="justify-self-end"
            onClick={onSubmit}
          >
            {t('pricing.send')}
          </Btn>
        </div>
      </Form>
    ))

    return {
      focus,
      reset,
    }
  },
})
