import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import stylesHome from '../styles/stylesHome'
import { colors, fonts, WIDTH } from '@app/theme'
import ProgressBar from 'react-native-progress/Bar'
import { useAppSelector } from '@app/store'

const LoadingDataCodePush = () => {
  const CodePushReducer = useAppSelector(state => state.CodePushReducer)

  return CodePushReducer?.data ? (
    <View style={stylesHome.vLoadData}>
      <Text
        style={{ marginBottom: 10, ...fonts.semi_bold12 }}
        children={'Bản cập nhật mới'}
      />
      <ProgressBar
        progress={CodePushReducer?.data}
        width={WIDTH - 80}
        height={1.8}
        color={colors.primary}
      />
      <Text
        style={{
          ...fonts.medium10,
          textAlign: 'center',
          marginVertical: 8,
          color: colors.primary,
        }}
        children={`Đang tải dữ liệu ${Math.round(
          CodePushReducer?.data * 100
        )}%`}
      />
    </View>
  ) : (
    <></>
  )
}

export default LoadingDataCodePush
