import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TextInput,
  findNodeHandle,
  Keyboard,
  RefreshControl,
  NativeScrollEvent,
  AppState,
} from 'react-native'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { Comment, Paging, Post } from './model/Forum'
import { callAPIHook } from '@app/utils/CallApiHelper'
import {
  getPostDetail,
  getComment,
  requestCreateComment,
  getPreviousComment,
  requestDeletePost,
  requestReactionComment,
} from '@app/service/Network/home/HomeApi'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import PostItem from './component/PostItem'
import R from '@app/assets/R'
import { CommentLoader } from './loader/CommentLoader'
import CommentItem from './component/CommentItem'
import FstImage from '@app/components/FstImage/FstImage'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { Button } from '@app/components/Button/Button'
import isEqual from 'react-fast-compare'
import { useAppDispatch, useAppSelector } from '@app/store'
import { SocketHelper } from '@app/utils/SocketHelper'
import { DEFAULT_PARAMS, POST_EVENT } from '@app/config/Constants'
import { showConfirm, showMessages } from '@app/utils/GlobalAlertHelper'
import { deletePost } from './slice/PostSlice'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import reactotron from 'reactotron-react-native'

const { width } = dimensions

const PostDetailScreen = (props: any) => {
  const id = props.route.params?.id
  const reloadList = props.route.params?.reloadList

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(true)
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(true)
  const [postData, setPostData] = useState<Post & any>({})
  const [commentData, setCommentData] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState<string>('')
  const [targetComment, setTargetComment] = useState<string>('')
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [dialogLoading, setDialogLoading] = useState<boolean>(false)
  const [body, setBody] = useState({ page: DEFAULT_PARAMS.PAGE })

  const commentRef = useRef<View | null>(null)
  const scrollRef = useRef<ScrollView>(null)
  const inputRef = useRef<TextInput>(null)
  const parentIdRef = useRef<number | null | undefined>(null)
  const commentDataRef = useRef<Comment[] | null>()
  const targetIdRef = useRef<number | null>()
  const paging = useRef<Paging>()

  const { data } = useAppSelector(state => state.accountReducer)
  const Dispatch = useAppDispatch()
  const profile_avt = data.profile_picture_url

  var onEndReachedCalledDuringMomentum = true

  const onMomentumScrollBegin = () => {
    onEndReachedCalledDuringMomentum = false
  }

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: NativeScrollEvent) => {
    const paddingToBottom = 60

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    )
  }

  const handleLoadMore = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      commentData.length <= paging.current?.totalItemCount! &&
      !isLoadMore
    ) {
      setBody({ page: body.page + 1 })
    }

    onEndReachedCalledDuringMomentum = true
  }

  const getData = () => {
    callAPIHook({
      API: getPostDetail,
      payload: { id },
      useLoading: setIsLoading,
      onSuccess: res => {
        if (res.code == 19) {
          setError(true)
          return
        } else setError(false)
        setPostData(res.data)
        setBody({ page: DEFAULT_PARAMS.PAGE })
      },
      onError: err => setError(err.message),
    })
  }

  const getPostComment = (post_id?: number) => {
    callAPIHook({
      API: getComment,
      payload: { post_id, page: body.page },
      useLoading:
        body.page == DEFAULT_PARAMS.PAGE ? setIsCommentLoading : setIsLoadMore,
      onSuccess: res => {
        paging.current = res.paging
        let commentDataRes = [...res.data]
        // reactotron.logImportant!('RES', res.data)
        // reactotron.logImportant!('commentDataRes', commentDataRes)
        // if (body.page == DEFAULT_PARAMS.PAGE) {
        //   currentCommentCount.current = commentDataRes.length
        // }
        if (commentDataRes.length != 0) {
          reactotron.logImportant!('commentDataRes', commentDataRes)
          // commentDataRes.forEach(item => item.Comments.reverse())
          // commentDataRes.forEach(item => item.Comments.reverse())
          // reactotron.logImportant!('commentDataRes', commentDataRes.reverse())
          setCommentData(commentDataRes)
        }
        if (body.page == DEFAULT_PARAMS.PAGE) {
          commentDataRef.current = commentDataRes
          reactotron.logImportant!('1', commentDataRes)
          setCommentData(commentDataRes)
        } else {
          commentDataRef.current = [...commentData, ...commentDataRes]
          reactotron.logImportant!('2', commentDataRes)
          setCommentData(prev => [...prev, ...commentDataRes])
        }
      },
    })
  }

  const onSendPress = () => {
    if (commentText.trim().length) {
      const payload = !parentIdRef.current
        ? {
            post_id: postData.id,
            body: {
              content: commentText,
            },
          }
        : {
            post_id: postData.id,
            body: {
              content: commentText,
              parent_id: parentIdRef.current,
              target_user_id: targetIdRef.current,
            },
          }
      setCommentText('')
      onCancelTargetComment()
      Keyboard.dismiss()
      callAPIHook({
        API: requestCreateComment,
        payload,
        onSuccess: res => {},
      })
    }
  }

  const onLoadPreviousComment = (
    comment_id: number,
    last_comment_id?: number,
    amount?: number
  ) => {
    callAPIHook({
      API: getPreviousComment,
      payload: { comment_id, body: { last_comment_id, amount } },
      onSuccess: res => {
        var cloneCommentData = [...commentData]
        let target = commentData.find(item => item.id == comment_id)
        if (target) {
          let totalComment = [...res.data.reverse(), ...target.Comments!]
          target.Comments = totalComment
          commentDataRef.current = cloneCommentData
          setCommentData(cloneCommentData)
        }
      },
    })
  }

  const onCancelTargetComment = () => {
    parentIdRef.current = null
    commentRef.current = null
    setTargetComment('')
  }

  const handleDeletePost = () => {
    showConfirm('', 'Bạn có chắc chắn muốn xoá bài viết', () => {
      callAPIHook({
        API: requestDeletePost,
        payload: { id },
        onSuccess: res => {
          showMessages('', 'Xoá bài viết thành công', () => {
            Dispatch(deletePost(id))
            !!reloadList && reloadList()
            NavigationUtil.goBack()
          })
        },
      })
    })
  }

  const onCommentReaction = (comment_id: number, parent_id: number | null) => {
    callAPIHook({
      API: requestReactionComment,
      payload: { post_id: id, comment_id },
      onSuccess: res => {
        let cloneCommentData = [...commentData]
        if (!parent_id) {
          let target = cloneCommentData.find(item => item.id == comment_id)
          target!.is_reaction = Boolean(target?.is_reaction) ? 0 : 1
        } else {
          let target = cloneCommentData
            .find(item => item.id == parent_id)
            ?.Comments?.find(item => item.id == comment_id)

          target!.is_reaction = Boolean(target?.is_reaction) ? 0 : 1
        }
        commentDataRef.current = cloneCommentData
        setCommentData(cloneCommentData)
      },
    })
  }

  const handleOnComment = useCallback((res: any) => {
    var newCommentData = [...commentDataRef.current!]
    switch (res.type_action) {
      case POST_EVENT.COMMENT:
        if (!!res.data.parent_id) {
          reactotron.logImportant!('newCommentData', newCommentData)
          let target = newCommentData.find(
            item => item.id == res.data.parent_id
          )
          reactotron.logImportant!('commentRes1', target)
          target?.Comments?.push({ ...res.data, is_reaction: 0 })
        } else {
          let commentRes = { ...res.data, Comments: [], is_reaction: 0 }
          reactotron.logImportant!('commentRes2', commentRes)
          newCommentData.unshift(commentRes)
        }
        commentDataRef.current = newCommentData
        setCommentData(newCommentData)
        break
      case POST_EVENT.REACTION_COMMENT_POST:
      case POST_EVENT.UNREACTION_COMMENT_POST:
        if (!!res.data.parent_id) {
          let target = newCommentData
            .find(item => item.id == res.data.parent_id)
            ?.Comments?.find(child => child.id == res.data.comment_id)

          target!.count_like = res.data.count_like
        } else {
          let target = newCommentData.find(
            item => item.id == res.data.comment_id
          )

          target!.count_like = res.data.count_like
        }
        commentDataRef.current = newCommentData
        setCommentData(newCommentData)
        break
    }
  }, [])

  useEffect(() => {
    // Keyboard.addListener('keyboardWillShow', () => {
    //   if (scrollRef.current && commentRef.current) {
    //     let scrollResponder = scrollRef.current?.getScrollResponder()
    //     scrollResponder?.scrollResponderScrollNativeHandleToKeyboard(
    //       findNodeHandle(commentRef.current),
    //       195,
    //       true
    //     )
    //   }
    // })
  }, [])

  useEffect(() => {
    Object.keys(postData).length && getPostComment(id)
  }, [postData, body])

  useEffect(() => {
    !!id && getData()
  }, [id])

  useEffect(() => {
    SocketHelper.socket?.on(`post_${id}`, handleOnComment)

    return () => {
      SocketHelper.socket?.off(`post_${id}`, handleOnComment)
    }
  }, [])

  const renderDetail = () => {
    return (
      <View style={{ marginBottom: 8 }}>
        <PostItem
          data={postData}
          hasToken={true}
          imageSlide
          onCommentPress={() => inputRef.current?.focus()}
          onReplyPress={() => inputRef.current?.focus()}
          onReaction={() => {}}
          onDeletePress={handleDeletePost}
          useLoading={setDialogLoading}
          onEditPress={() => {
            NavigationUtil.navigate(SCREEN_ROUTER_APP.EDIT_POST, {
              data: postData,
              reloadList: () => getData(),
            })
          }}
        />
      </View>
    )
  }

  const renderItemSeparator = useCallback(
    () => <View style={{ height: 2 }} />,
    []
  )

  const renderCommentArea = () => {
    if (isCommentLoading)
      return (
        <View style={styles.commentView}>
          <CommentLoader />
        </View>
      )
    return (
      <FlatList
        data={commentData}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View
            style={styles.commentView}
            children={
              <CommentItem
                data={item}
                onLikePress={(id, parent_id) =>
                  onCommentReaction(id, parent_id)
                }
                onCommentPress={(ref, parentId, targetId, name) => {
                  commentRef.current = ref
                  parentIdRef.current = parentId
                  targetIdRef.current = targetId
                  setTargetComment(name!)
                  inputRef.current?.focus()
                }}
                onLoadPrevious={(cmtId, lastCmtId, amount) => {
                  onLoadPreviousComment(cmtId, lastCmtId, amount)
                }}
                isLoadPrevious={
                  item.Comments?.length! < item.count_sub_comment!
                }
              />
            }
          />
        )}
        keyExtractor={(_, index) => `${index}`}
        ItemSeparatorComponent={renderItemSeparator}
      />
    )
  }

  const renderFooter = () => {
    const renderTargetComment = (
      <View style={{ ...styleView.rowItem, marginBottom: 7 }}>
        <Text style={{ ...fonts.medium13 }}>
          Đang trả lời{' '}
          <Text style={{ ...fonts.semi_bold14 }} children={targetComment} /> ·
        </Text>
        <Button
          onPress={onCancelTargetComment}
          children={<Text style={{ ...fonts.medium13 }} children={' Huỷ'} />}
        />
      </View>
    )

    return (
      <View style={styles.footerView}>
        {Boolean(targetComment) && renderTargetComment}
        <View style={{ ...styleView.rowItemBetween, alignItems: 'center' }}>
          <FstImage
            style={{ width: 32, height: 32, borderRadius: 18 }}
            source={profile_avt ? { uri: profile_avt } : R.images.img_user}
          />
          <TextInput
            ref={inputRef}
            value={commentText}
            autoCorrect={false}
            onChangeText={text => setCommentText(text)}
            placeholder={'Nhập bình luận'}
            style={styles.input}
          />
          <Button
            onPress={onSendPress}
            children={
              <FstImage
                style={{ width: 24, height: 24 }}
                source={R.images.ic_send}
              />
            }
          />
        </View>
      </View>
    )
  }

  return (
    <ScreenWrapper
      back
      unsafe
      isError={error}
      reload={() => getData()}
      titleHeader={'Bình luận'}
      dialogLoading={dialogLoading}
      isLoading={isLoading}
    >
      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            handleLoadMore()
          }
        }}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={getData} />
        }
        ref={scrollRef}
      >
        {renderDetail()}
        {renderCommentArea()}
      </ScrollView>
      {renderFooter()}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  commentView: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  footerView: {
    width,
    backgroundColor: colors.white,
    marginTop: 2,
    paddingHorizontal: 15,
    paddingTop: 9,
    paddingBottom: isIphoneX() ? 20 : 9,
  },
  input: {
    ...fonts.regular16,
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    height: 34,
    marginHorizontal: 9,
    paddingHorizontal: 15,
  },
})

export default memo(PostDetailScreen, isEqual)
