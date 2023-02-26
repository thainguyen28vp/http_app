export interface Shop {
  profile_picture_url: null
  id: number
  name: string
  phone: string
  pancake_shop_key: string
  pancake_shop_id: string
  email: string
  livestream_enable: number
  status: number
  stream_minutes_available: number
  is_active: number
  create_at: string
  update_at: string
  delete_at: null
  count_product: number
  star: number
  status_follow: number
}

export interface Category {
  icon_url: string
  id: number
  name: string
  order: number
  status: number
  is_active: number
  create_at: string
  children_category_id: number
}
