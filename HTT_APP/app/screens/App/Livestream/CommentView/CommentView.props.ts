import { ViewStyle } from 'react-native'

export interface Comments {
  msg_id: number
  user_id: number
  content: string
  live_stream_id: number
  role?: number
  name?: string
  isSelf?: number
  user_profile_url?: string
}

export interface CommentViewProps {
  renderComment?: ({
    item,
    index,
  }: {
    item: any
    index: number
  }) => React.ReactElement
  socket?: any
  userInfo?: any
  initItems?: Comments[]
  stylesViewList?: ViewStyle
  isWatching?: boolean | undefined
  shopId?: number
}

export interface CommentViewHandles {
  sendComment(comment: Comments): void
  sendComments(comments: Comments[]): void
}
