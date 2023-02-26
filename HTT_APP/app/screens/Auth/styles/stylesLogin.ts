import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import {
  colors,
  dimensions,
  fonts,
  HEIGHT,
  styleView,
  WIDTH,
} from '@theme/index'

const { width, height } = Dimensions.get('window')
const scale = width / 375
export default StyleSheet.create({
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40 * scale,
  },
  txtLogin: {
    fontSize: 20 * scale,
    lineHeight: 24 * scale,
    color: '#262626',
    textAlign: 'center',
    marginTop: 5 * scale,
    fontFamily: R.fonts.sf_semi_bold,
  },
  viewName: {
    marginTop: 25 * scale,
    flexDirection: 'row',
    // backgroundColor: 'yellow'
  },
  txtField: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 18 * scale,
    color: '#262626',
  },
  txtOr: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 20 * scale,
    color: '#262626',
    alignSelf: 'center',
    marginTop: 16 * scale,
  },
  txtError: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 22 * scale,
    color: 'red',
    marginLeft: 35 * scale,
  },
  txtIconRed: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 14 * scale,
    lineHeight: 22 * scale,
    color: '#F03E3E',
    marginLeft: 4 * scale,
  },
  viewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15 * scale,
  },
  iconName: {
    width: 16 * scale,
    height: 18 * scale,
  },
  txtInput: {
    marginLeft: 15 * scale,
    width: 250 * scale,
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
  },
  txtInputPassWord: {
    marginLeft: 15 * scale,
    width: 246 * scale,
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
  },
  viewLine: {
    borderWidth: 1 * scale,
    borderColor: '#1290CC',
    width: 295 * scale,
    marginTop: 10 * scale,
  },
  btnRegister: {
    width: 290 * scale,
    height: 50 * scale,
    backgroundColor: colors.primary,
    borderRadius: 50 * scale,
    marginTop: 32 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // marginBottom: 30 * scale,
  },
  btnRegister2: {
    width: 290 * scale,
    height: 50 * scale,
    borderRadius: 50 * scale,
    marginTop: 16 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1 * scale,
    borderColor: '#F03E3E',
    marginBottom: 40 * scale,
  },
  txtRegister: {
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_semi_bold,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#FAFAFA',
    lineHeight: 21 * scale,
  },
  txtRegister2: {
    fontSize: 16 * scale,
    lineHeight: 21 * scale,
    fontFamily: R.fonts.sf_semi_bold,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#F03E3E',
  },
  viewName2: {
    marginTop: 16 * scale,
    flexDirection: 'row',
  },
  btnShow: {
    width: 24 * scale,
    height: 24 * scale,
  },
  iconLock: {
    width: 16 * scale,
    height: 20 * scale,
  },
  txtForgotPass: {
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
    lineHeight: 22 * scale,
    alignSelf: 'flex-end',
    color: '#F03E3E',
    marginTop: 16 * scale,
  },
  imageLogin: {
    alignSelf: 'center',
    width: 200 * scale,
    height: 132 * scale,
    marginTop: 149 * scale,
  },
  iconShow: {
    width: 24 * scale,
    height: 24 * scale,
  },
  labelInput: {
    ...fonts.regular16,
    fontWeight: '400',
    color: '#262626',
    marginBottom: 10 * scale,
  },
  inputContainer: {
    paddingHorizontal: 0,
  },
})
