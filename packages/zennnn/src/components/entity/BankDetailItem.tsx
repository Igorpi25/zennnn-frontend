import { defineComponent, ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Switch, TextField } from '@zennnn/core'

import type { PropType } from 'vue'
import type {
  GetOrgRequisite_getOrgRequisite_bankDetails,
  BankDetailInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    loading: Boolean,
    item: {
      type: Object as PropType<GetOrgRequisite_getOrgRequisite_bankDetails>,
      default: () => ({}),
    },
    mainBankDetail: Boolean,
  },

  slots: ['append'],

  emits: ['update', 'setMainBankDetail'],

  setup(props, { emit, slots }) {
    const { t } = useI18n()

    const isMainBankDetail = ref(props.mainBankDetail)
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
    })

    watch(
      () => props.mainBankDetail,
      (val) => {
        isMainBankDetail.value = val
      }
    )

    function updateData(input: { [k in keyof BankDetailInput]: EmptyString }) {
      emit('update', input)
    }

    return () => (
      <div class="flex flex-col lg:flex-row">
        <div class="lg:w-1/2 lg:pr-5">
          <div class="pb-2 lg:pb-1">
            <div class="flex flex-col">
              <label class="label label__content justify-between">
                <span class="truncate">
                  {t('companyDetail.label.bankName')}
                </span>
                <span class="flex-shrink-0">
                  {t('companyDetail.label.main')}
                </span>
              </label>
              <div class="flex justify-between">
                <TextField
                  modelValue={props.item.bankName}
                  placeholder={t('companyDetail.placeholder.bankName')}
                  loading={props.loading}
                  debounce={500}
                  rules={[rules.required]}
                  stateIcon
                  required
                  class="flex-grow pb-2"
                  onInput={(val: EmptyString) => updateData({ bankName: val })}
                />
                <Switch
                  v-model={isMainBankDetail.value}
                  class="flex-shrink-0 ml-2.5"
                  controlClass="h-10"
                  {...{
                    onChange: () => emit('setMainBankDetail', props.item.id),
                  }}
                />
              </div>
            </div>
            <div class="relative lg:pb-20">
              <div class="lg:absolute text-sm text-gray-200 leading-tight pl-2">
                {t('companyDetail.rule.mainBankName')}
              </div>
            </div>
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.bankAddress}
              label={t('companyDetail.label.bankAddress')}
              placeholder={t('companyDetail.placeholder.bankAddress')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              onInput={(val: EmptyString) => updateData({ bankAddress: val })}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.bankAccountNumber}
              label={t('companyDetail.label.bankAccountNumber')}
              placeholder={t('companyDetail.placeholder.bankAccountNumber')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              required
              onInput={(val: EmptyString) =>
                updateData({ bankAccountNumber: val })
              }
            />
          </div>
        </div>
        <div class="lg:w-1/2 lg:pl-5">
          <div class="flex items-end pb-2">
            <TextField
              modelValue={props.item.swift}
              label={t('companyDetail.label.swift')}
              placeholder={t('companyDetail.placeholder.swift')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              required
              class="w-1/2 md:w-48 flex-shrink-0 pr-2.5"
              onInput={(val: EmptyString) => updateData({ swift: val })}
            />
            <TextField
              modelValue={props.item.bic}
              label={t('companyDetail.label.bic')}
              placeholder={t('companyDetail.placeholder.bic')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              class="flex-grow"
              onInput={(val: EmptyString) => updateData({ bic: val })}
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.correspondentBankName}
              label={t('companyDetail.label.correspondentBankName')}
              placeholder={t('companyDetail.placeholder.correspondentBankName')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              onInput={(val: EmptyString) =>
                updateData({ correspondentBankName: val })
              }
            />
          </div>
          <div class="pb-2">
            <TextField
              modelValue={props.item.correspondentAccountNumber}
              label={t('companyDetail.label.correspondentAccountNumber')}
              placeholder={t('companyDetail.placeholder.bankAccountNumber')}
              loading={props.loading}
              debounce={500}
              rules={[rules.required]}
              stateIcon
              stateErrorColor="none"
              onInput={(val: EmptyString) =>
                updateData({ correspondentAccountNumber: val })
              }
            />
          </div>
          {slots.append?.()}
        </div>
      </div>
    )
  },
})
