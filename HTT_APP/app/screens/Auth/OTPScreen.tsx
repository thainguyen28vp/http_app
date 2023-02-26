import R from '@app/assets/R'
import { Otp } from '@app/components'
import LoadingProgress from '@app/components/LoadingProgress'
import ScreenWrapper from '@app/components/Screen/ScreenWrapper'
import { SCREEN_ROUTER_AUTH } from '@app/config/screenType'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { colors, fonts } from '@app/theme'
import React, { memo, useState } from 'react'
import isEqual from 'react-fast-compare'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
interface OTPScreenProps {
  navigateSwitch: any
}
const OTPScreenComponent = (props: OTPScreenProps) => {
  const [dataOtp, setDataOtp] = useState('')
  const [isFetchingData, setIsFetchingData] = useState(false)
  const onSubmit = async () => {
    const payload = {
      verify_code: dataOtp,
    }
    NavigationUtil.navigate(SCREEN_ROUTER_AUTH.UPDATE_PASS, { otp: props?.route?.params?.otp })
  }
  return (
    <>
      <ScreenWrapper
        style={{ flex: 1, paddingHorizontal: '10%' }}
        back
        color={colors.black}
        forceInset={['left']}
        backgroundColor={colors.white}
        titleHeader="OTP"
        backgroundHeader={colors.white}
        borderBottomHeader={colors.white}
      >
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title} children={R.strings().otp_mess} />
          <Otp
            textStyle={styles.textStyle}
            containerStyle={styles.containerOtp}
            length={4}
            onOtpValid={(text: any) => {
              setDataOtp(text)
            }}
          />
          <TouchableOpacity
            style={styles.btn_confirm}
            children={<Text style={styles.txt_confirm} children={R.strings().send} />}
            onPress={onSubmit}
          />
        </KeyboardAwareScrollView>
      </ScreenWrapper>
      {isFetchingData && <LoadingProgress />}
    </>
  )


}
const styles = StyleSheet.create({
  title: {
    ...fonts.regular16,
    marginTop: '6%',
    textAlign: 'center',
  },
  containerOtp: {
    marginTop: '20%',
  },
  btn_confirm: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginTop: '30%',
    borderRadius: 25,
  },
  textStyle: {
    ...fonts.semi_bold28,
    color: 'black',
  },
  txt_confirm: {
    ...fonts.semi_bold20,
    color: colors.white,
    paddingVertical: 12,
  },
})

const OTPScreen = memo(OTPScreenComponent, isEqual)

const mapStateToProps = (state: any) => ({

})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(OTPScreen)