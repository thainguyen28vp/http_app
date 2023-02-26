import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, dimensions, fonts, styleView } from '@app/theme'

type AlertProp = {
  title?: string
  content?: string
  action?: () => void
  text?: string
}

interface Props {
  navigation: any
  route: { params: AlertProp }
}

const { width } = dimensions

const ModalAlert = (props: Props) => {
  const {
    navigation,
    route: { params },
  } = props

  const title = params?.title || 'Thông báo'
  const content = params?.content
  const action = params?.action
  const text = params?.text || 'Ok'

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Text
          style={{ ...fonts.semi_bold20, color: colors.primary }}
          children={title}
        />
        <Text
          style={{ ...fonts.regular16, marginVertical: 20, color: "#555" }}
          children={content}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.pop()
            !!action && action()
          }}
          children={
            <View
              style={styles.btn}
              children={
                <Text style={{ ...fonts.semi_bold16, color: colors.white }}>
                  {text}
                </Text>
              }
            />
          }
        />
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
    width: width - 80,
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
})

export default ModalAlert
