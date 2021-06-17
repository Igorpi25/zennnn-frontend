import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Modal } from '@zennnn/core'
import LoginForm from '@/components/LoginForm'
import CompleteForm from '@/components/CompleteForm'

export default defineComponent({
  setup() {
    const { t } = useI18n()

    const cognitoUser = ref<any>()

    const compliteFormDialog = ref(false)

    return () => (
      <>
        <div class="dark:bg-gray-800 w-full flex-grow flex flex-col items-center">
          <div class="flex-1"></div>
          <div class="container flex-grow">
            <div class="flex flex-col justify-center w-full max-w-sm mx-auto">
              <h1 class="pb-10 font-semibold text-2xl">
                {t('signin.formTitle')} - ADMIN
              </h1>
              <LoginForm
                {...{
                  onComplete: (value: any) => {
                    if (value) {
                      cognitoUser.value = value
                      compliteFormDialog.value = true
                    }
                  },
                }}
              />
            </div>
          </div>
          <div class="flex-2"></div>
        </div>
        <Modal v-model={compliteFormDialog.value}>
          <CompleteForm cognitoUser={cognitoUser.value} />
        </Modal>
      </>
    )
  },
})
