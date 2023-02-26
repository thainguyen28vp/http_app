import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import FstImage from '@app/components/FstImage/FstImage'
import MediaSwiper from '@app/components/MediaSwiper/MediaSwiper'
import { POST_EVENT, ROLE_COMMENTS } from '@app/config/Constants'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestReactionPost } from '@app/service/Network/home/HomeApi'
import { requestCheckExistProduct } from '@app/service/Network/product/ProductApi'
import { useAppSelector } from '@app/store'
import { colors, dimensions, fonts, styleView } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { handleShareSocial } from '@app/utils/FuncHelper'
import { showMessages } from '@app/utils/GlobalAlertHelper'
import { SocketHelper } from '@app/utils/SocketHelper'
import moment from 'moment'
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Clipboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import Modal from 'react-native-modal'
import Toast from 'react-native-root-toast'
import reactotron from 'ReactotronConfig'
import { checkDuplicatePrice } from '../../Product/utils/ProductUtils'
import Line from '../../Shop/components/Line'
import { Post, Product } from '../model/Forum'
import PostImageArea from './PostImageArea'

interface Props {
  data: Post
  onReaction?: () => void
  onCommentPress?: () => void
  onPress?: () => void
  imageSlide?: boolean
  hasToken?: boolean
  isShowMoreContent?: boolean
  onShowMoreContentPress?: () => void
  onDeletePress?: () => void
  onReplyPress?: () => void
  onEditPress?: () => void
  onPressNameShop?: () => void
  onProductPress?: (id: number) => void
  useLoading?: React.Dispatch<SetStateAction<boolean>>
}

interface HorizontalItemProps {
  onPress: () => void
  title: string
  leftIcon: number
  showLineTop?: boolean
  showLineBottom?: boolean
}

const { width, height } = dimensions
const RATIO = 375 / width
const NUM_OF_LINES = 4

const HorizontalItem = (props: HorizontalItemProps) => {
  const { onPress, title, leftIcon, showLineTop, showLineBottom } = props

  return (
    <>
      {showLineTop && <Line color={'#BFBFBF'} />}
      <Button
        onPress={onPress}
        children={
          <View
            style={{
              ...styleView.rowItem,
              alignItems: 'center',
              height: 56,
              marginLeft: 16,
            }}
          >
            <FastImage style={{ width: 24, height: 24 }} source={leftIcon} />
            <Text
              style={{ ...fonts.regular16, marginLeft: 16 }}
              children={title}
            />
          </View>
        }
      />
      {showLineBottom && <Line color={'#BFBFBF'} />}
    </>
  )
}

const PostItem = (props: Props) => {
  const {
    data,
    onPress,
    imageSlide,
    onReaction,
    onCommentPress,
    hasToken,
    isShowMoreContent = false,
    onShowMoreContentPress,
    onDeletePress,
    onReplyPress,
    onEditPress,
    useLoading,
    onPressNameShop,
  } = props
  const commentCountData = useMemo(
    () => data.count_comment,
    [data.count_comment]
  )
  const [reactionState, setReactionState] = useState<{
    isLiked: boolean
    countLike: number
  }>({ isLiked: Boolean(data.is_reaction), countLike: data.count_like })
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [showMoreContent, setShowMoreContent] = useState<boolean>(false)
  const [commentCount, setCommentCount] = useState<number>(commentCountData)
  const { width, height } = useWindowDimensions()

  const AccountData = useAppSelector(state => state.accountReducer)

  useEffect(() => {
    setCommentCount(commentCountData)
  }, [commentCountData])

  const userInfor = data?.User
  const mediaData = data?.PostMedia

  const handleOnReaction = (res: any) => {
    switch (res.type_action) {
      case POST_EVENT.REACTION_POST:
      case POST_EVENT.UNREACTION_POST:
        if (res?.data?.account_id == AccountData?.data?.account_id) {
          if (!res.data?.df_reaction_id)
            setReactionState({ isLiked: false, countLike: res.data.count_like })
          else
            setReactionState({ isLiked: true, countLike: res.data.count_like })
        } else {
          setReactionState(prev => ({
            ...prev,
            isLiked: false,
            countLike: res.data.count_like,
          }))
        }
        break
      case POST_EVENT.COMMENT:
        setCommentCount(prev => prev + 1)
        break
    }
  }
  const onTextLayout = useCallback(e => {
    isShowMoreContent &&
      setShowMoreContent(e.nativeEvent.lines.length >= NUM_OF_LINES)
  }, [])

  const handleOnProductPress = (id: number) => {
    callAPIHook({
      API: requestCheckExistProduct,
      useLoading: useLoading,
      payload: { id },
      onSuccess: res => {
        if (res.data) {
          NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
            product_id: id,
          })
        } else {
          showMessages('', 'Sản phẩm đã ngừng bán')
        }
      },
    })
  }

  useEffect(() => {
    SocketHelper.socket?.on(`post_${data.id}`, handleOnReaction)

    return () => {
      SocketHelper.socket?.off(`post_${data.id}`, handleOnReaction)
    }
  }, [])

  useEffect(() => {
    setReactionState({
      isLiked: Boolean(data.is_reaction),
      countLike: data.count_like,
    })
  }, [data])

  const onLikeBtnPress = () => {
    !!onReaction && onReaction()
    if (!hasToken) return
    callAPIHook({
      API: requestReactionPost,
      payload: { post_id: data.id },
      onSuccess: res => {},
    })
  }

  const renderTop = () => {
    let checkAccount = data?.Account?.role === ROLE_COMMENTS.USER
    return (
      <View style={{ ...styleView.rowItemBetween, marginBottom: 16 }}>
        <TouchableOpacity
          disabled={!!!data.shop_id}
          style={{ ...styleView.rowItem, alignItems: 'center' }}
          onPress={onPressNameShop}
        >
          <FstImage
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={
              checkAccount
                ? { uri: data?.Account?.User?.avatar }
                : R.images.image_logo
            }
          />
          <View style={{ marginLeft: 16 }}>
            <Text
              style={{ ...fonts.semi_bold15 }}
              // children={userInfor?.name?.trim()}
              children={
                data?.Account?.id == 2
                  ? data?.Account?.Admin?.full_name
                  : data?.Account?.User?.full_name
              }
            />
            <Text
              style={{ ...fonts.regular12, marginTop: 5, color: '#8C8C8C' }}
              children={moment(data.create_at).fromNow()}
            />
          </View>
        </TouchableOpacity>
        <Button
          onPress={() => setIsVisible(true)}
          children={
            <FastImage
              style={{ width: 20, height: 20 }}
              source={R.images.ic_more}
            />
          }
        />
      </View>
    )
  }

  const renderButton = () => {
    const iconLike = reactionState.isLiked
      ? R.images.icon_red_heart_forum
      : R.images.icon_heart_forum

    return (
      <View
        style={{
          ...styleView.rowItemBetween,
          alignItems: 'center',
          marginTop: 16,
        }}
      >
        <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
          <Button
            onPress={onLikeBtnPress}
            children={
              <FastImage style={{ width: 24, height: 24 }} source={iconLike} />
            }
          />
          <Text
            style={{ ...fonts.regular16, marginLeft: 4 }}
            children={`${reactionState.countLike}`}
          />
          <Button
            onPress={() => !!onCommentPress && onCommentPress()}
            children={
              <FastImage
                style={{ width: 24, height: 24, marginLeft: 10 }}
                source={R.images.icon_chat_forum}
              />
            }
          />
          <Text
            style={{ ...fonts.regular16, marginLeft: 4 }}
            children={commentCount}
          />
        </View>
        <Button
          onPress={() => {
            handleShareSocial()
            // handleShareSocial(
            //   `${data.content}`,
            //   `http://forum.ogogroup.info/post-detail/${data.id}`
            // )
          }}
          children={
            <FastImage
              style={{ width: 24, height: 24 }}
              source={R.images.icon_respond_forum}
            />
          }
        />
      </View>
    )
  }

  const renderContent = () => {
    return (
      <View style={{ marginTop: 12 }}>
        <Text
          numberOfLines={isShowMoreContent ? NUM_OF_LINES : undefined}
          onTextLayout={onTextLayout}
          style={{ ...fonts.regular16 }}
          children={data?.content}
        />
        {showMoreContent && (
          <Button
            onPress={() => {
              !!onShowMoreContentPress && onShowMoreContentPress()
            }}
            children={
              <Text
                style={{
                  ...fonts.medium14,
                  color: colors.primary,
                  marginTop: 1,
                }}
                children={'Xem thêm'}
              />
            }
          />
        )}
      </View>
    )
  }

  const renderProduct = (product: Product) => {
    return (
      <Button
        onPress={() => handleOnProductPress(product.id)}
        children={
          <View style={styles.productView}>
            <FstImage
              style={{
                height: '100%',
                aspectRatio: 1,
                borderRadius: 12,
              }}
              source={{ uri: product?.media_url }}
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text
                style={{ ...fonts.medium16 }}
                numberOfLines={1}
                children={`${product?.name}`}
              />
              <Text
                style={{ marginTop: 6, ...fonts.medium16, color: '#F03E3E' }}
                children={`${checkDuplicatePrice(product?.min_max_price)}`}
              />
            </View>
          </View>
        }
      />
    )
  }
  return (
    <View style={{ padding: 15, backgroundColor: colors.white }}>
      {renderTop()}
      {!mediaData?.length ? null : imageSlide ? (
        <MediaSwiper
          style={{ height: width - 10 }}
          indicatorBottomDistance={5}
          data={mediaData?.map(item => item.media_url)}
          itemWidth={width - 30}
          activeDotColor={'#D5A227'}
          inactiveDotColor={'#D9D9D9'}
        />
      ) : (
        <Button
          disabled={!Boolean(onPress)}
          onPress={() => !!onPress && onPress()}
          children={!!mediaData && <PostImageArea data={mediaData} />}
        />
      )}
      {!!data.Product && renderProduct(data.Product)}
      {renderButton()}
      {renderContent()}
      <Modal
        isVisible={isVisible}
        useNativeDriver
        hideModalContentWhileAnimating
        hardwareAccelerated
        onBackdropPress={() => setIsVisible(false)}
        style={{ margin: 0 }}
      >
        <View
          style={{
            width: width - 16,
            backgroundColor: colors.white,
            alignSelf: 'center',
            borderRadius: 16,
            position: 'absolute',
            bottom: 25 * RATIO,
          }}
        >
          <HorizontalItem
            leftIcon={R.images.icon_chat_forum}
            onPress={() => {
              setIsVisible(false)
              setTimeout(() => {
                !!onReplyPress && onReplyPress()
              }, 400)
            }}
            title={'Trả lời'}
          />
          {(data.user_id == AccountData?.data.account_id ||
            (data.user_id == AccountData?.data?.account_id &&
              data.shop_id == AccountData?.data?.shop_id)) && (
            <HorizontalItem
              leftIcon={R.images.ic_edit_square}
              onPress={() => {
                setIsVisible(false)
                !!onEditPress && onEditPress()
              }}
              title={'Chỉnh sửa bài viết'}
              showLineTop
            />
          )}
          <HorizontalItem
            showLineTop
            leftIcon={R.images.ic_chain}
            onPress={() => {
              setIsVisible(false)
              Clipboard.setString(
                `https://www.facebook.com/khohoathanhtuoc/`
                // `http://forum.ogogroup.info/post-detail/${data.id}`
              )
              Toast.show('Sao chép liên kết thành công', {
                position: height - 150,
                animation: true,
              })
            }}
            title={'Sao chép liên kết'}
          />
          {AccountData?.data &&
          data?.user_id == AccountData?.data?.account_id ? (
            <HorizontalItem
              showLineTop
              leftIcon={R.images.ic_trash}
              onPress={() => {
                setIsVisible(false)
                !!onDeletePress && onDeletePress()
              }}
              title={'Xoá bài viết'}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  productView: {
    ...styleView.rowItem,
    width: '100%',
    height: 78,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginTop: 12,
    padding: 5,
    alignItems: 'center',
  },
})

export default PostItem
