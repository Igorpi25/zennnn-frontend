import { defineComponent, ref, computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ziPlusOutline, ziStatusPointSm } from '@zennnn/icons'
import { Icon, TextField, Autocomplete, Btn, Modal, Switch } from '@zennnn/core'
import {
  ClientType,
  SetSpecClient,
  SetSpecClientVariables,
  UpdateClient,
  UpdateClientVariables,
} from '@/graphql/types'
import { SEARCH_CLIENTS } from '@/graphql/queries'
import {
  CREATE_CLIENT,
  UPDATE_CLIENT,
  SET_SPEC_CLIENT,
} from '@/graphql/mutations'
import Phone from '@/components/Phone'
import ClientForm from '@/components/client/Form'

import type { PropType } from 'vue'
import type {
  GetSpec_getSpec_client,
  PersonInput,
  PhoneInput,
  SearchClients,
  SearchClientsVariables,
  CreateClientInput,
  CreateClient,
  CreateClientVariables,
  UpdateClientInput,
} from '@/graphql/types'
import type { EmptyString } from '@/types'

export default defineComponent({
  props: {
    orgId: {
      type: String,
      required: true,
    },
    specId: {
      type: String,
      required: true,
    },
    readonly: Boolean,
    item: {
      type: Object as PropType<GetSpec_getSpec_client | null>,
      default: () => ({}),
    },
    loading: Boolean,
  },

  setup(props) {
    const { t } = useI18n()

    const createDialog = ref(false)
    const createInput = ref<CreateClientInput>({
      clientType: ClientType.LEGAL,
    })
    const search = ref('')
    const rules = reactive({
      required: (v: any) => !!v || t('rule.required'),
      email: (v: EmptyString) => (v && /.+@.+\..+/.test(v)) || t('rule.email'),
    })

    const contactPerson = computed(() => props.item?.contactPerson)

    const importerContactPerson = computed(
      () => props.item?.importerContactPerson
    )

    watch(createDialog, (val) => {
      if (val) {
        createInput.value = {
          clientType: ClientType.LEGAL,
        }
      }
    })

    const { result: searchClientsResult } = useQuery<
      SearchClients,
      SearchClientsVariables
    >(
      SEARCH_CLIENTS,
      () => ({
        orgId: props.orgId,
        search: search.value,
      }),
      () => ({
        enabled: !!search.value,
        fetchPolicy: 'cache-and-network',
        debounce: 300,
      })
    )
    const searchClients = computed(
      () => searchClientsResult.value?.searchClients?.items || []
    )

    const { mutate: createClientMutate, loading: createClientLoading } =
      useMutation<CreateClient, CreateClientVariables>(CREATE_CLIENT)

    const { mutate: updateClientMutate } = useMutation<
      UpdateClient,
      UpdateClientVariables
    >(UPDATE_CLIENT)

    const { mutate: setSpecClientMutate } = useMutation<
      SetSpecClient,
      SetSpecClientVariables
    >(SET_SPEC_CLIENT)

    function updateData(input: UpdateClientInput) {
      if (props.item?.id) {
        updateClientMutate({
          id: props.item.id,
          input: input,
        })
      }
    }

    function updateContactPerson(personInput: PersonInput, importer = false) {
      const value = Object.assign(
        {
          firstName: contactPerson.value?.firstName,
          lastName: contactPerson.value?.lastName,
        },
        personInput
      )
      const input = importer
        ? { importerContactPerson: value }
        : { contactPerson: value }
      updateData(input)
    }

    function getClientType(type: ClientType) {
      switch (type) {
        case ClientType.LEGAL:
          return t('shipping.legalPerson')
        case ClientType.PRIVATE:
          return t('shipping.privatePerson')
        case ClientType.OTHER:
          return t('shipping.otherPerson')
      }
    }

    return () => (
      <>
        <h5 class="flex-grow text-lg leading-tight space-x-1 mb-3">
          <span class="text-white uppercase font-semibold tracking-widest">
            {t('shipping.clientTitle')}
          </span>
          <span class="text-gray-200 lowercase">
            {t('shipping.clientSubtitle')}
          </span>
        </h5>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <Autocomplete
                v-model={[search.value, 'search']}
                modelValue={props.item}
                label={t('clients.companyName')}
                placeholder={t('shipping.clientNotSetted')}
                items={searchClients.value}
                rules={[rules.required]}
                hideDetails={false}
                itemValue="id"
                itemText="fullName"
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: string) =>
                    setSpecClientMutate({
                      specId: props.specId,
                      clientId: val,
                    }),
                }}
                v-slots={{
                  'prepend-item': () => (
                    <Btn
                      link
                      {...{
                        onClick: () => {
                          createDialog.value = true
                        },
                      }}
                    >
                      <Icon class="mr-2">{ziPlusOutline}</Icon>
                      <span>{t('shipping.clientAddCreateAndAttach')}</span>
                    </Btn>
                  ),
                  item: ({ item }: any) =>
                    item.companyName ? (
                      <span class="text-white">
                        <span>{item.companyName}</span>
                        <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">
                          {getClientType(item.clientType)}
                        </span>
                      </span>
                    ) : (
                      <span class="flex items-center text-gray-200">
                        <span>{t('shipping.clientAddNoData')}</span>
                        <span class="text-gray-100 bg-gray-400 rounded-lg h-6 leading-6 inline-block ml-2 px-1">
                          {getClientType(item.clientType)}
                        </span>
                        <span class="text-white ml-2">{item.uid}</span>
                        <Icon class="text-pink-500">{ziStatusPointSm}</Icon>
                      </span>
                    ),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.legalAddress}
                label={t('companyDetail.label.legalAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ legalAddress: val }),
                }}
              />
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={contactPerson.value?.firstName}
                label={t('companyDetail.label.contactPerson')}
                placeholder={t('companyDetail.placeholder.firstName')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateContactPerson({ firstName: val }),
                }}
              />
              <TextField
                modelValue={contactPerson.value?.lastName}
                placeholder={t('companyDetail.placeholder.lastName')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateContactPerson({ lastName: val }),
                }}
              />
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="flex flex-wrap lg:flex-nowrap pb-2">
              <Phone
                modelValue={props.item?.phone}
                locale={props.item?.locale}
                label={t('companyDetail.label.phone')}
                loading={props.loading}
                readonly={props.readonly}
                stateIcon
                required
                class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ phone: val }),
                }}
              />
              <TextField
                modelValue={props.item?.phoneOption}
                label={t('companyDetail.label.phoneOption')}
                placeholder={t('companyDetail.placeholder.phoneOption')}
                loading={props.loading}
                readonly={props.readonly}
                debounce={500}
                rules={[rules.required]}
                stateIcon
                stateErrorColor="none"
                class="w-full sm:w-auto lg:w-full max-w-xs"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ phoneOption: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <Phone
                modelValue={props.item?.fax}
                locale={props.item?.locale}
                label={t('companyDetail.label.fax')}
                loading={props.loading}
                readonly={props.readonly}
                stateIcon
                stateErrorColor="none"
                required
                class="sm:w-4/6 max-w-xs sm:pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ fax: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.email}
                label={t('companyDetail.label.email')}
                placeholder={t('companyDetail.placeholder.email')}
                loading={props.loading}
                readonly={props.readonly}
                rules={[rules.required, rules.email]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ email: val }),
                }}
              />
            </div>
          </div>
        </div>

        <div class="my-10 border-t border-gray-400" />

        <Switch
          modelValue={!!props.item?.importerActive}
          disabled={!props.readonly}
          {...{
            onChange: (val: boolean) => updateData({ importerActive: val }),
          }}
          class="mb-3"
        >
          <h5 class="flex-grow text-lg leading-tight space-x-1 pt-1 ml-3">
            <span class="text-white uppercase font-semibold tracking-widest">
              {t('shipping.importerTitle')}
            </span>
            <span class="text-gray-200 lowercase">
              {t('shipping.importerSubtitle')}
            </span>
          </h5>
        </Switch>

        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/2 lg:pr-5">
            <div class="pb-2">
              <TextField
                modelValue={props.item?.importerCompanyName}
                label={t('companyDetail.label.consignee')}
                placeholder={t('companyDetail.placeholder.consignee')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                debounce={500}
                rules={[rules.required]}
                hideDetails={false}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ importerCompanyName: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.deliveryAddress}
                label={t('companyDetail.label.legalAddress')}
                placeholder={t('companyDetail.placeholder.address')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ deliveryAddress: val }),
                }}
              />
            </div>
            <div class="flex items-end pb-2">
              <TextField
                modelValue={importerContactPerson.value?.firstName}
                label={t('companyDetail.label.contactPerson')}
                placeholder={t('companyDetail.placeholder.firstName')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                class="w-1/2 md:w-56 flex-shrink-0 pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateContactPerson({ firstName: val }, true),
                }}
              />
              <TextField
                modelValue={importerContactPerson.value?.lastName}
                placeholder={t('companyDetail.placeholder.lastName')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                rules={[rules.required]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                class="flex-grow"
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateContactPerson({ lastName: val }, true),
                }}
              />
            </div>
          </div>
          <div class="w-full lg:w-1/2 lg:pl-5">
            <div class="flex flex-wrap lg:flex-nowrap pb-2">
              <Phone
                modelValue={props.item?.importerPhone}
                locale={props.item?.locale}
                label={t('companyDetail.label.phone')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                stateIcon
                required
                class="w-full sm:w-4/6 max-w-xs flex-shrink-0 pb-2 sm:pb-0 sm:pr-2.5"
                {...{
                  'onUpdate:modelValue': (val: PhoneInput) =>
                    updateData({ importerPhone: val }),
                }}
              />
            </div>
            <div class="pb-2">
              <TextField
                modelValue={props.item?.importerEmail}
                label={t('companyDetail.label.email')}
                placeholder={t('companyDetail.placeholder.email')}
                loading={props.loading}
                readonly={props.readonly}
                disabled={!props.item?.importerActive}
                rules={[rules.required, rules.email]}
                hideDetails={false}
                debounce={500}
                stateIcon
                required
                {...{
                  'onUpdate:modelValue': (val: EmptyString) =>
                    updateData({ importerEmail: val }),
                }}
              />
            </div>
          </div>
        </div>

        <Modal v-model={createDialog.value} maxWidth={1110}>
          <ClientForm
            orgId={props.orgId}
            create
            {...{
              onUpdate: (input: CreateClientInput) => {
                createInput.value = Object.assign({}, createInput.value, input)
              },
              'onUpdate:clientType': (val: ClientType) => {
                createInput.value.clientType = val
              },
            }}
            v-slots={{
              actions: () => (
                <Btn
                  loading={createClientLoading.value}
                  outlined
                  class="w-40"
                  {...{
                    onClick: async () => {
                      const response = await createClientMutate({
                        orgId: props.orgId,
                        input: createInput.value,
                      })
                      if (response?.data?.createClient) {
                        await setSpecClientMutate({
                          specId: props.specId,
                          clientId: response.data?.createClient.id,
                        })
                        createDialog.value = false
                      }
                    },
                  }}
                >
                  {t('client.save')}
                </Btn>
              ),
            }}
          />
        </Modal>
      </>
    )
  },
})
