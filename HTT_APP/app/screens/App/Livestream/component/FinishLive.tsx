import R from '@app/assets/R'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import React, { memo } from 'react'
import isEqual from 'react-fast-compare'
import { Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { styles } from '../styles'
const FinishLive = memo(
  ({
    handleBackOffStream,
    statusLive,
  }: {
    statusLive: string | undefined
    handleBackOffStream: () => void
  }) => {
    return (
      <View style={styles.broadcasterVideoStateMessage}>
        <FastImage
          source={R.images.img_bg_live}
          style={{ width: WIDTH, height: HEIGHT }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(1,1,1,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <FastImage
                source={R.images.img_live}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
              <Text
                style={{
                  color: colors.white,
                  ...fonts.regular18,
                  marginVertical: 20,
                }}
                children={statusLive}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(240, 62, 62, 0.59)',
                  paddingVertical: 14,
                  paddingHorizontal: '10%',
                  borderRadius: 50,
                }}
                onPress={handleBackOffStream}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.white, ...fonts.semi_bold16 },
                  ]}
                >
                  Trở về
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FastImage>
      </View>
    )
  },
  isEqual
)

export default FinishLive
