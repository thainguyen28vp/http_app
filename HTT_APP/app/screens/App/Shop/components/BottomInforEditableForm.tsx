import React from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { colors, fonts, styleView } from '@app/theme'
import FastImage from 'react-native-fast-image'

interface Props {
  locationAdress?: string
  onDeletePress?: () => void
  switchValue?: boolean
  onSwitchChange?: () => void
  showDefaulBar?: boolean
  showDeleteBar?: boolean
}

const BottomInforEditableForm = (props: Props) => {
  const {
    locationAdress,
    onDeletePress,
    showDefaulBar,
    showDeleteBar,
    switchValue,
    onSwitchChange,
  } = props

  return (
    <React.Fragment>
      {/* <Button
        onPress={() => {}}
        children={
          <View
            style={{
              ...styleView.sharedStyle,
              ...styleView.rowItemBetween,
              alignItems: 'center',
              marginTop: 6,
              paddingVertical: 10,
            }}
          >
            <View>
              <Text style={{ ...fonts.regular14, marginBottom: 14 }}>
                Địa chỉ định vị
              </Text>
              <Text style={{ ...fonts.regular16 }}>
                181 Vĩnh Hưng, Hoàng Mai, Hà Nội ...
              </Text>
            </View>
            <FastImage style={styles.icRight} source={R.images.ic_back} />
          </View>
        }
      /> */}
      {showDefaulBar && (
        <View
          style={{
            ...styleView.sharedStyle,
            ...styleView.rowItemBetween,
            marginTop: 4,
            alignItems: 'center',
            paddingVertical: 10,
          }}
        >
          <Text
            style={{ ...fonts.regular16 }}
            children={R.strings().set_address_default}
          />
          <Switch
            value={switchValue}
            trackColor={{ true: colors.primary }}
            onValueChange={onSwitchChange}
          />
        </View>
      )}
      {showDeleteBar && (
        <Button
          onPress={onDeletePress!}
          children={
            <View
              style={{
                ...styleView.sharedStyle,
                ...styleView.rowItemBetween,
                marginTop: 4,
                alignItems: 'center',
                paddingVertical: 14,
              }}
            >
              <Text style={{ ...fonts.regular16, color: colors.red }}>
                Xoá địa chỉ
              </Text>
              <FastImage
                style={{ width: 24, height: 24 }}
                tintColor={colors.red}
                source={R.images.ic_trash}
              />
            </View>
          }
        />
      )}
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  icRight: {
    width: 20,
    height: 20,
    transform: [{ rotate: '180deg' }],
  },
})

export default BottomInforEditableForm
