export interface Notification {
  id: number
  user_id: number
  title: string
  content: string
  is_read: number
  url: null
  data: Data
  df_notification_id: number
  is_push: number
  is_active: number
  create_by: null
  update_by: null
  delete_by: null
  create_at: string
  update_at: string
  delete_at: null
  version: number
  shop_id: null
}

export interface Data {
  order_id?: number
  post_id?: number
  live_stream_id?: number
}
