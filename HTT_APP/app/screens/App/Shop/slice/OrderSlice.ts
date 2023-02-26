import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericInitialState } from '@common'
import { getListOrder } from '@app/service/Network/shop/ShopApi'
import reactotron from 'reactotron-react-native'
import { ORDER_STATUS_TYPE } from '@app/config/Constants'

const ORDER_TYPE = [
  ORDER_STATUS_TYPE.PENDING,
  ORDER_STATUS_TYPE.CONFIRMED,
  ORDER_STATUS_TYPE.COMPLETED,
  ORDER_STATUS_TYPE.CANCEL,
]

let initialState: GenericInitialState<any> = {
  isLoading: false,
  dialogLoading: false,
  error: undefined,
  data: ORDER_TYPE.map(item => ({
    loading: false,
    error: null,
    orderData: [],
  })),
}

export const handlePayload = (status: number) => {
  switch (status) {
    case 0:
      return 'wait_confirmation'
    case 1:
      return 'inprogress'
    case 2:
      return 'completed'
    case 3:
      return 'cancelled'
    default:
      break
  }
}

export const requestListOrderThunk = createAsyncThunk(
  'order',
  async (payload: any) => {
    return await getListOrder({ status: handlePayload(payload.status) })
  }
)

export const OrderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestListOrderThunk.pending, (state, action) => {
      const index = action.meta.arg.status
      state.data[index].loading = true
    })
    builder.addCase(requestListOrderThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false

      const index = action.meta.arg.status
      state.data[index].loading = false
      state.data[index].orderData = action.payload.data.orders
    })
    builder.addCase(requestListOrderThunk.rejected, (state, action) => {
      const index = action.meta.arg.status
      state.data[index].loading = false
      state.data[index].error = true
    })
  },
})

export const {} = OrderSlice.actions

export default OrderSlice.reducer
