import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native'
import styles from './styles/stylesReview'
import { LinearProgress } from 'react-native-elements'
import CommentComponent from './component/CommentComponent'
import RNHeader from '@app/components/RNHeader'
import R from '@app/assets/R'
import { dataComment } from '@app/config/Mockup'
// import { getProductReview } from './ProductApi';
import { callAPIHook } from '@app/utils/CallApiHelper'
import Loading from '@app/components/Loading'
import { getProductReview } from '@app/service/Network/product/ProductApi'

const { width, height } = Dimensions.get('window')
const scale = width / 375

const ReviewProduct = (props: any) => {
  console.log('props', props)
  const [isLoading, setIsLoading] = useState(true)
  // console.log('isLoading', isLoading);
  const [listUserReview, setListUserReview] = useState({})
  const [listAllStar, setListAllStar] = useState([])
  const [vote5, setVote5] = useState(0)
  const [vote4, setVote4] = useState(0)
  const [vote3, setVote3] = useState(0)
  const [vote2, setVote2] = useState(0)
  const [vote1, setVote1] = useState(0)

  // console.log('vote5', vote5);
  // console.log('vote1', vote1);
  const id = props.route.params?.id
  console.log('id', id)

  const requestApiProductReview = async () => {
    const payload = {
      id: id,
    }
    try {
      const respon_review = await getProductReview(payload)
      console.log('respon_review', respon_review)
      setListUserReview(respon_review.data)
      if (respon_review.data.average !== null) {
        let arr5star = (await respon_review?.data[5]?.rows) || []
        let arr4star = (await respon_review?.data[4]?.rows) || []
        let arr3star = (await respon_review?.data[3]?.rows) || []
        let arr2star = (await respon_review?.data[2]?.rows) || []
        let arr1star = (await respon_review?.data[1]?.rows) || []
        let arrAllStar = await arr5star.concat(
          arr4star,
          arr3star,
          arr2star,
          arr1star
        )
        setListAllStar(arrAllStar)
        let allVote = await respon_review?.data?.counts
        let vote5 = (await respon_review?.data[5]?.counts) || 0
        let vote4 = (await respon_review?.data[4]?.counts) || 0
        let vote3 = (await respon_review?.data[3]?.counts) || 0
        let vote2 = (await respon_review?.data[2]?.counts) || 0
        let vote1 = (await respon_review?.data[1]?.counts) || 0
        setVote5(vote5 / allVote)
        setVote4(vote4 / allVote)
        setVote3(vote3 / allVote)
        setVote2(vote2 / allVote)
        setVote1(vote1 / allVote)
      }

      // let arr5star = await respon_review?.data[5]?.rows || []
      // let arr4star = await respon_review?.data[4]?.rows || []
      // let arr3star = await respon_review?.data[3]?.rows || []
      // let arr2star = await respon_review?.data[2]?.rows || []
      // let arr1star = await respon_review?.data[1]?.rows || []
      // let arrAllStar = await arr5star.concat(arr4star, arr3star, arr2star, arr1star)
      //  setListAllStar(arrAllStar)
      // let allVote = await respon_review?.data?.counts
      // let vote5 = await respon_review?.data[5]?.counts || 0
      // let vote4 = await respon_review?.data[4]?.counts || 0
      // let vote3 = await respon_review?.data[3]?.counts || 0
      // let vote2 = await respon_review?.data[2]?.counts || 0
      // let vote1 = await respon_review?.data[1]?.counts || 0
      //  setVote5(vote5 / allVote)
      //  setVote4(vote4 / allVote)
      //  setVote3(vote3 / allVote)
      //  setVote2(vote2 / allVote)
      //  setVote1(vote1 / allVote)
      setIsLoading(false)
    } catch (error_review) {
      throw error_review
    }
  }
  useEffect(() => {
    requestApiProductReview()
  }, [])

  const renderAverageStar = (average: number) => {
    switch (average) {
      case 1:
        return (
          <Image
            style={{ width: 21 * scale, height: 21 * scale }}
            source={R.images.icon_star_big}
          />
        )
      case 2:
        return (
          <>
            <Image
              style={{ width: 21 * scale, height: 21 * scale }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
          </>
        )
      case 3:
        return (
          <>
            <Image
              style={{ width: 21 * scale, height: 21 * scale }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
          </>
        )
      case 4:
        return (
          <>
            <Image
              style={{ width: 21 * scale, height: 21 * scale }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
          </>
        )
      case 5:
        return (
          <>
            <Image
              style={{ width: 21 * scale, height: 21 * scale }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
            <Image
              style={{
                width: 21 * scale,
                height: 21 * scale,
                marginLeft: 4 * scale,
              }}
              source={R.images.icon_star_big}
            />
          </>
        )
      default:
        break
    }
  }
  return (
    <View style={styles.main}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <RNHeader titleHeader="Đánh giá" back borderBottomHeader="transparent" />
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.viewStar}>
              {renderAverageStar(listUserReview?.average)}
              <Text style={styles.txtValueStar}>{listUserReview?.average}</Text>
              <Text style={styles.txtRates}>
                ({listUserReview?.counts} đánh giá)
              </Text>
            </View>
            <View style={{ height: 26 * scale }}></View>
            <View style={styles.viewRate1_5}>
              <Text style={styles.txt1_5}>5</Text>
              <Image
                style={{
                  width: 12 * scale,
                  height: 11.41 * scale,
                  marginLeft: 6 * scale,
                }}
                source={R.images.icon_vector_small}
              />
              <LinearProgress
                style={styles.progress}
                variant="determinate"
                color="#FFB700"
                trackColor="#ECEBED"
                value={vote5}
              />
            </View>
            <View style={[styles.viewRate1_5, { marginTop: 16 * scale }]}>
              <Text style={styles.txt1_5}>4</Text>
              <Image
                style={{
                  width: 12 * scale,
                  height: 11.41 * scale,
                  marginLeft: 6 * scale,
                }}
                source={R.images.icon_vector_small}
              />
              <LinearProgress
                style={styles.progress}
                variant="determinate"
                color="#FFB700"
                trackColor="#ECEBED"
                value={vote4}
              />
            </View>
            <View style={[styles.viewRate1_5, { marginTop: 16 * scale }]}>
              <Text style={styles.txt1_5}>3</Text>
              <Image
                style={{
                  width: 12 * scale,
                  height: 11.41 * scale,
                  marginLeft: 6 * scale,
                }}
                source={R.images.icon_vector_small}
              />
              <LinearProgress
                style={styles.progress}
                variant="determinate"
                color="#FFB700"
                trackColor="#ECEBED"
                value={vote3}
              />
            </View>
            <View style={[styles.viewRate1_5, { marginTop: 16 * scale }]}>
              <Text style={styles.txt1_5}>2</Text>
              <Image
                style={{
                  width: 12 * scale,
                  height: 11.41 * scale,
                  marginLeft: 6 * scale,
                }}
                source={R.images.icon_vector_small}
              />
              <LinearProgress
                style={styles.progress}
                variant="determinate"
                color="#FFB700"
                trackColor="#ECEBED"
                value={vote2}
              />
            </View>
            <View style={[styles.viewRate1_5, { marginTop: 16 * scale }]}>
              <Text style={styles.txt1_5}>1</Text>
              <Image
                style={{
                  width: 12 * scale,
                  height: 11.41 * scale,
                  marginLeft: 6 * scale,
                }}
                source={R.images.icon_vector_small}
              />
              <LinearProgress
                style={styles.progress}
                variant="determinate"
                color="#FFB700"
                trackColor="#ECEBED"
                value={vote1}
              />
            </View>

            <View style={styles.viewline}></View>
            {listAllStar.map((item, index) => {
              return (
                <CommentComponent
                  key={item.id}
                  item={item}
                  index={index}
                  navigation={props.navigation}
                />
              )
            })}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

export default ReviewProduct
