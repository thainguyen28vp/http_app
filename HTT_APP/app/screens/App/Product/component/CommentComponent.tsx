import React, { useState } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    StyleSheet,
    FlatList
} from 'react-native'
import R from '@app/assets/R';

const { width, height } = Dimensions.get('window')
const scale = width / 375

const CommentComponent = (props) => {
    // console.log('props', props);
    const create_at = props.item.create_at
    // console.log('create_at', create_at);
    const convertDate2 = (date) => {
        // convert time from directus
        if (date) {
            var date_arr1 = date.split("T");
            var date1 = date_arr1[0];
            var date2 = date1.split("-")
            var year = date2[0]
            var month = date2[1]
            var day = date2[2]
            var day01 = day + "/" + month + "/" + year  // show day-month-year
            var time1 = date_arr1[1];
            var time2 = time1.split("+")
            var time3 = time2[0]
            var time4 = time3.substring(0, time3.length - 8)  // show time  
            return time4 + " " + day01
        }
    }

    const renderStar = (number) => {
        switch (number) {
            case 1:
                return (
                    <Image style={{ width: 14 * scale, height: 14 * scale }} source={R.images.icon_vector_small} />

                )
            case 2:
                return (
                    <>
                        <Image style={{ width: 14 * scale, height: 14 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                    </>
                )
            case 3:
                return (
                    <>
                        <Image style={{ width: 14 * scale, height: 14 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                    </>
                )
            case 4:
                return (
                    <>
                        <Image style={{ width: 14 * scale, height: 14 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                    </>
                )
            case 5:
                return (
                    <>
                        <Image style={{ width: 14 * scale, height: 14 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                        <Image style={{ width: 14 * scale, height: 14 * scale, marginLeft: 6 * scale }} source={R.images.icon_vector_small} />
                    </>
                )

            default:
                break;
        }
    }
    return (
        <View>
            <View style={styles.modalProduct}>
                <View>
                    <Image style={{ width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }} source={require('../../../../assets/images/icon_comment.png')} />
                </View>
                <View style={{ width: 180 * scale, justifyContent: 'flex-start', marginLeft: 18 * scale }}>
                    <Text style={{ fontWeight: '500', fontSize: 14 * scale, lineHeight: 22 * scale, color: '#262626' }}>{props?.item?.user_name}</Text>
                    <View style={{ flexDirection: 'row', width: 120 * scale, alignItems: 'center', marginTop: 3 * scale }}>
                        {renderStar(props?.item?.star)}
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Text style={styles.txtTime}>{convertDate2(props?.item?.create_at)}</Text>
                </View>
            </View>
            <Text style={styles.txtComment}>{props?.item?.content}</Text>
            {
                props?.item?.ReviewMedia ?
                    <FlatList
                        horizontal
                        contentContainerStyle={{ marginTop: 12 * scale, marginLeft: -12 * scale }}
                        data={props?.item?.image}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity>
                                    <Image
                                        style={styles.imgReview}
                                        source={{ uri: item }}
                                    />
                                </TouchableOpacity>
                            )
                        }}
                    />
                    : null
            }
            <View style={[styles.viewRate1_5, {}]}>
                <Text style={styles.txtType}>{props?.item?.color}</Text>
                <Image style={{ marginHorizontal: 10 * scale, height: 12, width: 1 }} source={R.images.line8} />
                <Text style={styles.txtType}>size {props?.item?.size}</Text>
            </View>
        </View>
    )
}

export default CommentComponent

const styles = StyleSheet.create({
    modalProduct: {
        height: 40 * scale,
        marginTop: 20 * scale,
        flexDirection: 'row',
    },
    txtTime: {
        fontSize: 12 * scale,
        lineHeight: 20 * scale,
        color: '#69747E',
        fontWeight: '400',
        fontStyle: 'normal',
    },
    txtComment: {
        fontSize: 15 * scale,
        lineHeight: 22 * scale,
        color: '#262626',
        fontWeight: '400',
        fontStyle: 'normal',
        marginTop: 16 * scale,
    },
    imgComment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12 * scale,
    },
    viewRate1_5: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txt1_5: {
        fontSize: 14 * scale,
        lineHeight: 22 * scale,
        color: '#262626',
        fontWeight: '400',
        fontStyle: 'normal',
    },
    txtType: {
        fontSize: 14 * scale,
        lineHeight: 22 * scale,
        color: '#69747E',
        fontWeight: '400',
        fontStyle: 'normal',
    },
    imgReview: {
        width: 75 * scale,
        height: 75 * scale,
        borderRadius: 10 * scale,
        marginLeft: 12 * scale,
    },
})
