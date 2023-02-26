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
import styles from './styles/stylesPostArticle'
import ImagePicker from 'react-native-image-crop-picker';
import { FlatList } from 'react-native-gesture-handler';
import RNHeader from '@app/components/RNHeader'


const { width, height } = Dimensions.get('window')
const scale = width / 375


const PostArticleScreen = (props) => {
    const [state, setState] = useState({
        status: 'công khai',
        type: 'bán hàng',
        content: '',
        list_image: [],
    })

    // open camera
    const pickImageCamera = () => {
        let dataFetch = [...state.list_image]
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(async image => {
            // await console.log(' image camera', image);
            await dataFetch.push(image.path)
            // await console.log('dataFetch.length', dataFetch.length);
            await setState({ ...state, list_image: dataFetch })
            // await console.log('state.list_image', state.list_image);

        });

    }

    // multiple pick
    const pickImageGallery = () => {
        let dataFetch = [...state.list_image]
        ImagePicker.openPicker({
            multiple: true
        }).then(async images => {
            // await console.log('images gallery', images);
            await images.forEach(element => {
                dataFetch.push(element.path)
            })
            // await console.log('dataFetch.length', dataFetch.length);
            await setState({ ...state, list_image: dataFetch })
            // await console.log('state.list_image.length', state.list_image.length);

        });
    }

    const deleteImage = (index) => {
        let dataFetch = [...state.list_image]
        dataFetch.splice(index, 1)
        setState({ ...state, list_image: dataFetch })
    }
    return (
        <View style={styles.main}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle="dark-content"
            />
            <RNHeader titleHeader='Tạo bài viết' back borderBottomHeader="transparent" />
            <View style={styles.viewContent}>
                <View style={styles.viewPost}>
                    <View style={styles.view_name_image_status}>
                        <Image style={styles.img46} source={R.images.icon_comment} />
                        <View style={styles.viewStatus}>
                            <Text style={styles.txtName}>Nguyễn Thùy Trang</Text>
                            <View style={styles.viewStatus2}>
                                <TouchableOpacity style={styles.viewStatus3}>
                                    <Text style={styles.txtStatus}>Công khai</Text>
                                    <Image style={styles.icon_down_arrow} source={R.images.icon_downArrow} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.viewStatus3, { marginLeft: 6 * scale }]}>
                                    <Text style={styles.txtStatus}>Bán hàng</Text>
                                    <Image style={styles.icon_down_arrow} source={R.images.icon_downArrow} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewTextInput}>
                        <TextInput
                            placeholder='Mô tả bài đăng của bạn'
                            multiline={true}
                            numberOfLines={10}
                            placeholderTextColor='#8C8C8C'
                            onChangeText={content => setState({ ...state, content })}
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.viewBottom}>
                        <TouchableOpacity style={styles.view_item_bottom} onPress={pickImageCamera}>
                            <Image style={styles.icon24} source={R.images.icon_camera_post} />
                            <Text style={styles.txtItemBottom}>Camera</Text>
                        </TouchableOpacity>
                        <Image style={styles.line_bottom} source={R.images.line_bottom} />
                        <TouchableOpacity style={styles.view_item_bottom} onPress={pickImageGallery}>
                            <Image style={styles.icon24} source={R.images.icon_image_post} />
                            <Text style={styles.txtItemBottom}>Hình ảnh</Text>
                        </TouchableOpacity>
                        <View style={styles.view_item_bottom}>
                            <TouchableOpacity style={styles.btnPost}>
                                <Text style={styles.txtItemBottom2}>Đăng bài</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* khu vực hiện ảnh */}
                {/* <ScrollView> */}
                {/* <Text style={{ textAlign: 'center', marginTop: 20 * scale, fontSize: 14 }}>Ảnh đã chọn</Text> */}
                {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  
                </View> */}
                <View style={{ marginTop: 10 * scale, width: '100%', height: '100%', alignSelf: 'center' }}>
                    {
                        state.list_image.length !== 0 ?
                            <FlatList
                                horizontal={false}
                                contentContainerStyle={{}}
                                keyExtractor={(item, index) => index.toString()}
                                data={state.list_image}
                                numColumns={4}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ width: 92 * scale, height: 92 * scale, marginLeft: 1 * scale, marginTop: 2 * scale }}>
                                            <Image
                                                style={{ width: 92 * scale, height: 92 * scale, }}
                                                source={{ uri: item }}
                                            />
                                            <TouchableOpacity
                                                style={{ position: 'absolute', alignSelf: 'flex-start', right: 0 }}
                                                onPress={() => deleteImage(index)}
                                            >
                                                <Image style={{ width: 15 * scale, height: 15 * scale }} source={R.images.close_avatar} />
                                            </TouchableOpacity>
                                        </View>

                                    )
                                }}
                            />
                            : null
                    }
                </View>
                {/* </ScrollView> */}
            </View>
        </View>
    )
}

export default PostArticleScreen

