import R from '@app/assets/R'
import { LIVESTREAM_EVENT } from '@app/config/Constants'
import { colors, fonts, HEIGHT } from '@app/theme'
import { SocketHelper } from '@app/utils/SocketHelper'
import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import { styles } from '../styles'

const { COMMENT } = LIVESTREAM_EVENT

const ListComment = useMemo(
  () =>
    ({ livestream_id }: { livestream_id?: any }) => {
      const [dataListComment, setDataListComment] = useState<any>([])
      const handleTypeActionSocket = (res: any) => {
        switch (res?.type_action) {
          case COMMENT:
            setTimeout(() => {
              setDataListComment((prev: object[]) => [res.data, ...prev])
            }, 300)
            return
          default:
            break
        }
      }
      useEffect(() => {
        SocketHelper?.socket?.on(`livestream_${livestream_id}`, res => {
          if (res.type_action === COMMENT) {
            setDataListComment((prev: any) => [res.data, ...prev])
            return
          }
        })
      }, [])
      return (
        <FlatList
          style={{
            height: HEIGHT / 3,
            paddingHorizontal: 15,
          }}
          keyExtractor={(item, index) => `${index}`}
          inverted={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 5 }}
          data={dataListComment}
          renderItem={({ item, index }) => (
            <RenderItem item={item} index={index} />
          )}
        />
      )
    },
  []
)

export default ListComment

const RenderItem = ({ item, index }: { item: object; index: number }) => {
  let checkImageUser = item?.Shop?.shop_id
    ? item?.Shop?.profile_picture_url
      ? { uri: item?.Shop?.profile_picture_url }
      : R.images.img_user
    : item?.User?.profile_picture_url
    ? { uri: item?.User?.profile_picture_url }
    : R.images.img_user
  return (
    <View style={styles.vCommentLive}>
      <FastImage source={checkImageUser} style={styles.imgUser} />
      <View style={styles.vContentComment}>
        <Text style={{ color: colors.white, ...fonts.bold14 }}>
          {item?.Shop?.shop_id ? item?.Shop?.name : item?.User?.name}
          :
          <Text style={{ ...fonts.regular13 }} children={` ${item.content}`} />
        </Text>
      </View>
    </View>
  )
}
