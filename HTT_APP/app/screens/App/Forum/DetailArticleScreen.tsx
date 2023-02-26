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
    Dimensions
} from 'react-native'
import R from '@app/assets/R'
import styles from './styles/stylesDetailArticle'
import ArticleComponent from './component/ArticleComponent'
import Modal from 'react-native-modal'
import RNHeader from '@app/components/RNHeader'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'

const { width, height } = Dimensions.get('window')
const scale = width / 375

const DetailArticleScreen = (props: any) => {

    // ________________bai viet______________bai viet_____________________
    const [isShowTextInput, setIsShowTextInput] = useState(false)
    const [isShowModal, setIsShowModal] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [isShowCoppy, setIsShowCoppy] = useState(false)
    const [txtReply, setTxtReply] = useState('')
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

    const onClickReply = () => {
        setIsShowTextInput(!isShowTextInput)
    }

    const [image, setImage] = useState([
        'zxczc',
        'zxc',
        'zxc',
    ])
    const renderImage = (arrayImage) => {

        switch (arrayImage?.length) {

            case 1:
                return (
                    <Image style={{ width: 345 * scale, height: 229 * scale, borderRadius: 5 * scale }} source={arrayImage[0]} />
                )
            case 3:
                return (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View>
                            <Image style={{ width: 229 * scale, height: '100%', borderRadius: 5 * scale }} source={R.images.image_produc3} />
                        </View>
                        <View style={{ width: '100%', height: '100%', flex: 1, marginLeft: 3 * scale, justifyContent: 'space-between' }}>
                            <View>
                                <Image style={{ width: '100%', height: 113 * scale, borderRadius: 5 * scale }} source={R.images.img_product3_1} />
                            </View>
                            <View>
                                <Image style={{ width: '100%', height: 113 * scale, borderRadius: 5 * scale }} source={R.images.img_product3_1} />
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
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle="dark-content"
            />
            <RNHeader titleHeader='Bình luận ' back borderBottomHeader="transparent" />
            <View style={styles.viewContent}>
                <ScrollView>
                    <View style={{ marginTop: 1 * scale }}>
                        {/* Giao dien bai viet admin */}
                        <View style={styles.main01}>
                            <View style={styles.content}>
                                <View style={styles.modalProduct}>
                                    <View>
                                        <Image style={styles.avatar01} source={R.images.icon_comment} />
                                    </View>
                                    <View style={styles.viewName_Time}>
                                        <Text style={styles.txtName}>Nguyễn Thùy Trang</Text>
                                        <Text style={styles.txtTime01}>5 giờ trước</Text>
                                    </View>
                                    <TouchableOpacity onPress={clickMore} style={{ alignItems: 'flex-start' }}>
                                        <Image style={styles.icon_more01} source={R.images.icon_more} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 15 * scale, height: 229 * scale }}>
                                    {
                                        renderImage(image)
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 24 * scale, marginTop: 16 * scale }}>
                                    <View style={{ width: 110 * scale, flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={clickLike}>
                                            <Image style={styles.img24} source={isLike ? R.images.icon_heart_forum : R.images.icon_red_heart_forum} />

                                        </TouchableOpacity>
                                        <Text style={styles.txtNumber}>160</Text>
                                        <TouchableOpacity onPress={clickChatToDetail}>
                                            <Image style={[styles.img24, { marginLeft: 10 * scale }]} source={R.images.icon_chat_forum} />
                                        </TouchableOpacity>
                                        <Text style={styles.txtNumber}>30</Text>
                                    </View>
                                    <TouchableOpacity onPress={clickShare}>
                                        <Image style={styles.img24} source={R.images.icon_respond_forum} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.viewComment}>
                                    <Text style={styles.txtComment01}>Quần bò style trẻ trung xanh và trắng dự sẽ là mẫu váy hot hit của năm nha..Chất liệu đũi mềm mát, kiểu dáng basic siêu đỉnh luôn ạ..</Text>
                                </View>
                            </View>
                            <Modal
                                deviceWidth={width}
                                deviceHeight={Platform.OS == "ios" ? height : require('react-native-extra-dimensions-android').get(
                                    'REAL_WINDOW_HEIGHT',
                                )}
                                isVisible={isShowModal} onBackdropPress={() => setIsShowModal(false)} >
                                <View style={styles.viewModal}>
                                    <TouchableOpacity style={styles.viewItem_Modal} onPress={clickCoppy}>
                                        <Image style={styles.imgModal} source={R.images.icon_chain} />
                                        <Text style={styles.txtCoppy}>Sao chép liên kết</Text>
                                    </TouchableOpacity>
                                    <View style={styles.viewLine}></View>
                                    <TouchableOpacity style={styles.viewItem_Modal}>
                                        <Image style={styles.imgModal} source={R.images.icon_chat_forum} />
                                        <Text style={styles.txtCoppy}>Trả lời</Text>
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                            {
                                isShowCoppy ?
                                    <View style={styles.viewCoppy}>
                                        <Image style={styles.imgCoppy} source={R.images.icon_coppy} />
                                        <Text style={styles.txtCoppy02}>Đã sao chép địa chỉ liên kết</Text>
                                    </View>
                                    : null
                            }

                        </View>
                        {/* Giao dien bai viet admin  */}

                        {/* _______________Giao diện commmetn? ________________*/}
                        <View style={styles.viewMainComment}>
                            <View style={styles.viewContentComment}>
                                <View style={styles.view_avatar_name}>
                                    <Image style={styles.avatar} source={R.images.icon_comment} />
                                    <Text style={styles.txtAvatar}>Trần Thị Xuyến</Text>
                                </View>
                                <Text style={styles.txtComment}>Giá bao nhiêu đấy shop ơi !!!</Text>
                                <View style={styles.view_time_like_reply}>
                                    <Text style={styles.txtTime}>2 phút trước</Text>
                                    <TouchableOpacity>
                                        <Text style={[styles.txtTime, { marginLeft: 16 * scale }]}>Thích</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text style={[styles.txtTime, { marginLeft: 16 * scale }]}>Trả lời</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* _______________Giao diện tra loi ________________*/}
                                <View style={styles.view_reply}>
                                    <View style={styles.view_avatar_name}>
                                        <Image style={styles.avatar} source={R.images.icon_comment} />
                                        <Text style={styles.txtAvatar}>Trần Thị Xuyến</Text>
                                    </View>
                                    <Text style={styles.txtComment}>Tùy mẫu nha bạn, bạn có thể chọn sản phẩm thể tham khảo giá nhé. Thông tin gửi tới bạn.</Text>
                                    <View style={styles.view_time_like_reply}>
                                        <Text style={styles.txtTime}>1 phút trước</Text>
                                        <TouchableOpacity>
                                            <Text style={[styles.txtTime, { marginLeft: 16 * scale }]}>Thích</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={onClickReply}>
                                            <Text style={[styles.txtTime, { marginLeft: 16 * scale }]}>Trả lời</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* _______________Giao diện tra loi ________________*/}
                            </View>
                        </View>
                        {/* _______________Giao diện commmetn? ________________*/}
                    </View>
                </ScrollView>
            </View>

            {
                isShowTextInput ?
                    <View style={styles.viewInputComment}>
                        <Image style={styles.img32} source={R.images.icon_comment} />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Nhập bình luận'
                            placeholderTextColor='#8C8C8C'
                            value={txtReply}
                            onChangeText={txtReply => setTxtReply(txtReply)}
                        />
                        <TouchableOpacity>
                            <Image style={styles.img24} source={R.images.icon_sent_comment} />
                        </TouchableOpacity>
                    </View>
                    : null
            }


        </View>
    )
}

export default DetailArticleScreen
