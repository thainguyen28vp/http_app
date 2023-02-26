import { Emotion } from '@app/components/Emotion/Emotion'
import { LIVESTREAM_EVENT } from '@app/config/Constants'
import { useAppSelector } from '@app/store'
import { returnReact } from '@app/utils/FuncHelper'
import { SocketHelperLivestream } from '@app/utils/SocketHelperLivestream'
import React, { useEffect, useImperativeHandle, useState } from 'react'
import reactotron from 'reactotron-react-native'
import { useImmer } from 'use-immer'
import { DataUserInfoProps } from '../../Account/Model'

const { REACTION } = LIVESTREAM_EVENT

const Reaction = React.forwardRef(
  (
    {
      socket,
      userId,
      channelId,
    }: { socket?: any; userId?: any; channelId: any },
    ref
  ) => {
    const [emotions, setEmotions] = useImmer<any[]>([])
    const [disable, setDisableEmotion] = useState(true)
    const userInfo = useAppSelector<DataUserInfoProps>(
      state => state.accountReducer.data
    )

    const chooseReact = (value: number) => {
      if (disable) {
        setDisableEmotion(false)
        let image = returnReact(value)
        setEmotions(prevEmotions => {
          prevEmotions.push(image)
        })
        setTimeout(() => {
          setDisableEmotion(true)
        }, 50)
      }
    }

    const handleSocket = (res: any) => {
      if (res.type_action === REACTION) {
        if (userInfo?.id !== res.data[0].user_id)
          res.data.map((item: any) => {
            chooseReact(item.id)
          })
        return
      }
    }
    useImperativeHandle(ref, () => ({
      chooseReact(value: number) {
        chooseReact(value)
      },
    }))
    useEffect(() => {
      SocketHelperLivestream?.socket?.on(channelId, handleSocket)
      return () => SocketHelperLivestream?.socket?.off(channelId, handleSocket)
    }, [channelId])
    return (
      <>
        {emotions.length > 0 &&
          emotions.map((item, index) => {
            return <Emotion source={item} key={index} />
          })}
      </>
    )
  }
)

export default Reaction
