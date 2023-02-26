import React from 'react'
import { colors, styleView } from '@app/theme'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Button } from '@component/Button/Button'
import FastImage from 'react-native-fast-image'
import R from '@app/assets/R'
import { MaterialIndicator } from 'react-native-indicators'
import { StyleProp } from 'react-native'

interface Props extends TextInputProps {
  showTrashView?: boolean
  onTrashPress?: () => void
  onIncreasePress: () => void
  onDecreasePress: () => void
  dialogLoading?: boolean
  containerStyle?: StyleProp<ViewStyle>
  minusBtnStyle?: StyleProp<ViewStyle>
  plusBtnStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
}

const QuantityCounter = (props: Props) => {
  const {
    showTrashView,
    onTrashPress,
    onIncreasePress,
    onDecreasePress,
    dialogLoading,
    containerStyle,
    minusBtnStyle,
    plusBtnStyle,
    inputStyle,
    ...inputProps
  } = props

  const leftBtnStyle = !!minusBtnStyle
    ? [{ ...styles.btnControlAmount }, minusBtnStyle]
    : {
        ...styles.btnControlAmount,
        borderTopLeftRadius: 7,
        borderBottomLeftRadius: 7,
      }

  const rightBtnStyle = !!plusBtnStyle
    ? [{ ...styles.btnControlAmount }, plusBtnStyle]
    : {
        ...styles.btnControlAmount,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
      }

  const loadingView = () => (
    <View style={styles.loading}>
      <MaterialIndicator size={20} color={colors.primary} />
    </View>
  )

  return (
    <View
      style={[
        {
          ...styleView.rowItem,
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <View style={{ ...styleView.rowItem, alignItems: 'center' }}>
        <View
          style={{
            ...styleView.rowItem,
            ...styleView.centerItem,
            marginRight: 15,
          }}
        >
          <Button
            onPress={onDecreasePress}
            children={
              <View
                style={leftBtnStyle}
                children={
                  <FastImage
                    style={{ width: 16, height: 16 }}
                    source={R.images.ic_minus}
                  />
                }
              />
            }
          />
          {/* <View
          style={styles.inputView}
          children={ */}
          <TextInput
            {...inputProps}
            contextMenuHidden
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
            style={[
              {
                color: '#262626',
                textAlign: 'center',
                width: 40,
                height: 30,
                paddingVertical: 0,
                backgroundColor: '#F5F5F5',
              },
              inputStyle,
            ]}
          />
          {/* }
        /> */}
          <Button
            onPress={onIncreasePress}
            children={
              <View
                style={rightBtnStyle}
                children={
                  <FastImage
                    style={{ width: 16, height: 16 }}
                    source={R.images.ic_plus}
                  />
                }
              />
            }
          />
        </View>
        {dialogLoading && loadingView()}
      </View>
      {showTrashView && (
        <Button
          onPress={onTrashPress!}
          children={
            <View
              style={styles.trashView}
              children={
                <FastImage
                  style={{ width: 20, height: 20 }}
                  source={R.images.ic_trash}
                />
              }
            />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  btnControlAmount: {
    ...styleView.centerItem,
    width: 32,
    height: 30,
    borderWidth: 1,
    borderColor: '#ECEBED',
  },
  trashView: {
    ...styleView.centerItem,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECEBED',
  },
  inputView: {
    width: 40,
    borderColor: '#ECEBED',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    // height: 30,
    backgroundColor: 'red',
  },
  loading: {
    marginRight: 10,
  },
})

export default QuantityCounter
