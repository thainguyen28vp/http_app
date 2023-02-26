import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R';

const {width, height} = Dimensions.get('window');
const scale = width / 375;

export default StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: 'white',
      
    },
    viewName: {
      marginTop: 25 * scale,
      flexDirection: 'row',
      // backgroundColor: 'yellow'
    },
    viewName2: {
      marginTop: 16 * scale,
      flexDirection: 'row',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20 * scale,
      // marginTop:20*scale,
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
      color:'#262626'
    },
    viewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 30 * scale,
      paddingHorizontal: 20 * scale,
    },
    viewAvatar: {
      alignSelf: 'center',
      marginTop: 25 * scale,
      width: 100 * scale,
      height: 100 * scale,
      borderRadius: 50 * scale,
      justifyContent: 'flex-end',
      flex: 1,
    },
    iconShow: {
      width: 24 * scale,
      height: 24 * scale,
    },
    camera: {
      width: 26 * scale,
      height: 26 * scale,
    },
    avatar: {
      width: 100 * scale,
      height: 100 * scale,
      borderRadius: 50 * scale,
    },
    btnCamera: {
      width: 26 * scale,
      height: 26 * scale,
      position: 'absolute',
      alignSelf: 'flex-end',
    },
    txtField: {
      fontFamily:R.fonts.sf_regular,
      // fontStyle: 'normal',
      fontSize: 16 * scale,
      lineHeight: 22 * scale,
      color: '#262626',
    },
    txtError: {
      fontFamily:R.fonts.sf_regular,
      // fontStyle: 'normal',
      fontSize: 16 * scale,
      lineHeight: 22 * scale,
      color: 'red',
      marginLeft: 35 * scale,
    },
    txtIconRed: {
      fontFamily:R.fonts.sf_regular,
      // fontStyle: 'normal',
      fontSize: 14 * scale,
      lineHeight: 22 * scale,
      color: '#F03E3E',
      marginLeft: 4 * scale,
    },
    viewTextInput: {
      marginTop: 16 * scale,
      flexDirection: 'row',
      alignItems: 'center',
      // backgroundColor: 'red'
    },
    btnShow: {
      // alignSelf: 'flex-end'
    },
    iconName: {
      width: 20 * scale,
      height: 20 * scale,
    },
    iconLock: {
      width: 17 * scale,
      height: 20 * scale,
    },
    txtInput: {
      marginLeft: 15 * scale,
      width: 300 * scale,
      fontSize:16*scale,
      fontFamily:R.fonts.sf_regular,
      // color:'#8C8C8C'
    },
    txtInputPassWord: {
      fontSize:16*scale,
      fontFamily:R.fonts.sf_regular,
      marginLeft: 15 * scale,
      width: 276 * scale,
    },
    viewLine: {
      borderWidth: 1 * scale,
      borderColor: '#BFBFBF',
      width: 335 * scale,
      marginTop: 11 * scale
    },
    btnRegister: {
      width: 295 * scale,
      height: 45 * scale,
      backgroundColor: '#F03E3E',
      borderRadius: 10 * scale,
      marginTop: 40 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 30 * scale,
    },
    txtRegister: {
      fontSize: 16 * scale,
      fontFamily:R.fonts.sf_semi_bold,
      // fontStyle: 'normal',
      textAlign: 'center',
      color: '#FAFAFA',
    },
  });