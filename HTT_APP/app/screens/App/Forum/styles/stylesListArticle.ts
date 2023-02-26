import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R';

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
        color:'#373E50'
      },
      viewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30 * scale,
        paddingHorizontal: 20 * scale,
        backgroundColor:'#FFFFFF'
      },
      container_search: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15*scale,
        marginTop:1*scale
    },
    input_container: {
        marginLeft: 0,
        backgroundColor: '#F1F3F5',
        borderRadius: 50,
        borderWidth: 0,
        width: width - 30
    },
    icon_forum:{
        width:54*scale,
        height:54*scale,
    },
    btnIcon_forum:{
        position:'absolute',
        bottom:20*scale,
        right:15*scale
    },
    scrollview:{
        marginTop:1*scale,
        flex:1,
        // paddingBottom:50*scale,
        // backgroundColor:'green'
        // marginBottom:150*scale
    },
    txtMenu:{
      fontFamily:R.fonts.sf_regular,
      fontSize:15*scale,
      lineHeight:22*scale,
      fontWeight:'500',
      // marginLeft:16*scale
    }
})