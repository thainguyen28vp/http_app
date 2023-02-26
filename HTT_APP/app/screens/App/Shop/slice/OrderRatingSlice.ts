import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericListInitialState, GenericInitialState } from '@common'
import { getOrderItemDetail } from '@app/service/Network/shop/ShopApi'
import reactotron from 'reactotron-react-native'

let initialState: GenericInitialState<any> = {
  isLoading: true,
  error: undefined,
  data: [],
}

export const requestGetOrderRatingThunk = createAsyncThunk(
  'order_rating',
  async (payload: any) => {
    return await getOrderItemDetail(payload)
  }
)

export const OrderRatingSlice = createSlice({
  name: 'order_rating',
  initialState,
  reducers: {
    fillStar: (state, action) => {
      state.data[action.payload.index].star = action.payload.star
    },
    setReviewText: (state, action) => {
      state.data[action.payload.index].review = action.payload.text
    },
    addImage: (state, action) => {
      state.data[action.payload.index].listImage = action.payload.listImage
    },
    removeImage: (state, action) => {
      const listImg = state.data[action.payload.index].listImage
      const target = listImg.indexOf(
        listImg.find(item => item == action.payload.url)
      )
      state.data[action.payload.index].listImage.splice(target, 1)
    },
    clearData: (state) => {
      state.isLoading = true,
      state.error = undefined,
      state.data = []
    }
  },
  extraReducers: builder => {
    builder.addCase(requestGetOrderRatingThunk.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(requestGetOrderRatingThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false
      state.data = action.payload.data.items
      state.data.forEach((item: any) => {
        item.review = ''
        item.star = 5
        item.listImage = []
      })
    })
    builder.addCase(requestGetOrderRatingThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})

export const { fillStar, setReviewText, addImage, removeImage, clearData } =
  OrderRatingSlice.actions

export default OrderRatingSlice.reducer
