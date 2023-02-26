import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericListInitialState, GenericInitialState } from '@common'
import { getListCart } from '@app/service/Network/shop/ShopApi'
import reactotron from 'reactotron-react-native'
import { getProductCustomAttribute } from '@app/service/Network/product/ProductApi'
import { ProductCustomAttributePayload } from '@app/service/Network/product/ProductApiPayload'

let initialState: GenericInitialState<any> = {
  isLoading: false,
  error: undefined,
  data: {},
}

export const requestGetProductCustomAttribute = createAsyncThunk(
  'custom_attribute',
  async (payload: ProductCustomAttributePayload) => {
    return await getProductCustomAttribute(payload)
  }
)

export const ProductCustomAttributeSlice = createSlice({
  name: 'product_custom_attribute',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(
      requestGetProductCustomAttribute.pending,
      (state, action) => {
        state.isLoading = true
        state.data.disableSign = true
      }
    )
    builder.addCase(
      requestGetProductCustomAttribute.fulfilled,
      (state, action) => {
        state.isLoading = false
        state.error = false
        state.data = action.payload.data

        state.data.arr_status_option_1 =
          JSON.parse(state.data.productPriceCustom.arr_status_option_1) || []
        state.data.arr_status_option_2 =
          JSON.parse(state.data.productPriceCustom.arr_status_option_2) || []
        state.data.disableSign = undefined
      }
    )
    builder.addCase(
      requestGetProductCustomAttribute.rejected,
      (state, action) => {
        state.isLoading = false
        state.data.disableSign = undefined
        state.error = true
      }
    )
  },
})

export const {} = ProductCustomAttributeSlice.actions

export default ProductCustomAttributeSlice.reducer
