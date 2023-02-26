import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, dimensions, fonts, styleView } from '@app/theme'

type ConfirmProps = {
  title?: string
  content?: string
  action?: () => void
  textConfirm?: string
  textCancel?: string
}

interface Props {
  navigation: any
  route: { params: ConfirmProps }
}

const { width } = dimensions

const ModalConfirm = (props: Props) => {
  const {
    navigation,
    route: { params },
  } = props

  const title = params?.title || 'Thông báo'
  const content = params?.content
  const action = params?.action
  const textConfirm = params?.textConfirm || 'Xác nhận'
  const textCancel = params?.textCancel || 'Huỷ'

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text
          style={{ ...fonts.semi_bold20, color: colors.primary }}
          children={title}
        />
        <Text
          style={{
            ...fonts.regular16,
            marginVertical: 20,
            color: "#555",
            width: '80%',
            textAlign: "center"
          }}
          children={content}
        />
        <View style={{ ...styleView.rowItem, width: width - 80 }}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: '#CED4DA' }]}
            onPress={() => {
              navigation.pop()
            }}
            children={
              <Text style={{ ...fonts.semi_bold16, color: '#69747E' }}>
                {textCancel}
              </Text>
            }
          />
          <View style={{ width: 16 }} />
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={() => {
              navigation.pop()
              !!action && action()
            }}
            children={
              <Text style={{ ...fonts.semi_bold16, color: colors.white }}>
                {textConfirm}
              </Text>
            }
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    ...styleView.centerItem,
    width: width - 40,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 27,
  },
  btn: {
    ...styleView.centerItem,
    ...fonts.semi_bold16,
    flex: 1,
    height: 40,
    borderRadius: 12,
  },
})

export default ModalConfirm
