import { computed, defineComponent, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApolloClient } from '@vue/apollo-composable'
import { ziUser, ziLanguages, ziGlobe } from '@zennnn/icons'
import { Btn, Progress, Icon, Form, TextField } from '@zennnn/core'
import { TRANSLATE_WORD } from '@/graphql/queries'
import { LOCALES_LIST } from 'shared/config'
import { useRender } from 'shared/composables/render'
import { logger } from '@/plugins'

import type { PropType } from 'vue'
import type { Locale } from 'shared/components/LocalePicker'
import type {
  TranslateWord,
  TranslateWordVariables,
  WordTranslationInput,
  ListWords_listWords_items,
  GetSpec_getSpec_invoices_products_name,
} from '@/graphql/types'

export interface WordFormSubmitInput {
  id: string
  defaultLocale: string
  values: WordTranslationInput[]
}

export default defineComponent({
  props: {
    orgId: {
      type: String,
      required: true,
    },
    create: Boolean,
    initValue: String,
    item: {
      type: Object as PropType<
        ListWords_listWords_items | GetSpec_getSpec_invoices_products_name
      >,
      default: () => ({}),
    },
    actionText: String,
    submitResult: Boolean,
    loading: Boolean,
  },

  emits: ['submit', 'cancel'],

  setup(props, { emit }) {
    const { t, locale } = useI18n()
    const { resolveClient } = useApolloClient()
    const apolloClient = resolveClient()

    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })
    const formRef = ref()
    const formModel = ref<Record<string, string | null | undefined>>({})
    const inputRefs = ref<Record<string, any>>({})
    const translations = ref<Record<string, string | null | undefined>>({})

    const localesList = LOCALES_LIST as Locale[]

    const defaultLocale = ref(locale.value)
    const translateWordLoading = ref(false)

    const locales = computed(() => {
      const items = localesList.map((el) => ({
        text: el.text,
        value: el.value,
        icon: el.icon,
      }))
      const index = items.findIndex((el) => el.value === defaultLocale.value)
      // move default locale input to start
      if (index > 0) {
        items.splice(0, 0, items.splice(index, 1)[0])
      }
      return items
    })

    const googleTranslateIconMap = computed(() => {
      const result = {} as Record<string, boolean>
      LOCALES_LIST.forEach((el) => {
        const key = el.value
        result[key] = Boolean(
          translations.value[key] &&
            translations.value[key] === formModel.value[key]
        )
      })
      return result
    })

    watch(defaultLocale, () => {
      nextTick(() => {
        formRef.value && formRef.value.validate()
      })
    })

    function onSubmit() {
      if (!formRef.value.validate(true)) return

      emit('submit', {
        id: props.item.id,
        defaultLocale: props.create ? defaultLocale.value : undefined,
        values: getValues(),
      })
    }

    function onInput(key: string, value: string) {
      formModel.value[key] = value
    }

    function onBlur(key: string) {
      if (!formModel.value[key] && translations.value[key]) {
        formModel.value[key] = translations.value[key]
      }
    }

    function getValues() {
      const result = [] as WordTranslationInput[]
      LOCALES_LIST.forEach((el) => {
        const k = el.value
        const tr = translations.value[k]
        const v =
          formModel.value[k] && formModel.value[k] === tr
            ? null
            : formModel.value[k] || null
        const r = {
          k,
          v,
        } as WordTranslationInput
        if (tr) {
          r.tr = tr
        }
        if (k && (v || tr)) {
          result.push(r)
        }
      })
      return result
    }

    async function translateWord() {
      if (!formRef.value.validate(true)) return

      const text = formModel.value[defaultLocale.value]
      if (!text) return
      try {
        translateWordLoading.value = true
        const response = await apolloClient.query<
          TranslateWord,
          TranslateWordVariables
        >({
          query: TRANSLATE_WORD,
          variables: {
            orgId: props.orgId,
            text,
            sourceLang: defaultLocale.value,
          },
        })
        const result =
          (response && response.data && response.data.translateWord) || []

        logger.info('Translate result', result)

        result.forEach((item: WordTranslationInput) => {
          const key = item.k
          if (
            !formModel.value[key] ||
            formModel.value[key] === translations.value[key]
          ) {
            formModel.value[key] = item.tr
          }
          translations.value[key] = item.tr
        })
      } catch (error) {
        throw new Error(error)
      } finally {
        translateWordLoading.value = false
      }
    }

    function setValues(item: ListWords_listWords_items) {
      defaultLocale.value = item.defaultLocale || locale.value
      const values = item.values || []
      const valuesMap = {} as Record<string, string | null | undefined>
      const trMap = {} as Record<string, string | null | undefined>
      LOCALES_LIST.forEach((el) => {
        const v = values.find((val) => val.k === el.value)
        if (v) {
          valuesMap[el.value] = v.v || v.tr
          trMap[el.value] = v.tr
        }
      })
      formModel.value = valuesMap
      translations.value = trMap
    }

    function focus() {
      const _locale = (props.item && props.item.defaultLocale) || locale.value
      nextTick(() => {
        if (inputRefs.value && inputRefs.value[_locale]) {
          ;(inputRefs.value[_locale] as any).focus()
        }
      })
    }

    function reset() {
      formRef.value && formRef.value.reset()
      formModel.value = {}
      translations.value = {}
    }

    useRender(() => (
      <>
        <Form
          ref={formRef}
          class="grid grid-rows-1 sm:grid-cols-2 sm:grid-rows-3 sm:grid-flow-col gap-x-8 gap-y-4"
        >
          {locales.value.map((item) => (
            <TextField
              ref={(el: any) => {
                if (el) inputRefs.value[item.value] = el
              }}
              key={item.value}
              modelValue={formModel.value[item.value]}
              placeholder={item.text}
              rules={
                item.value === defaultLocale.value
                  ? [rules.required]
                  : undefined
              }
              hideDetails={item.value !== defaultLocale.value}
              stateIcon={item.value === defaultLocale.value}
              required={item.value === defaultLocale.value}
              {...{
                onBlur: () => onBlur(item.value),
                'onUpdate:modelValue': (v: string) => onInput(item.value, v),
              }}
              controlClass="bg-light-gray-300 px-2"
              inputClass="placeholder-gray-200"
              v-slots={{
                prepend: () => (
                  <img
                    src={
                      require(`@zennnn/icons/flags/${item.icon}.svg`).default
                    }
                    class="h-6 w-6 rounded-full mr-1"
                  />
                ),
                append: () =>
                  item.value !== defaultLocale.value &&
                  googleTranslateIconMap.value[item.value] ? (
                    <Icon base={false}>{ziLanguages}</Icon>
                  ) : formModel.value[item.value] ? (
                    <Icon base={false} class="text-blue-500">
                      {ziUser}
                    </Icon>
                  ) : undefined,
              }}
            />
          ))}
        </Form>
        <div class="flex justify-end pt-4">
          <Btn
            text
            {...{ onClick: translateWord }}
            class="place-self-end h-10 px-4"
          >
            {translateWordLoading.value ? (
              <Progress indeterminate size="24" width="2" class="mr-2" />
            ) : (
              <Icon left>{ziGlobe}</Icon>
            )}
            <span>{t('words.translate')}</span>
          </Btn>
        </div>
        <div class="flex justify-between pt-8">
          <Btn
            disabled={props.loading}
            outlined
            minWidth={96}
            {...{
              onClick: () => {
                emit('cancel', true)
              },
            }}
          >
            <span>{t('action.cancel')}</span>
          </Btn>
          <Btn loading={props.loading} {...{ onClick: onSubmit }}>
            {props.actionText}
          </Btn>
        </div>
      </>
    ))

    return {
      setValues,
      focus,
      reset,
    }
  },
})
