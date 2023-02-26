import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericInitialState } from '@common'
import { getListPost } from '@app/service/Network/home/HomeApi'
import { PostPayload } from '@app/service/Network/home/HomeApiPayload'
import reactotron from 'ReactotronConfig'
import { DEFAULT_PARAMS } from '@app/config/Constants'

let initialState: GenericInitialState<any> = {
  isContentLoading: true,
  error: null,
  isLoadMore: false,
  isLastPage: false,
  data: [],
}

export const reuqestGetListPost = createAsyncThunk(
  'post',
  async (payload: PostPayload) => {
    return await getListPost(payload)
  }
)

export const PostSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    deletePost: (state, action) => {
      let target = state.data?.find(item => item.id == action.payload)
      state.data?.splice(state.data.indexOf(target), 1)
    },
  },
  extraReducers: builder => {
    builder.addCase(reuqestGetListPost.pending, (state, action) => {
      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isContentLoading = true
      } else {
        state.isLoadMore = true
      }
    })
    builder.addCase(reuqestGetListPost.fulfilled, (state, action) => {
      state.error = false

      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isContentLoading = false
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
    builder.addCase(reuqestGetListPost.rejected, (state, action) => {
      if (action.meta.arg.page == DEFAULT_PARAMS.PAGE) {
        state.isContentLoading = false
      } else {
        state.isLoadMore = false
      }
      state.error = true
    })
  },
})

export const { deletePost } = PostSlice.actions

export default PostSlice.reducer
