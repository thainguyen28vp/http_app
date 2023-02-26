import { castDraft } from 'immer'
import { useCallback, useEffect } from 'react'
import { useImmer } from 'use-immer'

export interface CommentOptions {
  maxDisplayComment: number
  maxBatchCount: number
  batchUpdateInterval: number
}

const DefaultCommentOptions: CommentOptions = {
  maxDisplayComment: 50,
  maxBatchCount: 10,
  batchUpdateInterval: 300,
}

interface CommentStore<T> {
  readonly cache: readonly T[]
  readonly items: readonly T[]
}

function useComments<T>(
  initItems: T[],
  options: CommentOptions = DefaultCommentOptions
) {
  const [comments, setComments] = useImmer<CommentStore<T>>({
    cache: [],
    items: initItems,
  })
  // provide action for adding comments
  const addComments = useCallback(
    (items: T[]) => {
      if (items.length <= 0) {
        return
      }
      setComments(draft => {
        draft.cache.push(...castDraft(items))
      })
    },
    [setComments]
  )

  useEffect(() => {
    // move messages from cache to display after interval
    const timeoutCacheRef = setInterval(() => {
      setComments(pref => {
        const length = pref.cache.length
        if (length <= 0) {
          return
        }
        if (length > options.maxBatchCount) {
          pref.items = pref.cache.slice(-options.maxDisplayComment)
        } else {
          pref.items.push(...pref.cache)
          const msgLength = pref.items.length
          if (msgLength > options.maxDisplayComment) {
            pref.items.splice(0, msgLength - options.maxDisplayComment)
          }
        }
        pref.cache = []
      })
    }, options.batchUpdateInterval)
    return () => {
      timeoutCacheRef && clearInterval(timeoutCacheRef)
    }
  }, [
    options.batchUpdateInterval,
    options.maxBatchCount,
    options.maxDisplayComment,
    setComments,
  ])

  return { comments: comments.items, addComments }
}

export default useComments
