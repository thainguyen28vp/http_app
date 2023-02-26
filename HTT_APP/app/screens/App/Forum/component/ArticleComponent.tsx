import React, { useState } from 'react'
import {
    ActivityIndicator,
    Button,
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    NativeMethods,
    SafeAreaView,
    Dimensions,
} from 'react-native'
import styles from '../styles/stylesArticleComponent'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import Modal from 'react-native-modal'


const { width, height } = Dimensions.get('window')
const scale = width / 375

const ArticleComponent = (props: any) => {
    // console.log('props', props);

    const [isShowModal, setIsShowModal] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [isShowCoppy, setIsShowCoppy] = useState(false)

    const clickMore = () => {

    }
    const clickLike = () => {
        setIsLike(!isLike)
    }

    const clickChatToDetail = () => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.DETAIL_ARTICLE, { item: props.item })
    }

    const clickShare = () => {
        setIsShowModal(!isShowModal)
    }

    const clickCoppy = () => {
        setIsShowModal(!isShowModal)
        setIsShowCoppy(!isShowCoppy)
        setTimeout(function () { setIsShowCoppy(false) }, 2000);

    }

    const renderImage = (arrayImage) => {

        switch (arrayImage?.length) {

            case 1:
                return (
                    <Image style={{ width: 345 * scale, height: 229 * scale, borderRadius: 5 * scale }} source={arrayImage[0]} />
                )
            case 2:
                return (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <Image style={{ width: 171 * scale, height: '100%', borderRadius: 5 * scale }} source={arrayImage[0]} />
                        </View>
                        <View>
                            <Image style={{ width: 171 * scale, height: '100%', borderRadius: 5 * scale, marginLeft: 3 }} source={arrayImage[0]} />
                        </View>
                    </View>
                )
            case 3:
                return (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <Image style={{ width: 229 * scale, height: '100%', borderRadius: 5 * scale }} source={arrayImage[0]} />
                        </View>
                        <View style={{ width: '100%', height: '100%', flex: 1, marginLeft: 3 * scale, justifyContent: 'space-between' }}>
                            <View>
                                <Image style={{ width: '100%', height: 113 * scale, borderRadius: 5 * scale }} source={arrayImage[1]} />
                            </View>
                            <View>
                                <Image style={{ width: '100%', height: 113 * scale, borderRadius: 5 * scale }} source={arrayImage[2]} />
                            </View>
                        </View>
                    </View>
                )
            default:
                break;
        }
    }
    return (
        <View style={styles.main}>
            <View style={styles.content}>
                <View style={styles.modalProduct}>
                    <View>
                        <Image style={styles.avatar} source={props?.item?.avatar} />
                    </View>
                    <View style={styles.viewName_Time}>
                        <Text style={styles.txtName}>{props?.item?.name}</Text>
                        <Text style={styles.txtTime}>{props?.item?.time}</Text>
                    </View>
                    <TouchableOpacity onPress={clickMore} style={{ alignItems: 'flex-start' }}>
                        <Image style={styles.icon_more} source={require('../../../../assets/images/icon_more.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 15 * scale, height: 229 * scale }}>
                    {
                        renderImage(props?.item?.image)
                    }
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 24 * scale, marginTop: 16 * scale }}>
                    <View style={{ width: 110 * scale, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={clickLike}>
                            <Image style={styles.img24} source={isLike ? require('../../../../assets/images/icon_heart_forum.png') : require('../../../../assets/images/icon_red_heart_forum.png')} />

                        </TouchableOpacity>
                        <Text style={styles.txtNumber}>{props?.item?.like}</Text>
                        <TouchableOpacity onPress={clickChatToDetail}>
                            <Image style={[styles.img24, { marginLeft: 10 * scale }]} source={require('../../../../assets/images/icon_chat_forum.png')} />
                        </TouchableOpacity>
                        <Text style={styles.txtNumber}>{props?.item?.sum_comment}</Text>
                    </View>
                    <TouchableOpacity onPress={clickShare}>
                        <Image style={styles.img24} source={require('../../../../assets/images/icon_respond_forum.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.viewComment}>
                    <Text style={styles.txtComment}>{props?.item?.comment}</Text>
                </View>
            </View>
            <Modal
                deviceWidth={width}
                deviceHeight={Platform.OS == "ios" ? height : require('react-native-extra-dimensions-android').get(
                    'REAL_WINDOW_HEIGHT',
                )}
                isVisible={isShowModal} onBackdropPress={() => setIsShowModal(false)} style={{}}>
                <View style={styles.viewModal}>
                    <TouchableOpacity style={styles.viewItem_Modal} onPress={clickCoppy}>
                        <Image style={styles.imgModal} source={require('../../../../assets/images/icon_chain.png')} />
                        <Text style={styles.txtCoppy}>Sao chép liên kết</Text>
                    </TouchableOpacity>
                    <View style={styles.viewLine}></View>
                    <TouchableOpacity style={styles.viewItem_Modal}>
                        <Image style={styles.imgModal} source={require('../../../../assets/images/icon_chat_forum.png')} />
                        <Text style={styles.txtCoppy}>Trả lời</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {
                isShowCoppy ?
                    <View style={styles.viewCoppy}>
                        <Image style={styles.imgCoppy} source={require('../../../../assets/images/icon_coppy.png')} />
                        <Text style={styles.txtCoppy02}>Đã sao chép địa chỉ liên kết</Text>
                    </View>
                    : null
            }

        </View>
    )
}

export default ArticleComponent


