import R from '@app/assets/R'
import { useAppSelector } from '@app/store'
import { colors, styleView } from '@app/theme'
import React from 'react'
import { View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'

const ChatButton = () => {
  const { messageNotRead } = useAppSelector(state => state.ChatReducer)
  return (
    <View style={{ ...styleView.centerItem }}>
      {messageNotRead?.length ? (
        <View
          style={{
            ...styleView.centerItem,
            position: 'absolute',
            width: 10,
            height: 10,
            backgroundColor: colors.primary,
            borderRadius: 5,
            top: 0,
            right: 0,
          }}
        />
      ) : null}
      <FastImage
        style={{ width: 24, height: 24, zIndex: -1 }}
        source={R.images.icon_chat_forum}
      />
    </View>
  )
}

export default ChatButton
