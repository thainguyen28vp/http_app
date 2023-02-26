import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericInitialState } from '@common'
import reactotron from 'reactotron-react-native'
import { getListNotification } from '@app/service/Network/notification/NotificationApi'
import { DEFAULT_PARAMS, NOTIFICATION_TYPE_VIEW } from '@app/config/Constants'

let initialState: GenericInitialState<any> = {
  isLoading: false,
  error: undefined,
  isLoadMore: false,
  isLastPage: false,
  data: [],
  countNotification: 0,
}

export const requestListNotificationThunk = createAsyncThunk(
  'notification',
  async (payload: any) => {
    return await getListNotification(payload.body)
  }
)

export const NotificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    readNotification: (state, action) => {
      state.data[action.payload].is_read = NOTIFICATION_TYPE_VIEW.VIEWED
    },
    readAllNotification: (state, action) => {
      state.data = state.data.map((item: any) => ({
        ...item,
        is_read: 1,
      }))
    },
    setCountNotify: (state, action) => {
      state.countNotification = action.payload
    },
    clearNotifyCount: state => {
      state.countNotification = 0
    },
  },
  extraReducers: builder => {
    builder.addCase(requestListNotificationThunk.pending, (state, action) => {
      if (!action.meta.arg.loadOnTop) {
        if (action.meta.arg.body.page == DEFAULT_PARAMS.PAGE) {
          state.isLoading = true
        } else {
          state.isLoadMore = true
        }
      }
    })
    builder.addCase(requestListNotificationThunk.fulfilled, (state, action) => {
      state.error = false

      if (
        action.meta.arg.body.page == DEFAULT_PARAMS.PAGE ||
        action.meta.arg.loadOnTop
      ) {
        state.isLoading = false
        state.data = action.payload.data
      } else {
        state.isLoadMore = false
        if (!!action.payload.data.length) {
          state.data = [...state.data, ...action.payload.data]
        } else {
          state.isLastPage = true
        }
      }
    })
    builder.addCase(requestListNotificationThunk.rejected, (state, action) => {
      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isLoading = false
      } else {
        state.isLoadMore = false
      }
      state.error = true
    })
  },
})

export const {
  readNotification,
  setCountNotify,
  clearNotifyCount,
  readAllNotification,
} = NotificationSlice.actions

export default NotificationSlice.reducer
