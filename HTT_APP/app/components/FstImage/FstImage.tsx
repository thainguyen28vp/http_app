import React, { useMemo, useState } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleProp,
  ImageStyle,
  StyleSheet,
  Text,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { ColorDefault, colors, fonts } from '@app/theme'
import R from '@app/assets/R'
import { ImageProps } from './FstImage.props'
import { enhance } from '@app/common'
import { Block } from '../Block/Block'
import { useImmer } from 'use-immer'

type ImageState = {
  loaded: boolean
  waiting: boolean
  failed: boolean
  loading: boolean
}

const MyFstImage: React.FC<ImageProps> = (props: ImageProps) => {
  const [imageState, setImageState] = useImmer<ImageState>({
    loaded: false,
    waiting: true,
    failed: false,
    loading: false,
  })
  // const [reloadKey, useReloadKey] = useState(new Date().getTime().toString())
  // const reloadImage = () => {
  //   useReloadKey(new Date().getTime().toString())
  // }
  const {
    style: styleOverride = {},
    resizeMode = 'contain',
    containerStyle,
  } = props
  var { source } = props
  const style: StyleProp<ImageStyle> = useMemo(
    () => styleOverride,
    [styleOverride]
  )

  const imageSource = React.useMemo(() => {
    if (typeof source === 'object') {
      return source.uri
        ? {
            ...source,
            priority: FastImage.priority.high,
            uri: source.uri,
          }
        : props.defaultSource || R.images.image_logo
    }
    return source
  }, [source, props.defaultSource])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setImageState(draft => {
        draft.waiting = false
      })
    }, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  React.useEffect(() => {
    if (!imageState.waiting && !imageState.loaded) {
      const loadStart = () => {
        setImageState(draft => {
          draft.failed = false
          draft.loading = true
        })
      }
      loadStart()
    }
  }, [imageState.waiting, imageState.loaded, setImageState])

  const handleLoadEnd = React.useCallback(() => {
    setImageState(draft => {
      draft.failed = false
      draft.loaded = true
      draft.loading = false
    })
  }, [setImageState])
  const handleError = React.useCallback(() => {
    setImageState(draft => {
      draft.failed = true
      draft.loading = false
    })
  }, [setImageState])
  return (
    <Block style={containerStyle}>
      <FastImage
        {...props}
        style={style}
        resizeMode={resizeMode}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        source={imageSource}
      >
        {imageState.loading ? (
          <View style={styles.containerLoading}>
            <ActivityIndicator color={colors.primary} style={styles.flex} />
          </View>
        ) : imageState.failed ? (
          <TouchableOpacity
            style={styles.containerReload}
            // onPress={reloadImage}
          >
            <Image
              style={styles.imageRetry}
              source={R.images.ic_add}
              resizeMode="center"
            />
          </TouchableOpacity>
        ) : (
          props.children
        )}
      </FastImage>
    </Block>
  )
}

const FstImage = React.memo(MyFstImage)
export default FstImage

const styles = StyleSheet.create({
  containerLoading: {
    backgroundColor: 'transparent',
    flex: 1,
    overflow: 'hidden',
  },
  containerReload: {
    flex: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  imageRetry: {
    alignSelf: 'center',
  },
})
