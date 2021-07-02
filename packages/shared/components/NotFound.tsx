import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { Btn } from '@zennnn/core'

export default defineComponent({
  props: {
    text: String,
    actionText: String,
  },

  setup(props) {
    const { t } = useI18n()

    return () => (
      <div class="container flex-grow flex flex-col items-center">
        <div class="flex-1"></div>
        <div class="dark:text-white max-w-[330px] mx-auto text-center">
          <div class="flex justify-center space-x-3 mb-4">
            <svg
              width="41"
              height="41"
              viewBox="0 0 41 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.0864258 20.2112C0.0864258 9.16549 9.04073 0.211182 20.0864 0.211182C31.1321 0.211182 40.0864 9.16549 40.0864 20.2112C40.0864 31.2569 31.1321 40.2112 20.0864 40.2112C9.04073 40.2112 0.0864258 31.2569 0.0864258 20.2112ZM20.0864 3.17414C10.6771 3.17414 3.04939 10.8019 3.04939 20.2112C3.04939 29.6205 10.6771 37.2482 20.0864 37.2482C29.4957 37.2482 37.1235 29.6205 37.1235 20.2112C37.1235 10.8019 29.4957 3.17414 20.0864 3.17414Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M26.1852 29.0824C22.8169 25.7141 17.3559 25.7141 13.9876 29.0824C13.4506 29.6194 12.58 29.6194 12.0431 29.0824C11.5061 28.5454 11.5061 27.6748 12.0431 27.1378C16.4853 22.6956 23.6875 22.6956 28.1297 27.1378C28.6667 27.6748 28.6667 28.5454 28.1297 29.0824C27.5928 29.6194 26.7222 29.6194 26.1852 29.0824Z"
                fill="currentColor"
              />
              <path
                d="M26.9614 14.4396C25.5807 14.4396 24.4614 15.5589 24.4614 16.9396C24.4614 18.3203 25.5807 19.4396 26.9614 19.4396C28.3421 19.4396 29.4614 18.3203 29.4614 16.9396C29.4614 15.5589 28.3421 14.4396 26.9614 14.4396Z"
                fill="currentColor"
              />
              <path
                d="M13.2114 14.4396C11.8307 14.4396 10.7114 15.5589 10.7114 16.9396C10.7114 18.3203 11.8307 19.4396 13.2114 19.4396C14.5921 19.4396 15.7114 18.3203 15.7114 16.9396C15.7114 15.5589 14.5921 14.4396 13.2114 14.4396Z"
                fill="currentColor"
              />
            </svg>
            <div class="font-semibold text-5xl">404</div>
          </div>
          <div class="text-sm mb-8">
            {props.text ? props.text : <p v-html={t('notFound.text')}></p>}
          </div>
          <Btn small to="/">
            {props.actionText || t('notFound.toHome')}
          </Btn>
        </div>
        <div class="flex-2"></div>
      </div>
    )
  },
})
