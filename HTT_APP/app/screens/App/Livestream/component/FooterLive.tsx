import R from '@app/assets/R'
import { LIVESTREAM_EVENT, TYPE_ITEM } from '@app/config/Constants'
import { requestCreateCommentLive } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppSelector } from '@app/store'
import { HEIGHT, OS } from '@app/theme'
import { callAPIHook } from '@app/utils/CallApiHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { Animated, Keyboard, TouchableWithoutFeedback } from 'react-native'
import reactotron from 'ReactotronConfig'
import { Socket } from 'socket.io-client'
import { DataUserInfoProps } from '../../Account/Model'
import CommentView from '../CommentView/CommentView'
import {
  useToggleShowButtonAddProduct,
  useToggleShowModalButton,
  useToggleTypeItemModal,
} from '../context/YoutubeLIveContext'
import { styles } from '../styles'
import ButtonReaction from './ButtonReaction'
import Inputcomment from './Inputcomment'

const { COMMENT } = LIVESTREAM_EVENT
export const FooterContext = React.createContext(false)

const FooterLive = ({
  livestream_id,

  onSwitchCamera,
  onPressSocial,
}: any) => {
  const commentRef = useRef(null)
  const socketRef = useRef<Socket>()
  const userInfo = useAppSelector<DataUserInfoProps>(
    state => state.accountReducer.data
  )
  const dataProduct = useAppSelector(state => state.ListProductReducer)
  const [heighKeyboard, setHeightKeyboard] = useState(0)

  const onPressShowModal = useToggleShowModalButton()
  const onPressTypeItemModal = useToggleTypeItemModal()
  const onPressShowButtonAddproduct = useToggleShowButtonAddProduct()
  const [leftIcon, setLeftIcon] = useState(0)
  const [rightIcon, setRightIcon] = useState(0)
  const widthViewIconLeft = useRef(0)
  const widthViewIconRight = useRef(0)

  // animation
  const footerAni = useRef(new Animated.Value(20)).current

  const _fadeColorClamp = Animated.diffClamp(footerAni, 0, heighKeyboard)

  const _fadeColorValue = _fadeColorClamp.interpolate({
    inputRange: [0, heighKeyboard],
    outputRange: ['transparent', 'rgba(105,104,97,.5)'],
  })

  const heighFlatlist = useRef(new Animated.Value(HEIGHT / 3)).current

  const IconLeft = useRef(new Animated.Value(0)).current

  const IconRight = useRef(new Animated.Value(0)).current

  const fadeColor = useRef(new Animated.Value(0)).current

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

  const keyboardShow = useCallback(
    (e: any) => {
      setHeightKeyboard(e.endCoordinates.height)
      handleHeightList(HEIGHT / 5.5)
      setLeftIcon(-widthViewIconLeft.current)
      setRightIcon(-widthViewIconRight.current)
    },
    [heighKeyboard]
  )

  const keyboardHide = useCallback(() => {
    setHeightKeyboard(15)
    handleHeightList(HEIGHT / 3)
    setLeftIcon(0)
    setRightIcon(0)
  }, [heighKeyboard])
  const sendComment = (inputComment: string) => {
    // let data = [
    //   {
    //     Shop: {
    //       id: userInfo?.Shop.id,
    //       name: userInfo?.Shop.name,
    //       profile_picture_url: null,
    //     },
    //     User: {
    //       id: userInfo?.id,
    //       name: userInfo?.name,
    //       profile_picture_url: userInfo?.profile_picture_url,
    //     },
    //     content: inputComment,
    //     livestream_id: livestream_id,
    //   },
    // ]
    let data = [
      {
        user_id: 1,
        kiotviet_id: 1,
        livestream_id: 33,
        name: userInfo.name,
        content: inputComment,
      },
    ]
    commentRef.current?.sendComments(data)
    Keyboard.dismiss()
    createComment(inputComment)
  }
  const createComment = (inputComment: string) => {
    const payload = {
      livestream_id,
      body: {
        content: inputComment,
      },
    }
    callAPIHook({
      API: requestCreateCommentLive,
      payload: payload,
      onSuccess: async res => {},
      onError: err => {},
    })
  }

  useEffect(() => {
    OS === 'ios' ? handleAnimatedKeyboard() : null
  }, [heighKeyboard])

  useEffect(() => {
    handleAnimatedIconLeft()
    handleAnimatedIconRight()
  }, [leftIcon, rightIcon])

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

  const handleSocket = (res: any) => {
    if (res.type_action === COMMENT) {
      if (userInfo?.id !== res?.data[0]?.User.id) {
        commentRef.current?.sendComments(res.data)
      }
      return
    }
  }

  useEffect(() => {
    SocketHelperLivestream.socket?.on(
      `livestream_${livestream_id}`,
      handleSocket
    )
    return () => {
      SocketHelperLivestream.socket?.off(
        `livestream_${livestream_id}`,
        handleSocket
      )
    }
  }, [])

  return (
    <Animated.View style={[styles.vFooterLive, { bottom: footerAni }]}>
      {/* <ListComment livestream_id={livestream_id} /> */}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss()
        }}
      >
        <CommentView
          stylesViewList={{ height: heighFlatlist }}
          socket={socketRef.current}
          ref={commentRef}
          userInfo={userInfo}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.vReactionFooterLive,
          { backgroundColor: _fadeColorValue },
        ]}
      >
        <Animated.View
          style={{ marginLeft: IconLeft }}
          onLayout={e => {
            const { width } = e.nativeEvent.layout
            widthViewIconLeft.current = width
          }}
        >
          <ButtonReaction
            isCart={!!dataProduct?.listProductSelect?.length}
            icon={R.images.img_buy}
            onPress={() => {
              onPressShowModal(prev => !prev)
              onPressTypeItemModal(prev => (prev = TYPE_ITEM.LIST_PRODUCT))
              onPressShowButtonAddproduct(true)
            }}
          />
        </Animated.View>
        <Inputcomment stylesViewInput={{ flex: 1 }} onPressSend={sendComment} />
        {/* <ButtonReaction icon={R.images.img_beauty} onPress={onPressFilter} /> */}
        <Animated.View
          onLayout={e => {
            const { width } = e.nativeEvent.layout
            widthViewIconRight.current = width
          }}
          style={{ flexDirection: 'row', marginRight: IconRight }}
        >
          <ButtonReaction
            icon={R.images.img_swtich_camera}
            onPress={onSwitchCamera}
          />
          <ButtonReaction icon={R.images.img_share} onPress={onPressSocial} />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  )
}

export default memo(FooterLive, isEqual)
