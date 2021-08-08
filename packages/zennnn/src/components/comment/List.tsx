import { defineComponent, ref, computed, watch, Transition } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMutation } from '@vue/apollo-composable'
import { ziChat } from '@zennnn/icons'
import { Btn, Icon, Menu } from '@zennnn/core'
import { parseDate } from 'shared/utils/date'
import {
  ADD_COMMENT_TO_SPEC,
  ADD_COMMENT_TO_PRODUCT,
  ADD_COMMENT_TO_PAPER_SPEC,
  ADD_COMMENT_TO_PAPER_PRODUCT,
  MARK_SPEC_COMMENTS_AS_VIEWED,
  MARK_PRODUCT_COMMENTS_AS_VIEWED,
  MARK_PAPER_SPEC_COMMENTS_AS_VIEWED,
  MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED,
} from '@/graphql/mutations'

import CommentItem from './Item'
import CommentInput from './Input'

import type {
  AddCommentToPaperProduct,
  AddCommentToPaperProductVariables,
  AddCommentToPaperSpec,
  AddCommentToPaperSpecVariables,
  AddCommentToProduct,
  AddCommentToProductVariables,
  AddCommentToSpec,
  AddCommentToSpecVariables,
  MarkPaperProductCommentsAsViewed,
  MarkPaperProductCommentsAsViewedVariables,
  MarkPaperSpecCommentsAsViewed,
  MarkPaperSpecCommentsAsViewedVariables,
  MarkProductCommentsAsViewed,
  MarkProductCommentsAsViewedVariables,
  MarkSpecCommentsAsViewed,
  MarkSpecCommentsAsViewedVariables,
} from '@/graphql/types'

export default defineComponent({
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isPreview: Boolean,
    isProduct: Boolean,
    specId: {
      type: String,
      required: true,
    },
    productId: String,
    placement: {
      type: String,
      default: 'right-start',
    },
    sm: Boolean,
  },

  setup(props, { slots, attrs }) {
    const { t } = useI18n()

    const commentInputRef = ref()
    const isMenuActive = ref(false)
    const addCommentLoading = ref(false)
    const comment = ref('')

    const { mutate: addCommentToSpecMutate } = useMutation<
      AddCommentToSpec,
      AddCommentToSpecVariables
    >(ADD_COMMENT_TO_SPEC, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: addCommentToProductMutate } = useMutation<
      AddCommentToProduct,
      AddCommentToProductVariables
    >(ADD_COMMENT_TO_PRODUCT, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: addCommentToPaperSpecMutate } = useMutation<
      AddCommentToPaperSpec,
      AddCommentToPaperSpecVariables
    >(ADD_COMMENT_TO_PAPER_SPEC, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: addCommentToPaperProductMutate } = useMutation<
      AddCommentToPaperProduct,
      AddCommentToPaperProductVariables
    >(ADD_COMMENT_TO_PAPER_PRODUCT, {
      fetchPolicy: 'no-cache',
    })

    const { mutate: markSpecCommentsAsViewedMutate } = useMutation<
      MarkSpecCommentsAsViewed,
      MarkSpecCommentsAsViewedVariables
    >(MARK_SPEC_COMMENTS_AS_VIEWED)

    const { mutate: markProductCommentsAsViewedMutate } = useMutation<
      MarkProductCommentsAsViewed,
      MarkProductCommentsAsViewedVariables
    >(MARK_PRODUCT_COMMENTS_AS_VIEWED)

    const { mutate: markPaperSpecCommentsAsViewedMutate } = useMutation<
      MarkPaperSpecCommentsAsViewed,
      MarkPaperSpecCommentsAsViewedVariables
    >(MARK_PAPER_SPEC_COMMENTS_AS_VIEWED)

    const { mutate: markPaperProductCommentsAsViewedMutate } = useMutation<
      MarkPaperProductCommentsAsViewed,
      MarkPaperProductCommentsAsViewedVariables
    >(MARK_PAPER_PRODUCT_COMMENTS_AS_VIEWED)

    const badgeStyles = computed(() => {
      let height = 16
      let width = 18
      if (props.sm) {
        height = 6
        width = 6
      } else if (newCommentsCount.value > 99) {
        width = 26
      }
      const styles = {
        height: `${height}px`,
        top: `-${height / 2}px`,
        width: `${width}px`,
        right: `-${width / 2}px`,
      }
      return styles
    })

    const newCommentsCount = computed(() => {
      let count = 0
      props.items.forEach((item: any) => {
        if (props.isPreview) {
          if (!item.clientViewed) {
            count++
          }
        } else {
          if (!item.viewed) {
            count++
          }
        }
      })
      return count
    })

    const discussions = computed(() => {
      const items = props.items || []
      const discussions = items.filter((d: any) => !d.replyTo)
      return discussions
        .map((item: any) => {
          const comments = items.filter((c: any) => c.replyTo === item.id)
          return {
            ...item,
            comments,
          }
        })
        .sort((a, b) => {
          const aDate = parseDate(a.updatedAt)
          const bDate = parseDate(b.updatedAt)
          return aDate > bDate ? 1 : aDate < bDate ? -1 : 0
        })
    })

    watch(isMenuActive, (val) => {
      if (val) {
        setTimeout(() => {
          updateViewedComments()
        }, 250)
      }
    })

    watch(
      () => props.items,
      (val, oldVal) => {
        const valLength = (val && val.length) || 0
        const oldValLength = (oldVal && oldVal.length) || 0
        if (isMenuActive.value && valLength > oldValLength) {
          const newIds = [] as string[]
          val.forEach((el: any) => {
            if (props.isPreview) {
              if (!el.clientViewed) {
                newIds.push(el.id)
              }
            } else {
              if (!el.viewed) {
                newIds.push(el.id)
              }
            }
          })
          updateViewedComments(newIds)
        }
      }
    )

    async function updateViewedComments(commentsIds?: string[]) {
      try {
        const _commentsIds = commentsIds ? commentsIds : null
        if (props.isPreview) {
          if (props.isProduct) {
            await markPaperProductCommentsAsViewedMutate({
              productId: props.productId as string,
              commentsIds: _commentsIds,
            })
          } else {
            await markPaperSpecCommentsAsViewedMutate({
              specId: props.specId,
              commentsIds: _commentsIds,
            })
          }
        } else {
          if (props.isProduct) {
            await markProductCommentsAsViewedMutate({
              productId: props.productId as string,
              commentsIds: _commentsIds,
            })
          } else {
            await markSpecCommentsAsViewedMutate({
              specId: props.specId,
              commentsIds: _commentsIds,
            })
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    }

    async function addComment() {
      try {
        if (!comment.value) return
        addCommentLoading.value = true
        if (props.isProduct) {
          if (props.isPreview) {
            await addCommentToPaperProductMutate({
              productId: props.productId as string,
              comment: comment.value,
            })
          } else {
            await addCommentToProductMutate({
              productId: props.productId as string,
              comment: comment.value,
            })
          }
        } else {
          if (props.isProduct) {
            await addCommentToPaperSpecMutate({
              specId: props.specId,
              comment: comment.value,
            })
          } else {
            await addCommentToSpecMutate({
              specId: props.specId,
              comment: comment.value,
            })
          }
        }
        commentInputRef.value?.blur()
      } catch (error) {
        throw new Error(error)
      } finally {
        addCommentLoading.value = false
      }
    }

    {
      /* <!-- TODO: scroll to new on open --> */
    }
    return () => (
      <Menu
        v-model={isMenuActive.value}
        closeOnContentClick={false}
        placement={props.placement as any}
        minWidth={320}
        maxWidth={320}
        maxHeight="75vh"
        v-slots={{
          activator: () =>
            slots.activator ? (
              slots.activator({ count: newCommentsCount })
            ) : (
              <Btn icon mini text class={['relative', attrs.class]}>
                <Transition name="scale-transition">
                  {newCommentsCount.value > 0 && (
                    <div
                      style={badgeStyles.value}
                      class="absolute rounded-full flex justify-center items-center text-xs text-white bg-purple-500"
                    >
                      {!props.sm && (
                        <span>
                          {newCommentsCount.value > 99
                            ? '99+'
                            : newCommentsCount.value}
                        </span>
                      )}
                    </div>
                  )}
                </Transition>
                <Icon>{ziChat}</Icon>
              </Btn>
            ),
        }}
      >
        <div class="px-5 py-5 bg-white dark:bg-gray-400">
          {discussions.value.map((item) => (
            <div>
              <CommentItem
                item={item}
                isPreview={props.isPreview}
                isProduct={props.isProduct}
                specId={props.specId}
                productId={props.productId}
              />
            </div>
          ))}
          <div>
            <CommentInput
              ref={commentInputRef}
              v-model={comment.value}
              loading={addCommentLoading.value}
              label={t('comments.enterComment')}
              {...{
                onSubmit: addComment,
              }}
            />
          </div>
        </div>
      </Menu>
    )
  },
})
