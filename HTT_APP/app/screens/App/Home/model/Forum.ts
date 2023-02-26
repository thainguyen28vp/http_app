export interface Topic {
  icon_url: string
  id: number
  name: string
  order: number
  description: string
  status: number
  is_active: number
  create_at: string
  update_at: string
  delete_at: null | string
}

export interface Post {
  id: number
  user_id: number
  shop_id: null
  topic_id: number
  content: string
  count_like: number
  count_comment: number
  status: number
  is_active: number
  create_at: string
  update_at: string
  delete_at: null
  User: User
  Shop: null
  PostMedia: PostMedia[]
  Product: Product
  Reactions: any[]
  is_reaction: number
}

export interface PostMedia {
  media_url: string
  id: number
  post_id: number
  type: null
  is_active: number
  create_at: string
  update_at: string
  delete_at: null
}

export interface User {
  profile_picture_url: string
  id: number
  shop_id: null
  df_type_user_id: number
  user_name: string
  last_login_date: string
  expired_reset_password: null
  device_id: null
  name: string
  phone: string
  email: string
  point: number
  status: number
  date_of_birth: null
  gender: null
  is_active: number
  create_at: string
  update_at: string
  delete_at: string
}

export interface Comment {
  id: number
  user_id: number
  shop_id: null
  post_id: number
  livestream_id: null
  parent_id: number | null
  content: string
  count_like: number
  is_active: number
  create_at: string
  update_at: string
  delete_at: null
  count_sub_comment?: number
  User?: User
  Shop?: null
  Comments?: Comment[]
  is_reaction: number
  target_user?: User
}

export interface Product {
  id:                 number;
  shop_id:            number;
  category_id:        number;
  code:               string;
  name:               string;
  description:        string;
  price:              number;
  star:               null;
  status:             number;
  stock_status:       number;
  is_active:          number;
  create_by:          null;
  update_by:          null;
  delete_by:          null;
  create_at:          string;
  update_at:          string;
  delete_at:          null;
  product_pancake_id: string;
  stock_id:           number;
  media_url:          string;
  min_max_price:      string;
}

export interface Paging {
  page: number
  limit: number
  totalItemCount: number
}
