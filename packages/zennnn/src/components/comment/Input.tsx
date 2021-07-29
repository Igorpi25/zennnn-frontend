import { defineComponent, ref, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Btn } from '@zennnn/core'
import { useRender } from 'shared/composables/render'

export default defineComponent({
  props: {
    modelValue: String,
    label: String,
    loading: Boolean,
    light: Boolean,
  },

  emits: ['update:modelValue', 'submit'],

  setup(props, { emit }) {
    const { t } = useI18n()

    const inputRef = ref()
    const comment = ref(props.modelValue)
    const isFocused = ref(false)

    watch(
      () => props.modelValue,
      (val) => {
        comment.value = val
      }
    )

    function clear() {
      comment.value = ''
      emit('update:modelValue', '')
      nextTick(calculateHeight)
    }

    function handleMeta(e: KeyboardEvent) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        submitComment()
      }
    }

    function calculateHeight() {
      inputRef.value.style.height = '0'

      const height = inputRef.value.scrollHeight
      const minHeight = 24

      inputRef.value.style.height = Math.max(minHeight, height) + 'px'
    }

    function onInput(e: Event) {
      const val = (e.target as HTMLInputElement).value
      comment.value = val
      emit('update:modelValue', val)
      nextTick(calculateHeight)
    }

    function onFocus() {
      isFocused.value = true
    }

    function onBlur() {
      if (!comment.value) {
        isFocused.value = false
      }
    }

    function blur() {
      clear()
      inputRef.value?.blur()
      isFocused.value = false
    }

    function submitComment() {
      if (!comment.value) return
      emit('submit', comment.value)
    }

    useRender(() => (
      <div>
        <textarea
          ref={inputRef}
          value={comment.value}
          disabled={props.loading}
          placeholder={props.label}
          class={[
            'px-0.5 placeholder-blue-500 resize-none',
            'w-full appearence-none bg-transparent focus:outline-none transition-colors duration-100 ease-out',
            'text-gray-900 focus:placeholder-gray-100 dark:text-white dark:focus:placeholder-gray-200',
          ]}
          rows="1"
          onInput={onInput}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeydown={handleMeta}
        />
        {isFocused.value && (
          <div class="flex pt-3">
            <div class="flex-grow" />
            <Btn
              outlined
              class="h-8 text-gray-900 border-gray-100 dark:text-white dark:border-gray-200 mr-2"
              contentClass="w-full flex items-center justify-center text-xs"
              minWidth="68"
              {...{
                onClick: blur,
              }}
            >
              {t('action.cancel')}
            </Btn>
            <Btn
              disabled={!comment.value}
              loading={props.loading}
              class={
                !comment.value
                  ? 'h-8 bg-gray-100 text-light-gray-400 dark:bg-gray-300'
                  : 'h-8'
              }
              contentClass="w-full flex items-center justify-center text-xs"
              minWidth="68"
              {...{
                onClick: submitComment,
              }}
            >
              {t('comments.post')}
            </Btn>
          </div>
        )}
      </div>
    ))

    return {
      blur,
      clear,
    }
  },
})
