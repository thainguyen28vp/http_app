import { Dimensions, StyleSheet } from 'react-native'
import R from '@app/assets/R';

const { width, height } = Dimensions.get('window')
const scale = width / 375

export default StyleSheet.create({
    main: {
        // flex: 1,
        backgroundColor: '#FFFFFF',
        width:'100%',
        height:480*scale,
        marginBottom:10*scale,
        marginTop:-3,
      },
    content:{
        paddingHorizontal:15*scale,
        // paddingVertical:15*scale,
        // backgroundColor:'red'
    },
    modalProduct: {
        height: 40 * scale,
        marginTop: 20 * scale,
        flexDirection: 'row',
        // justifyContent:'space-between'
    },
    txtTime: {
        fontSize: 12 * scale,
        lineHeight: 20 * scale,
        color: '#8C8C8C',
        fontFamily:R.fonts.sf_regular,       
    },
    icon_more:{
        width:20*scale,
        height:20*scale
    },
    avatar:{ width: 40 * scale, 
        height: 40 * scale, 
        borderRadius: 20 * scale 
    },
    viewName_Time:{ 
        width: 265 * scale,
        justifyContent: 'flex-start', 
        marginLeft: 15 * scale, 
        //  backgroundColor: 'yellow' 
    },
    txtName:{ 
        fontSize: 15 * scale, 
        lineHeight: 22 * scale, 
        color: '#262626' ,
        fontFamily:R.fonts.sf_semi_bold
    },
    txtComment:{
        fontSize:16*scale,
        lineHeight:24*scale,
        color:'#262626',
        fontFamily:R.fonts.sf_regular
    },
    viewComment:{
        //  backgroundColor: 'yellow', 
         width: 315 * scale, 
         height: 96 * scale,
          marginTop: 14 * scale,
    },
    img24:{
         width: 24 * scale, 
         height: 24 * scale 
    },
    img20:{
         width: 20 * scale,
          height: 20 * scale 
    },
    txtNumber:{ 
        marginLeft: 4 * scale ,
        fontSize:16*scale,
        lineHeight:24*scale,
        color:'#262626',
        fontFamily:R.fonts.sf_regular
    },
    viewModal:{
        position: 'absolute',
        shadowOpacity: 0.5,
        shadowColor: '#000000',
        height: 121 * scale, 
        width: 359 * scale, 
        backgroundColor: '#FFFFFF', 
        borderRadius: 15 * scale,
        alignSelf:'center',
        bottom:25*scale,
    },
    viewItem_Modal:{
        width:'100%',
        height:60*scale,
        flexDirection:'row',
        alignItems:'center',
    },
    viewLine:{
        width:'100%',
        borderWidth:1*scale,
        borderColor:'#BFBFBF'
    },
    txtCoppy:{
        color:'#262626',
        fontSize:16*scale,
        lineHeight:24*scale,
        fontFamily:R.fonts.sf_regular,
        marginLeft:18*scale,

    },
    imgModal:{
        marginLeft:18*scale,
        width:24*scale,
        height:24*scale,
    },
    viewCoppy:{
        position: 'absolute',
        shadowOpacity: 1,
        shadowColor: '#FFFFFF',
        height: 44 * scale, 
        width: 329 * scale, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        borderRadius: 10 * scale,
        alignSelf:'center',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        top:'47%',
    },
    imgCoppy:{
        width:18*scale,
        height:20*scale,
    },
    txtCoppy02:{
        color:'#FFFFFF',
        fontSize:15*scale,
        lineHeight:20*scale,
        fontFamily:R.fonts.sf_regular,
        marginLeft:10*scale,
    }
})