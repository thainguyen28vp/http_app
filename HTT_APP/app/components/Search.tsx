import React, { useCallback, forwardRef, LegacyRef } from 'react'
import {
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  StyleSheet,
  TextStyle,
  ImageURISource,
  Text,
  TouchableOpacity,
  TextInputProps,
} from 'react-native'
import R from '@app/assets/R'
import { colors, fonts, styleView } from '@app/theme'
import { Button } from '@component/Button/Button'
import FastImage from 'react-native-fast-image'
import { debounce } from 'lodash'
import NavigationUtil from '@app/navigation/NavigationUtil'
import _ from 'lodash'
// import { MAIN_FILLTER_MODAL, SCREEN_ROUTER_APP } from '@app/constant/Constant'

interface Props extends TextInputProps {
  placeholder?: string
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  leftIcon?: ImageURISource
  leftIconTintColor?: string
  clickable?: boolean
  onClick?: () => void
  onSearch?: (text: string) => void
  textStyle?: StyleProp<TextStyle>
  delay?: number
  placeholderColor?: string
  onPressBookmark?: () => void
  onSubmitEditing?: () => void
  onChangeText?: (text: string) => void
  chooseBookmarks?: boolean
  autoFocus?: boolean
}

const Search = forwardRef((props: Props, ref: LegacyRef<TextInput>) => {
  const {
    placeholder = 'Tìm kiếm',
    containerStyle,
    inputStyle,
    leftIcon = R.images.ic_home_search,
    leftIconTintColor,
    clickable,
    onClick,
    textStyle,
    delay = 300,
    placeholderColor = '#8898A7',
    onPressBookmark,
    chooseBookmarks,
    onSubmitEditing,
    autoFocus,
    onChangeText,
    onSearch,
    ...inputProps
  } = props

  const onSearchText = useCallback(
    _.debounce(text => onSearch!(text), delay),
    []
  )

  const searchView = () => {
    return (
      <View style={[styles.container, containerStyle]}>
        <FastImage
          style={{ width: 24, height: 24, marginLeft: 10 }}
          source={leftIcon}
          tintColor={!!leftIconTintColor ? leftIconTintColor : colors.black}
        />
        {!clickable ? (
          <TextInput
            {...inputProps}
            autoFocus={autoFocus}
            ref={ref}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={'search'}
            style={[styles.input, inputStyle]}
            placeholder={placeholder}
            onChangeText={text => {
              !!onChangeText && onChangeText(text)
              !!onSearch && onSearchText(text)
            }}
            placeholderTextColor={placeholderColor}
          />
        ) : (
          <Text
            style={[
              {
                ...fonts.regular16,
                color: '#8898A7',
                flex: 1,
                textAlignVertical: 'center',
              },
              textStyle,
            ]}
            children={placeholder}
          />
        )}
        {/* {onPressBookmark && (
          <TouchableOpacity onPress={onPressBookmark}>
            <FastImage
              source={
                chooseBookmarks
                  ? R.images.img_bookmark_checked
                  : R.images.img_bookmark
              }
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        )} */}
      </View>
    )
  }

  return !!clickable ? (
    <Button style={{ flex: 1 }} onPress={onClick!} children={searchView()} />
  ) : (
    searchView()
  )
})

const styles = StyleSheet.create({
  container: {
    ...styleView.rowItem,
    // paddingVertical: 11,
    // paddingHorizontal: 18,
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
  },
  input: {
    ...fonts.regular16,
    paddingTop: 0, // Android issue
    paddingBottom: 0, // Android issue
    flex: 1,
    alignSelf: 'center',
    alignContent: 'center',
    paddingHorizontal: 6,
    // marginVertical: 11,
  },
})

export default Search
