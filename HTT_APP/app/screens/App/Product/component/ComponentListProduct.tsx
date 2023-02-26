import React, { useState } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    FlatList,
} from 'react-native'
import { fonts } from '@app/theme'
import R from '@app/assets/R'
import { useAppDispatch, useAppSelector } from '@app/store'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { SCREEN_ROUTER_APP } from '@app/config/screenType'
import reactotron from 'ReactotronConfig'

const { width, height } = Dimensions.get('window')
const scale = width / 375

const ComponentListProduct = (props: any) => {
    const dataProduct = useAppSelector(state => state.ListProductReducer)
    // console.log('dataProduct', dataProduct);
    const gotoDetail = () => {
        NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
            id: props.item.id,
            stock_id: props.item.stock_id,
        })
    }
    // console.log('props', props);
    const [isLike, setIsLike] = useState(false)
    const clickLike = () => {
        setIsLike(!isLike)
    }
    const checkPrice = (price: any) => {
        // console.log('price', price);
        let a = price.split('-')
        // console.log('a', a);
        if (parseInt(a[0]) === parseInt(a[1])) {
            return a[0]
        } else {
            return price
        }
    }

    const checkTitleLength = (arr) => {
        if (arr.length > 33) {
            return arr.substring(0, 33) + '...'
        } else {
            return arr
        }
    }

    const renderImage = arrayImage => {
        if (arrayImage.length <= 4) {
            switch (arrayImage.length) {
                case 1:
                    return (
                        <TouchableOpacity onPress={() => gotoDetail()}>
                            <Image
                                style={{
                                    width: 345 * scale,
                                    height: 171 * scale,
                                    borderRadius: 5 * scale,
                                }}
                                source={{ uri: arrayImage[0].media_url }}
                            />
                        </TouchableOpacity>
                    )
                case 2:
                    return (
                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'row' }}
                            onPress={() => gotoDetail()}
                        >
                            <View>
                                <Image
                                    style={{
                                        width: 171 * scale,
                                        height: '100%',
                                        borderRadius: 5 * scale,
                                    }}
                                    source={{ uri: arrayImage[0].media_url }}
                                />
                            </View>
                            <View>
                                <Image
                                    style={{
                                        width: 171 * scale,
                                        height: '100%',
                                        borderRadius: 5 * scale,
                                        marginLeft: 3,
                                    }}
                                    source={{ uri: arrayImage[1].media_url }}
                                />
                            </View>
                        </TouchableOpacity>
                    )

                case 3:
                    return (
                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'row' }}
                            onPress={() => gotoDetail()}
                        >
                            <View>
                                <Image
                                    style={{
                                        width: 229 * scale,
                                        height: '100%',
                                        borderRadius: 5 * scale,
                                    }}
                                    source={{ uri: arrayImage[0].media_url }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    flex: 1,
                                    marginLeft: 3 * scale,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 130 * scale,
                                            borderRadius: 5 * scale,
                                        }}
                                        source={{ uri: arrayImage[1].media_url }}
                                    />
                                </View>
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 130 * scale,
                                            borderRadius: 5 * scale,
                                        }}
                                        source={{ uri: arrayImage[2].media_url }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                case 4:
                    return (
                        <TouchableOpacity
                            style={{ flex: 1, flexDirection: 'row' }}
                            onPress={() => gotoDetail()}
                        >
                            <View>
                                <Image
                                    style={{
                                        width: 229 * scale,
                                        height: '100%',
                                        borderRadius: 5 * scale,
                                    }}
                                    source={{ uri: arrayImage[0].media_url }}
                                />
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    flex: 1,
                                    marginLeft: 3 * scale,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 86 * scale,
                                            borderRadius: 5 * scale,
                                        }}
                                        source={{ uri: arrayImage[1].media_url }}
                                    />
                                </View>
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 86 * scale,
                                            borderRadius: 5 * scale,
                                        }}
                                        source={{ uri: arrayImage[2].media_url }}
                                    />
                                </View>
                                <View>
                                    <Image
                                        style={{
                                            width: '100%',
                                            height: 86 * scale,
                                            borderRadius: 5 * scale,
                                        }}
                                        source={{ uri: arrayImage[3].media_url }}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                default:
                    break
            }
        } else {
            return (
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row' }}
                    onPress={() => gotoDetail()}
                >
                    <View>
                        <Image
                            style={{
                                width: 229 * scale,
                                height: '100%',
                                borderRadius: 5 * scale,
                            }}
                            source={arrayImage[0]}
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                            flex: 1,
                            marginLeft: 3 * scale,
                            justifyContent: 'space-between',
                        }}
                    >
                        <View>
                            <Image
                                style={{
                                    width: '100%',
                                    height: 84 * scale,
                                    borderRadius: 5 * scale,
                                }}
                                source={arrayImage[1]}
                            />
                        </View>
                        <View>
                            <Image
                                style={{
                                    width: '100%',
                                    height: 84 * scale,
                                    borderRadius: 5 * scale,
                                }}
                                source={arrayImage[2]}
                            />
                        </View>
                        <View style={{}}>
                            <Image
                                style={{
                                    width: '100%',
                                    height: 84 * scale,
                                    borderRadius: 5 * scale,
                                }}
                                source={arrayImage[3]}
                            />
                            <View style={styles.view_absolute}>
                                <Text style={styles.txt_absolute}>
                                    +{arrayImage.length - 4}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    return (
        <View style={{}}>
            <View
                style={
                    props?.item?.ProductMedia.length <= 2
                        ? styles.viewProduct
                        : styles.viewProduct3img
                }
            >
                <View
                    style={
                        props?.item?.ProductMedia.length <= 2
                            ? styles.viewProductMain
                            : styles.viewProduct3img_main
                    }
                >
                    {renderImage(props.item.ProductMedia)}
                    <View style={styles.viewProductDes}>
                        <TouchableOpacity
                            onPress={() =>
                                NavigationUtil.navigate(SCREEN_ROUTER_APP.PRODUCT_DETAIL, {
                                    id: props.item.id,
                                    stock_id: props.item.stock_id,
                                })
                            }
                        >
                            <Text numberOfLines={1} style={styles.txtTitleDes}>{checkTitleLength(props?.item?.name)}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={clickLike}>
                            <Image
                                style={{ width: 24 * scale, height: 24 * scale }}
                                source={
                                    isLike
                                        ? R.images.icon_heart_red
                                        : R.images.icon_heart_gradient
                                }
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewProductDes}>
                        <Text style={styles.txtPriceDes}>
                            {checkPrice(props?.item?.min_max_price)}
                        </Text>
                        <Text style={styles.txtTotalShell}>
                            Đã bán: {props?.item?.quantity_items}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ComponentListProduct

const styles = StyleSheet.create({
    viewProduct: {
        width: '100%',
        height: 267 * scale,
        marginTop: 8 * scale,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewProductMain: {
        width: 345 * scale,
        height: 245 * scale,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    viewImage: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: -10 * scale,
    },
    imgProductDetail: {
        width: 171 * scale,
        height: 171 * scale,
        borderRadius: 5 * scale,
        marginLeft: 10 * scale,
    },
    viewProductDes: {
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10 * scale,
        flexDirection: 'row',
    },
    txtTitleDes: {
        fontStyle: 'normal',
        fontSize: 18 * scale,
        lineHeight: 24 * scale,
        color: '#373E50',
        fontWeight: '400',
    },
    txtPriceDes: {
        fontStyle: 'normal',
        fontSize: 18 * scale,
        lineHeight: 24 * scale,
        color: '#E84343',
        fontWeight: '400',
    },
    txtTotalShell: {
        fontStyle: 'normal',
        fontSize: 16 * scale,
        lineHeight: 22 * scale,
        color: '#69747E',
        fontWeight: '400',
    },
    viewProduct3img: {
        width: 375 * scale,
        height: 352 * scale,
        backgroundColor: 'white',
        marginTop: 8 * scale,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewProduct3img_main: {
        width: 345 * scale,
        height: 332 * scale,
        // height: 305 * scale,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
    },
    viewImage3: {
        width: '100%',
        height: 229 * scale,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    view_absolute: {
        width: '100%',
        height: 84 * scale,
        borderRadius: 5 * scale,
        position: 'absolute',
        backgroundColor: '#000000',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        // zIndex: 1000
    },
    txt_absolute: {
        color: '#FFFFFF',
        ...fonts.regular20,
        zIndex: 9999,
    },
})
