import { createSlice } from '@reduxjs/toolkit'

let initialState = {
  nameProductComment: null,
  showModalBottom: false,
  countProduct: 0,
  typeItem: 0,
  videoState: 2,
  userOffileState: null,
}

export const LiveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    updateNameProductComment: (state, action) => {
      state.nameProductComment = action.payload.name
    },
    updateShowModalBottom: (state, action) => {
      state.showModalBottom = action.payload.showModal
      state.typeItem = action.payload?.typeItem
    },
    updateCountProduct: (state, action) => {
      state.countProduct = action.payload.count
    },
    updateVideoState: (state, action) => {
      state.videoState = action.payload.state
    },
    updateUserOffileState: (state, action) => {
      state.userOffileState = action.payload?.userOffileState
    },
  },
})
export const {
  updateNameProductComment,
  updateShowModalBottom,
  updateCountProduct,
  updateVideoState,
  updateUserOffileState,
} = LiveSlice.actions
export default LiveSlice.reducer
