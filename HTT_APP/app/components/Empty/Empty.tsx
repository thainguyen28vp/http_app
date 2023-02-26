import React, { Component } from 'react'
import {
  Dimensions,
  ImageStyle,
  ScrollViewProps,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import FastImage, { Source } from 'react-native-fast-image'
import R from '@app/assets/R'
import { ScrollView } from 'react-native'
import { RefreshControl } from 'react-native'
import { colors } from '@app/theme'

const { width, height } = Dimensions.get('window')

interface EmptyProps extends ScrollViewProps {
  header?: JSX.Element
  sourceImage?: Source | number
  description?: string
  marginTop?: number | string
  zIndex?: number
  onRefresh?: () => void
  backgroundColor?: string
  imageStyle?: ImageStyle
}

export default class Empty extends Component<EmptyProps> {
  state = {
    marginTop: height / 5,
  }

  render() {
    const {
      header,
      sourceImage,
      description,
      marginTop,
      onRefresh,
      zIndex,
      backgroundColor = colors.white,
      imageStyle,
      ...props
    } = this.props
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: backgroundColor, zIndex }}
        contentContainerStyle={{
          flex: 1,
        }}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        {...props}
      >
        <View
          onLayout={event => {
            const result = header
              ? event.nativeEvent.layout.height / 2
              : event.nativeEvent.layout.height
            this.setState({ marginTop: result })
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: backgroundColor || colors.white,
            marginTop: marginTop || height * 0.2,
            // justifyContent: 'center'
          }}
        >
          <FastImage
            source={sourceImage || R.images.ic_empty}
            style={[styles.imageEmpty, imageStyle]}
            resizeMode={'contain'}
          />
          <Text style={styles.textEmpty}>
            {description || 'Danh sách trống!'}
          </Text>
        </View>
      </ScrollView>
    )
  }
}
console.log(width / 1.3)

const styles = StyleSheet.create({
  imageEmpty: {
    width: width / 1.4,
    height: height / 3,
  },
  textEmpty: {
    fontFamily: R.fonts.sf_regular,
    fontSize: 16,
    color: '#69747E',
    marginTop: 10,
  },
})
