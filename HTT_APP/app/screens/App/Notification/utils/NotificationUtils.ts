import { DEFAULT_PARAMS } from '@app/config/Constants'
import { updateChatState } from '@app/service/Network/chat/ChatApi'
import { getCountCart } from '@app/service/Network/home/HomeApi'
import { getCountNotification } from '@app/service/Network/notification/NotificationApi'
import { useAppDispatch } from '@app/store'
import { callAPIHook } from '@app/utils/CallApiHelper'
import reactotron from 'ReactotronConfig'
import { Dispatch } from 'redux'
import {
  clearCountNotRead,
  updateCountNotRead,
} from '../../Chat/slice/ChatSlice'
import { clearCountCart, setCountCart } from '../../Shop/slice/CartSlice'
import {
  clearNotifyCount,
  requestListNotificationThunk,
  setCountNotify,
} from '../slice/NotificationSlice'

export const updateCountNotification = (Dispatch: Dispatch) => {
  callAPIHook({
    API: getCountNotification,
    onSuccess: res => {
      Dispatch(setCountNotify(res.data.count))
    },
  })
}

export const refreshNotification = (Dispatch: any) => {
  const body = { page: DEFAULT_PARAMS.PAGE }

  Dispatch(requestListNotificationThunk({ body, loadOnTop: false }))
}

export const updateCountCart = (Dispatch: Dispatch) => {
  callAPIHook({
    API: getCountCart,
    onSuccess: res => {
      Dispatch(setCountCart(res.data))
    },
  })
}

export const updateCountChat = (Dispatch: Dispatch) => {
  callAPIHook({
    API: updateChatState,
    onSuccess: res => {
      // Dispatch(updateCountNotRead(res.data[0].count_message_not_read))
      Dispatch(updateCountNotRead(res.data))
    },
  })
}

export const clearBadgeData = (Dispatch: Dispatch) => {
  Dispatch(clearCountNotRead())
  Dispatch(clearNotifyCount())
  Dispatch(clearCountCart())
}
