import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R'
import { fonts } from '@app/theme'

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 34 * scale,
    marginTop: 20 * scale,
  },
  icon_back: {
    width: 6 * scale,
    height: 12 * scale,
    // marginTop: 25 * scale,
  },
  register: {
    fontWeight: '600',
    // fontStyle: 'normal',
    fontSize: 18 * scale,
    lineHeight: 26 * scale,
    color: '#373E50',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10 * scale,
  },
  txtDescription: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 22 * scale,
    textAlign: 'center',
    marginTop: 50 * scale,
    color: '#373E50',
  },
  viewName2: {
    marginTop: 50 * scale,
    flexDirection: 'row',
  },
  txtField: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 22 * scale,
    color: '#262626',
  },
  txtError: {
    fontFamily: R.fonts.sf_regular,
    fontStyle: 'normal',
    fontSize: 16 * scale,
    lineHeight: 22 * scale,
    color: 'red',
    marginTop: 10 * scale,
  },
  txtIconRed: {
    fontFamily: R.fonts.sf_semi_bold,
    fontStyle: 'normal',
    fontSize: 14 * scale,
    lineHeight: 22 * scale,
    color: '#F03E3E',
    marginLeft: 4 * scale,
  },
  viewTextInput: {
    marginTop: 14 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  iconName: {
    width: 20 * scale,
    height: 20 * scale,
  },
  viewLine: {
    borderWidth: 1 * scale,
    borderColor: '#BFBFBF',
    width: 335 * scale,
    marginTop: 7 * scale,
  },
  btnRegister: {
    width: 310 * scale,
    height: 45 * scale,
    backgroundColor: '#E84343',
    borderRadius: 50 * scale,
    marginTop: 40 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30 * scale,
  },
  txtRegister: {
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_semi_bold,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#FAFAFA',
  },
  modal: {
    width: 335 * scale,
    height: 312 * scale,
    borderRadius: 16 * scale,
    backgroundColor: 'white',
    position: 'absolute',
    shadowOpacity: 0.5,
    shadowColor: '#000000',
    alignSelf: 'center',
  },
  imgModalSent: {
    width: 83 * scale,
    height: 56 * scale,
    marginTop: '8%',
    alignSelf: 'center',
  },
  txtModalNoti: {
    fontSize: 20 * scale,
    lineHeight: 28 * scale,
    fontWeight: '600',
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#373E50',
    marginTop: 22 * scale,
  },
  txtModalDescription: {
    lineHeight: 24 * scale,
    textAlign: 'center',
    color: '#373E50',
    marginTop: '8%',
    marginHorizontal: 20,
    ...fonts.medium16,
  },
  btnModal: {
    width: 159 * scale,
    height: 40 * scale,
    backgroundColor: '#E84343',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: '12%',
    borderRadius: 50 * scale,
  },
  txtBtnModal: {
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_semi_bold,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#FAFAFA',
  },
  txtInput: {
    marginLeft: 15 * scale,
    width: 300 * scale,
    fontSize: 16 * scale,
    fontFamily: R.fonts.sf_regular,
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
