import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R';

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20 * scale,
    marginTop: 15 * scale,
  },
  icon_back: {
    width: 6 * scale,
    height: 12 * scale,
    // marginTop: 25 * scale,
  },
  register: {
    fontFamily:R.fonts.sf_semi_bold,
    // fontStyle: 'normal',
    fontSize: 18 * scale,
    lineHeight: 26 * scale,
    // position: 'absolute',
    // alignSelf: 'center',
  },
  viewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25 * scale,
  },
  viewStar: {
    width: 315 * scale,
    height: 38 * scale,
    borderRadius: 16 * scale,
    marginTop: 16 * scale,
    backgroundColor: '#F1F3F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  txtValueStar: {
    fontSize: 16 * scale,
    lineHeight: 24 * scale,
    color: '#262626',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
    marginLeft: 12 * scale,
  },
  txtRates: {
    fontSize: 16 * scale,
    lineHeight: 24 * scale,
    color: '#595959',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
    marginLeft: 12 * scale,
  },
  viewRate1_5: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt1_5: {
    fontSize: 14 * scale,
    lineHeight: 22 * scale,
    color: '#262626',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
  },
  progress: {
    width: 296 * scale,
    height: 10 * scale,
    marginLeft: 10 * scale,
    borderRadius: 10 * scale,
  },
  viewline: {
    width: '100%',
    borderWidth: 1 * scale,
    borderColor: '#CED4DA',
    marginTop: 21 * scale,
  },
  modalProduct: {
    height: 40 * scale,
    marginTop: 20 * scale,
    flexDirection: 'row',
  },
  txtTime: {
    fontSize: 12 * scale,
    lineHeight: 20 * scale,
    color: '#69747E',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
  },
  txtComment: {
    fontSize: 15 * scale,
    lineHeight: 22 * scale,
    color: '#262626',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
    marginTop: 16 * scale,
  },
  imgComment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12 * scale,
  },
  imgReview: {
    width: 75 * scale,
    height: 75 * scale,
    borderRadius: 10 * scale,
  },
  txtType: {
    fontSize: 14 * scale,
    lineHeight: 22 * scale,
    color: '#69747E',
    fontFamily:R.fonts.sf_regular,
    // fontStyle: 'normal',
  },
})
