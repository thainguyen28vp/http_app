export interface PostPayload {
  search?: string
  user_id?: number
  shop_id?: number
  topic_id?: number
  from_date?: string
  to_date?: string
  page?: number
  user_role?: string
}

export interface CommentPayload {
  user_id?: number
  shop_id?: string
  post_id?: number
  livestream_id?: number
  comment_id?: number
}
