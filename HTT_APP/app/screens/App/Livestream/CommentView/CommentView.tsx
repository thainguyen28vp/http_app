import R from '@app/assets/R'
import { scale } from '@app/common'
import { Block } from '@app/components/Block/Block'
import FstImage from '@app/components/FstImage/FstImage'
import { colors, dimensions, fonts, WIDTH } from '@app/theme'
import React, { memo, useImperativeHandle } from 'react'
import isEqual from 'react-fast-compare'
import { Animated, StyleSheet, Text } from 'react-native'
import AutoRecyclerListView from 'react-native-autorecyclerlistview'
import {
  Comments,
  CommentViewHandles,
  CommentViewProps,
} from './CommentView.props'
import useComments from './useComments'

interface ChatRoomState {
  messages: Comments[]
  cacheMessages: Comments[]
  channel?: string
}

let timeoutCacheRef: NodeJS.Timer
const DEFAULT_COMMENTS: Comments[] = []

export const COMMENT_ADMIN_DEFAULT = {
  name: 'TP Mart',
  profileSource: R.images.ic_tick,
}

const { width } = dimensions

const RenderMessage = ({
  item,
  index,
  isWatching,
  shopId,
}: {
  item: Comments | any
  index: number
  isWatching: boolean | undefined
  shopId?: number | undefined
}) => {
  // let checkImageUser = item?.Shop?.shop_id
  //   ? item?.Shop?.profile_picture_url
  //     ? { uri: item?.Shop?.profile_picture_url }
  //     : R.images.img_user
  //   : item?.User?.profile_picture_url
  //   ? { uri: item?.User?.profile_picture_url }
  //   : R.images.img_user

  // const checkNameUser = () => {
  //   if (isWatching) {
  //     if (item?.shop_id || item.Shop?.id) {
  //       if (item?.shop_id === shopId || item.Shop?.id === shopId)
  //         return item?.Shop?.name || 'Chưa cập nhật'
  //       return item?.User?.name || 'Chưa cập nhật'
  //     }
  //     return item?.User?.name || 'Chưa cập nhật'
  //   } else {
  //     return item?.Shop?.shop_id ? item?.Shop?.name : item?.User?.name
  //   }
  // }
  // const checkImage = () => {
  //   if (item?.Shop?.id || item?.Shop?.id) {
  //     if (item?.shop_id === shopId || item.Shop?.id === shopId)
  //       return item?.Shop?.profile_picture_url
  //         ? { uri: item?.Shop?.profile_picture_url }
  //         : R.images.img_user
  //     return item?.User?.profile_picture_url
  //       ? { uri: item?.User?.profile_picture_url }
  //       : R.images.img_user
  //   }
  //   return item?.User?.profile_picture_url
  //     ? { uri: item?.User?.profile_picture_url }
  //     : R.images.img_user
  // }
  return (
    <Block
      alignItems="center"
      direction="row"
      style={{ width, paddingHorizontal: 10 }}
    >
      <FstImage
        resizeMode="contain"
        style={[styles.commentAvatar]}
        // source={isWatching ? checkImage() : checkImageUser}
        source={R.images.image_logo}
      />
      <Block style={[styles.messageContainer, {}]}>
        <Block style={[styles.commentView, {}]}>
          <Text style={{ color: colors.white, ...fonts.bold14 }}>
            {/* {checkNameUser()} */}
            {item?.name || item?.User?.name || item?.User?.phone_number}
            <Text
              style={{ ...fonts.regular13 }}
              children={` ${item.content}`}
            />
          </Text>
        </Block>
      </Block>
    </Block>
  )
}
__DEV__ && console.log('comment')

const CommentView = React.forwardRef(
  (
    {
      // renderComment = renderMessage,
      socket,
      userInfo,
      initItems = DEFAULT_COMMENTS,
      stylesViewList,
      isWatching,
      shopId,
    }: CommentViewProps,
    ref: React.Ref<CommentViewHandles>
  ) => {
    const { comments, addComments } = useComments<Comments>(initItems)
    useImperativeHandle(ref, () => ({
      sendComment(item: Comments) {
        addComments([item])
      },
      sendComments(items: Comments[]) {
        addComments(items)
      },
    }))
    return (
      // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={[{ width: WIDTH }, stylesViewList]}>
        <AutoRecyclerListView
          // ref={scrollRef}
          data={comments}
          renderItem={({ item, index }) => (
            <RenderMessage
              item={item}
              index={index}
              isWatching={isWatching}
              shopId={shopId}
            />
          )}
          newItemsText={itemCount => `${itemCount} bình luận mới`}
          maxItemAllow={100}
        />
      </Animated.View>
      // </TouchableWithoutFeedback>
    )
  }
)

export default memo(CommentView, isEqual)

const styles = StyleSheet.create({
  messageContainer: {
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    maxWidth: '80%',

    margin: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,

    justifyContent: 'flex-start',
  },
  liveCommentCtn: {
    height: dimensions.height / 4,

    width: dimensions.width,
  },
  messageStyle: {
    color: 'white',
    ...fonts.regular14,
    marginLeft: 4,
  },
  commentAvatar: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(24) / 2,
    borderWidth: 1,
    borderColor: colors.white,
    marginRight: 2,
  },
  commentView: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  userTxt: {
    color: '#8B8C8D',
  },
  commentUsernameAdmin: {
    color: colors.primary,
    ...fonts.regular14,
    fontWeight: 'bold',
  },
  commentUsernameGuest: {
    color: '#fdd283',
    fontWeight: 'bold',
    ...fonts.regular14,
  },
  list: {
    height: dimensions.height / 4,
    width: dimensions.width,
    flexShrink: 0,
  },
})
