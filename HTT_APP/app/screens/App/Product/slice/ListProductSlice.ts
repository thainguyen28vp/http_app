import { getListProduct } from '@app/service/Network/product/ProductApi'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import reactotron from 'ReactotronConfig'

export const requestListProductThunk = createAsyncThunk(
  'get/listProduct',
  async (payload: object) => {
    const res = await getListProduct(payload)
    return res
  }
)

export const ListProductSlice = createSlice({
  name: 'get/listProduct',
  initialState: {
    isLoading: true,
    error: false,
    success_message: '',
    data: [],
    listProductSelect: [],
    checkAll: false,
    productId: [],
    listProductDelete: [],
    listProductAdd: [],
    arrTemp: [],
  },
  reducers: {
    clearCache: (state, action) => {},
    updateChecked: (state, action) => {
      state.data?.forEach((item: object, index: number) => {
        if (item.id === action.payload.id) {
          item.checked = !item.checked
          let position = state.listProductSelect.findIndex(
            el => el.id == item.id
          )
          if (position === -1) state.listProductSelect.push(item)
          if (position !== -1) state.listProductSelect.splice(position, 1)
          let checkAll = state.data?.every(itm => itm.checked)
          checkAll ? (state.checkAll = true) : (state.checkAll = false)
        }
      })
    },
    updateCheckedAllWithLivestreamID: (state, action) => {
      state.checkAll = action.payload.checkAll
      state.data?.forEach((item: object) => {
        item.checked = action.payload.checkAll
      })
      if (action.payload.checkAll) {
        state.listProductSelect = state.data
      } else {
        state.listProductSelect = []
        state.arrTemp.forEach(itm => {
          state.listProductDelete.push(itm.id)
        })
      }
    },
    updateCheckedAll: (state, action) => {
      state.checkAll = action.payload.checkAll
      state.data?.forEach((item: object) => {
        item.checked = action.payload.checkAll
      })
      if (action.payload.checkAll) {
        state.listProductSelect = state.data
      } else {
        state.listProductSelect = []
      }
    },
    removeProduct: (state, action) => {
      state.data?.forEach((item: object, index: number) => {
        if (item.id === action.payload.item.id) {
          !action.payload.item?.modal ? (item.checked = !item.checked) : null
          let position = state.listProductSelect.findIndex(
            el => el.id == item.id
          )
          if (position !== -1) state.listProductSelect.splice(position, 1)
          let checkAll = state.data?.every(itm => itm.checked)
          checkAll ? (state.checkAll = true) : (state.checkAll = false)
        }
      })

      let checkAll = state.data?.every(itm => itm?.checked)
      checkAll ? (state.checkAll = true) : (state.checkAll = false)
    },
    updateTitle: (state, action) => {
      state.listProductSelect.forEach(item => {
        if (action.payload.item.id === item.id) {
          item.code = action.payload.code
        }
      })
    },
    updateListProductSelect: (state, action) => {
      state.listProductSelect = action.payload.data
      state.listProductSelect?.forEach(item => {
        item.checked = true
      })
    },
    updateCodeProduct: (state, action) => {
      state.listProductSelect?.forEach((item: object) => {
        if (action.payload.id === item.id) {
          item.code_product_livestream = action.payload.code_product_livestream
        }
      })
    },
    updateListProductSelectEmpty: (state, action) => {
      state.listProductSelect = []
      state.productId = []
      state.arrTemp = []
      state.listProductAdd = []
      state.listProductDelete = []
    },
    addProductListDelete: (state: any, action: any) => {
      if (state.arrTemp?.length)
        if (action.payload.item.checked) {
          let position = state.listProductAdd.indexOf(action.payload.item.id)
          if (position !== -1) state.listProductAdd.splice(position, 1)
          state.arrTemp.forEach((e: object) => {
            if (e.id === action.payload.item.id) {
              state.listProductDelete.push(e.id)
            } else {
            }
          })
        } else {
          let position = state.listProductDelete.indexOf(action.payload.item.id)
          if (position !== -1) state.listProductDelete.splice(position, 1)
          else {
            if (!state.arrTemp.includes(action.payload.item.id)) {
              state.listProductAdd.push(action.payload.item.id)
            }
          }
        }
      else {
        state.arrTemp.forEach((element: object) => {
          if (element.id !== action.payload.item.id) {
            state.listProductAdd.push(element.id)
          }
        })
      }
    },
    setListproductDeleteAndAddEmpty: (state, action) => {
      state.listProductDelete = []
      state.listProductAdd = []
    },
    deleteProductWatching: (state, action) => {
      state.listProductSelect = state.listProductSelect.filter(
        item => item.id !== action.payload.id
      )
    },
  },
  extraReducers: builder => {
    builder.addCase(requestListProductThunk.pending, (state, action) => {
      state.isLoading = true
      state.data = []
    })
    builder.addCase(requestListProductThunk.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = false
      state.data = action.payload.data

      state.data?.forEach((item: object) => {
        if (state.listProductSelect.length) {
          state.listProductSelect.forEach(el => {
            if (el?.id == item?.id) {
              item.checked = el.checked ? true : false
              item.code = ''
            }
          })
        } else {
          item.checked = false
          item.code = ''
        }
      })
      state.arrTemp = state.listProductSelect
      state.success_message = ' Success'
    })
    builder.addCase(requestListProductThunk.rejected, (state, action) => {
      state.isLoading = false
      state.error = true
    })
  },
})
export const {
  clearCache,
  updateChecked,
  updateCheckedAll,
  removeProduct,
  updateTitle,
  updateListProductSelect,
  updateCodeProduct,
  updateListProductSelectEmpty,
  addProductListDelete,
  setListproductDeleteAndAddEmpty,
  deleteProductWatching,
  updateCheckedAllWithLivestreamID,
} = ListProductSlice.actions

export default ListProductSlice.reducer
