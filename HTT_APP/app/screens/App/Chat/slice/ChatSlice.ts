import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { GenericInitialState } from '@common'
import reactotron from 'ReactotronConfig'

let initialState: GenericInitialState<any> = {
  messageNotRead: [],
}

export const ChatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    clearCountNotRead: state => {
      state.messageNotRead = []
    },
    updateCountNotRead: (state, action) => {
      state.messageNotRead = action.payload
    },
    markIsReaded: (state, action) => {
      const idx = state.messageNotRead?.findIndex(
        item => item.topic_message_id == action.payload
      )
      if (!!idx) {
        state.messageNotRead?.splice(idx, 1)
      }
    },
  },
})

export const { clearCountNotRead, updateCountNotRead, markIsReaded } =
  ChatSlice.actions

export default ChatSlice.reducer
