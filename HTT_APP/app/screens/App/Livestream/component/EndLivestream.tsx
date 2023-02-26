import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import LoadingProgress from '@app/components/LoadingProgress'
import { LIVESTREAM_STATUS } from '@app/config/Constants'
import NavigationUtil from '@app/navigation/NavigationUtil'
import { requestDeleteLive } from '@app/service/Network/livestream/LiveStreamApi'
import { useAppDispatch } from '@app/store'
import { colors, fonts, HEIGHT, WIDTH } from '@app/theme'
import { showConfirm } from '@app/utils/AlertHelper'
import { callAPIHook } from '@app/utils/CallApiHelper'
import DateUtil from '@app/utils/DateUtil'
import { BlurView } from '@react-native-community/blur'
import React, { useState } from 'react'
import { Text, View } from 'react-native'
import Toast from 'react-native-easy-toast'
import FastImage from 'react-native-fast-image'
import reactotron from 'ReactotronConfig'
import { requestGetHomeThunk } from '../../Home/slice/HomeSlice'
import { getListLiveStreamThunk } from '../slice/LiveStreamSlice'
import { getStreamLiveThunk } from '../slice/StreamingSlice'
import { styles } from '../styles'
import moment from 'moment'
import { endsWith } from 'lodash'

const EndLivestream = ({ data }: { data?: any; goBack?: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const appDispatch = useAppDispatch()
  const payload = {
    status: LIVESTREAM_STATUS.STREAMING,
  }
  const handleDeleteLive = () => {
    callAPIHook({
      API: requestDeleteLive,
      payload: data.id,
      useLoading: setIsLoading,
      onSuccess: res => {
        // appDispatch(requestGetHomeThunk())
        appDispatch(getListLiveStreamThunk(payload))
        // appDispatch(getStreamLiveThunk())
        setTimeout(() => {
          NavigationUtil.pop(2)
        }, 300)
      },
      onError: err => {
        appDispatch(getListLiveStreamThunk(payload))
        NavigationUtil.pop(2)
      },
    })
  }

  const getTimeDiff = (start: any, end: any) => {
    return moment.duration(
      moment(end, 'HH:mm:ss a').diff(moment(start, 'HH:mm:ss a'))
    )
  }
  const handleTime = (startTime: any, endTime: any) => {
    let diff = getTimeDiff(startTime, endTime)
    if (diff.hours() != 0) {
      return `${diff.hours()} giờ ${diff.minutes()} phút`
    }
    if (diff.minutes() != 0) {
      return `${diff.minutes()} phút`
    }
    return `${diff.seconds()} giây`
  }

  return (
    <View style={styles.coverFullScreenLoading}>
      <FastImage
        style={{
          width: WIDTH,
          height: HEIGHT,
        }}
        source={data ? { uri: data.cover_image_url } : R.images.img_bg_live}
      />
      <BlurView
        style={styles.vBlurViewEndLive}
        blurType="dark"
        blurAmount={20}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.vContentStatistical}>
        <View style={{ flexDirection: 'row' }}>
          <FastImage
            style={{
              width: 24,
              height: 24,
            }}
            source={R.images.img_statistical}
          />
          <Text
            style={{ ...fonts.bold16, marginLeft: 8 }}
            children={'Thông tin chi tiết'}
          />
        </View>
        <View style={styles.vStatistical}>
          <View>
            <Item
              title={'Lượt xem'}
              value={data.count_viewed}
              icon={R.images.img_view_sta}
            />
            <Item
              title={'Bình luận'}
              value={data.count_comment}
              icon={R.images.img_comment_sta}
            />
          </View>
          <View>
            <Item
              title={'Lượt thích'}
              value={data.count_reaction}
              icon={R.images.img_react_sta}
            />
            <Item
              title={'Thời lượng'}
              // value={DateUtil.formatTimeSeconds(data.expire_at)}
              value={handleTime(data.start_at, data.finish_at)}
              icon={R.images.img_time_live}
            />
          </View>
        </View>
        <View style={styles.vBtnLive}>
          <Button
            style={styles.btnDeleteLive}
            onPress={() => NavigationUtil.pop(2)}
            children={
              <Text
                style={{ color: colors.red, ...fonts.semi_bold16 }}
                children={'Trở về'}
              />
            }
          />
          <Button
            style={styles.btnSaveLive}
            onPress={() => {
              showConfirm(
                R.strings().notification,
                'Bạn có chắc chắn muốn xoá livestream này không?',
                handleDeleteLive,
                '',
                'Đồng ý'
              )
            }}
            children={
              <Text
                style={{ color: colors.white, ...fonts.semi_bold16 }}
                children={'Xoá video'}
              />
            }
          />
        </View>
      </View>

      {isLoading && <LoadingProgress />}
    </View>
  )
}

export default EndLivestream

const Item = ({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: any
}) => {
  return (
    <View style={{ flexDirection: 'row', marginTop: 24 }}>
      <FastImage
        style={{
          width: 20,
          height: 20,
        }}
        source={icon}
      />
      <View style={{ marginLeft: 8 }}>
        <Text
          style={{ ...fonts.regular15, color: '#595959' }}
          children={title}
        />
        <Text style={{ ...fonts.regular15, marginTop: 12 }} children={value} />
      </View>
    </View>
  )
}
