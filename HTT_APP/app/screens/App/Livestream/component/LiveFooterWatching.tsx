import R from '@app/assets/R'
import { EMOTIONS, LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import {
  requestCreateCommentLive,
  requestReaction,
} from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch, useAppSelector } from '@app/store'
import { HEIGHT, OS } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { handleShareSocial, randomIntFromInterval } from '@app/utils/FuncHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import reactotron from 'ReactotronConfig'
import { Socket } from 'socket.io-client'
import { DataUserInfoProps } from '../../Account/Model'
import CommentView from '../CommentView/CommentView'
import {
  updateNameProductComment,
  updateShowModalBottom,
} from '../slice/LiveSlice'
import { styles } from '../styles'
import ButtonReaction from './ButtonReaction'
import InputCommentWatching from './InputCommentWatching'
import ListProductHozironWatching from './ListProductHozironWatching'

const { COMMENT } = LIVESTREAM_EVENT

interface props {
  livestream_id: any
  shopId: any
  channelId: any
  listComment?: any
  pushEmoji?: ((id: number) => void | undefined) | undefined
}

const LiveFooterWatching = ({
  channelId,
  shopId,
  livestream_id,
  listComment,
  pushEmoji,
}: props) => {
  const socketRef = useRef<Socket>()
  const commentRef = useRef<any>(null)
  const refInputComment = useRef<any>(null)
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const [heighKeyboard, setHeightKeyboard] = useState(0)
  const [leftIcon, setLeftIcon] = useState(0)
  const [rightIcon, setRightIcon] = useState(0)
  const appDispatch = useAppDispatch()
  const widthViewIconLeft = useRef(0)
  const widthViewIconRight = useRef(0)

  // animation
  const footerAni = useRef(new Animated.Value(20)).current
  const _fadeColorClamp = Animated.diffClamp(footerAni, 0, heighKeyboard)

  const _fadeColorValue = _fadeColorClamp.interpolate({
    inputRange: [0, heighKeyboard],
    outputRange: ['transparent', 'rgba(105,104,97,.5)'],
  })

  const heighFlatlist = useRef<any>(new Animated.Value(HEIGHT / 3)).current

  const IconLeft = useRef<any>(new Animated.Value(0)).current

  const IconRight = useRef<any>(new Animated.Value(0)).current

  const handleAnimatedIconLeft = () => {
    Animated.timing(IconLeft, {
      toValue: leftIcon,
      duration: OS === 'ios' ? 250 : 350,
      useNativeDriver: false,
    }).start()
  }

  const handleAnimatedIconRight = () => {
    Animated.timing(IconRight, {
      toValue: rightIcon,
      duration: OS === 'ios' ? 250 : 350,
      useNativeDriver: false,
    }).start()
  }

  const handleAnimatedKeyboard = () => {
    Animated.timing(footerAni, {
      toValue: heighKeyboard,
      duration: OS === 'ios' ? 250 : 400,
      useNativeDriver: false,
    }).start()
  }
  const handleHeightList = (height: number) => {
    Animated.timing(heighFlatlist, {
      toValue: height,
      duration: OS === 'ios' ? 250 : 400,
      useNativeDriver: false,
    }).start()
  }

  const handleOnPressItemProductHoziron = (item: any) => {
    appDispatch(
      updateNameProductComment({
        name: item?.code_product_livestream || item?.name || item.product.name,
      })
    )
  }
  const handleSocketRelease = (res: any) => {
    if (res.type_action === COMMENT) {
      if (userInfo?.id !== res?.data[0]?.User?.id) {
        commentRef.current?.sendComments(res.data)
      }
      return
    }
  }

  const handleOnPressReactionCart = () => {
    appDispatch(
      updateShowModalBottom({
        showModal: true,
        typeItem:
          userInfo?.Shop?.id === shopId
            ? TYPE_ITEM.LIST_PRODUCT
            : TYPE_ITEM.LIST_PRODUCT_CART,
      })
    )
  }

  const createComment = (inputComment: string) => {
    let data = [
      {
        user_id: 1,
        kiotviet_id: 1,
        livestream_id: 34,
        name: userInfo.name,
        content: inputComment,
      },
    ]
    commentRef.current?.sendComments(data)
    Keyboard.dismiss()
    const payload = {
      livestream_id,
      body: {
        content: inputComment,
      },
    }
    callAPIHook({
      API: requestCreateCommentLive,
      payload: payload,
      onSuccess: async res => {
        appDispatch(
          updateNameProductComment({
            name: '',
          })
        )
      },
      onError: err => {},
    })
  }

  const getRandomEmotion = (idReact: number) => {
    pushEmoji(idReact)
    const payload = {
      livestream_id,
      body: {
        df_reaction_id: idReact,
      },
    }
    callAPIHook({
      API: requestReaction,
      payload: payload,
      onSuccess: async res => {},
      onError: err => {},
    })
  }
  const keyboardShow = useCallback(
    (e: any) => {
      setHeightKeyboard(e.endCoordinates.height)
      handleHeightList(HEIGHT / 5.5)
      setLeftIcon(-widthViewIconLeft.current)
      setRightIcon(-widthViewIconRight.current)
      // handleFadeColor()
    },
    [heighKeyboard]
  )

  const keyboardHide = useCallback(() => {
    setHeightKeyboard(15)
    handleHeightList(HEIGHT / 3)
    setLeftIcon(0)
    setRightIcon(0)
    // fadeOut()
  }, [heighKeyboard])
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardShow
    )
    const keyboardHideListener = Keyboard.addListener(
      OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardHide
    )
    return () => {
      keyboardShowListener.remove()
      keyboardHideListener.remove()
    }
  }, [])

  useEffect(() => {
    SocketHelperLivestream?.socket?.on(channelId, handleSocketRelease)
    return () => {
      SocketHelperLivestream.socket?.off(channelId, handleSocketRelease)
    }
  }, [])

  useEffect(() => {
    OS === 'ios' ? handleAnimatedKeyboard() : null
    // handleFadeColor()
  }, [heighKeyboard])

  useEffect(() => {
    handleAnimatedIconLeft()
    handleAnimatedIconRight()
  }, [leftIcon, rightIcon])

  useEffect(() => {
    listComment.forEach((element: any) => {
      commentRef.current?.sendComment(element)
    })
  }, [])

  return (
    <Animated.View style={{ position: 'absolute', bottom: footerAni }}>
      {/* <ListCommentWatching
          shopId={shopId}
          channelId={channelId}
          livestream_id={livestream_id}
        /> */}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <CommentView
          shopId={shopId}
          isWatching={true}
          stylesViewList={{ height: heighFlatlist }}
          socket={socketRef.current}
          ref={commentRef}
          userInfo={userInfo}
        />
      </TouchableWithoutFeedback>
      <ListProductHozironWatching
        channelId={channelId}
        onPressItem={handleOnPressItemProductHoziron}
      />
      <Animated.View
        style={[styles.vReactionWatching, { backgroundColor: _fadeColorValue }]}
      >
        <Animated.View
          style={{ marginLeft: IconLeft }}
          onLayout={e => {
            const { width } = e.nativeEvent.layout
            widthViewIconLeft.current = width
          }}
        >
          <ButtonReaction
            isCart={true}
            icon={R.images.img_buy}
            onPress={handleOnPressReactionCart}
          />
        </Animated.View>
        <InputCommentWatching
          stylesViewInput={{ flex: 1, marginHorizontal: 5 }}
          ref={refInputComment}
          onPressSend={createComment}
        />
        <Animated.View
          onLayout={e => {
            const { width } = e.nativeEvent.layout
            widthViewIconRight.current = width
          }}
          style={{ flexDirection: 'row', marginRight: IconRight }}
        >
          <ButtonReaction
            icon={R.images.img_share}
            onPress={handleShareSocial}
          />
          <ButtonReaction
            icon={R.images.img_reaction_live}
            onPress={() => {
              getRandomEmotion(
                randomIntFromInterval(EMOTIONS.HEART.id, EMOTIONS.WOW.id)
              )
            }}
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default LiveFooterWatching
