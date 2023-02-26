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
        backgroundColor:'#FFFFFF',
      },
      viewContent:{ 
        backgroundColor: '#F1F3F5', 
        flex: 1,
        marginTop: 6 * scale,
    },
    viewPost:{
        width:'100%',
        // height:237*scale,
        backgroundColor:'#FFFFFF',
        marginTop:10*scale
    },
    view_name_image_status:{
        height:60*scale,
        paddingLeft:15*scale,
        paddingTop:15*scale,
        flexDirection:'row',
    },
    img46:{
        width:46*scale,
        height:46*scale,
    },
    viewStatus:{
        marginLeft:12*scale,
    },
    txtName:{
        fontSize:16*scale,
        lineHeight:24*scale,
        fontFamily:R.fonts.sf_semi_bold,
        color:'#262626',
    },
    viewStatus2:{
        flexDirection:'row',
        marginTop:6*scale,
        alignItems:'center',
    },
    viewStatus3:{
        width:115*scale,
        height:28*scale,
        backgroundColor:'#E8E8E8',
        flexDirection:'row',
        borderRadius:12*scale,
        alignItems:'center',
        justifyContent:'center'
    },
    txtStatus:{
        fontSize:14*scale,
        lineHeight:22*scale,
        fontFamily:R.fonts.sf_semi_bold,
        color:'#595959',
    },
    icon_down_arrow:{
        width:20*scale,
        height:20*scale,
        marginLeft:6*scale,
    },
    viewTextInput:{
        marginTop:15*scale,
    },
    textInput:{
        height:110*scale,
        textAlignVertical: 'top',
        paddingLeft:30*scale,
    },
    viewBottom:{
        height:50*scale,
        width:width,
        flexDirection:'row',
        alignItems:'center',
        borderTopWidth:1*scale,
        borderBottomWidth:1*scale,
        borderColor:'#D9D9D9'
        // flex:1
    },
    view_item_bottom:{
        height:'100%',
        flex:1/3,
        // backgroundColor:'red',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    txtItemBottom:{
        fontSize:16*scale,
        lineHeight:24*scale,
        fontFamily:R.fonts.sf_regular,
        color:'#595959',
        marginLeft:4*scale,
    },
    txtItemBottom2:{
        fontSize:16*scale,
        lineHeight:24*scale,
        fontFamily:R.fonts.sf_regular,
        color:'#FFFFFF',
    },
    icon24:{
        width:24*scale,
        height:24*scale,
    },
    line_bottom:{
        height:20*scale,
        width:1*scale
    },
    btnPost:{
        width:99*scale,
        height:32*scale,
        backgroundColor:'#F03E3E',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:50*scale,
    },
})