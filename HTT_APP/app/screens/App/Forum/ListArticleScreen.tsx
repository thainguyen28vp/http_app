
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
import styles from './styles/stylesListArticle'
import { SearchBar, Header } from 'react-native-elements'
import FstImage from '@app/components/FstImage/FstImage'
import R from '@app/assets/R'
import ArticleComponent from './component/ArticleComponent'
import MenuComponent from './component/MenuComponent'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import RNHeader from '@app/components/RNHeader'
import { dataArticle, dataHeader } from '@app/config/Mockup'

const { width, height } = Dimensions.get('window')
const scale = width / 375

const ListArticleScreen = (props: any) => {
    const [searchText, setSearchText] = useState('')
    const [isClickMenu, setIsClickMenu] = useState(false)
    const onClickMenu = () => {
        setIsClickMenu(true)
    }

    const onCreatePostArticle = () => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.POST_ARTICLE)
    }

    return (
        <View style={styles.main}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle="dark-content"
            />
            <RNHeader titleHeader='Cộng đồng' back borderBottomHeader="transparent" />
            <View style={{ backgroundColor: '#F1F3F5', flex: 1 }}>
                <View style={{ height: 50 * scale, backgroundColor: '#FFFFFF', paddingTop: 10 * scale }}>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {
                            dataHeader.map((item, index) => {
                                return (
                                    <MenuComponent
                                        item={item}
                                        key={index}
                                        navigation={props.navigation}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                </View>
                <SearchBar
                    searchIcon={<>
                        <FstImage resizeMode='contain' style={{ width: 20, height: 20, marginLeft: 10 }} source={R.images.ic_search} />
                    </>}
                    placeholder='Tìm kiếm bài đăng'
                    value={searchText}
                    containerStyle={styles.container_search}
                    inputContainerStyle={styles.input_container}
                    onChangeText={(text) => {
                        setSearchText(text)
                    }
                    }
                    onClear={() => {
                        setSearchText('')
                    }}
                    autoFocus
                />

                <ScrollView style={styles.scrollview} showsVerticalScrollIndicator={false}>
                    {
                        dataArticle.map((item, index) => {
                            return (
                                <ArticleComponent
                                    item={item}
                                    key={item.id}
                                    navigation={props.navigation}
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.btnIcon_forum} onPress={onCreatePostArticle}>
                <Image style={styles.icon_forum} source={R.images.icon_forum} />
            </TouchableOpacity>
        </View >
    )
}

export default ListArticleScreen

