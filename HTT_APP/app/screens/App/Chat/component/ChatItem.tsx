import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@app/components/Button/Button'
import DateUtil from '@app/utils/DateUtil'
import reactotron from 'ReactotronConfig'

const ChatItem = ({ data, id, shopId, onPress, isNotRead }: any) => {
  const targetInfor = id == data.User.id ? data?.Shop : data?.User
  const isShop = id == data.User.id
  const lastMessage = data.Messages[0]

  return (
    <Button
      onPress={onPress}
      children={
        <View style={styles.chatItemView}>
          <FstImage
            style={styles.chatAvt}
            source={
              !!targetInfor.profile_picture_url
                ? { uri: targetInfor?.profile_picture_url }
                : R.images.img_user
            }
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View
              style={{
                ...styleView.rowItemBetween,
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ ...fonts.medium16, flex: 1 }}
                numberOfLines={1}
                children={`${targetInfor.name}`}
              />
              <Text
                style={{ ...fonts.regular14, color: '#69747E' }}
                children={DateUtil.formatTimeDateConversation(
                  lastMessage.create_at
                )}
              />
            </View>
            <View style={{ ...styleView.rowItemBetween, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 14,
                  color: !isNotRead ? '#69747E' : '#333',
                  fontFamily: !isNotRead
                    ? R.fonts.sf_regular
                    : R.fonts.sf_medium,
                  marginTop: 5,
                  flex: 1,
                }}
                numberOfLines={1}
                children={
                  !!lastMessage.message_media_url
                    ? '[Hình ảnh]'
                    : lastMessage.content.replace(/\s{2,}/g, ' ').trim()
                }
              />
              {isNotRead && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    marginLeft: 10,
                  }}
                />
              )}
            </View>
          </View>
        </View>
      }
    />
  )
}

const styles = StyleSheet.create({
  chatItemView: {
    ...styleView.rowItem,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  chatAvt: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
})

export default ChatItem
