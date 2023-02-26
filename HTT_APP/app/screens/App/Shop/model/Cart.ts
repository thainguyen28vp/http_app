export interface Enterprise {
  profile_picture_url: string | undefined
  id: number
  name: string
  phone: string
  maxCreatedAt: string
  Stocks: Stock[]
  isCheck?: boolean
  pancake_shop_key: string | null
}

export interface Stock {
  id: number
  name: string
  ProductPrices: ProductPrice[]
  isCheck?: boolean
  voucher?: any
}

export interface ProductPrice {
  id: number
  product_id: number
  stock_id: number
  custom_attribute_option_id_1: number
  custom_attribute_option_id_2: number
  price: number
  product_name: string
  media_url: string
  create_at_Cart: string
  Carts: null
  product_attribute_name_1: ProductAttributeName
  product_attribute_name_2: ProductAttributeName
  Cart: CartClass
  isCheck?: boolean
}

// export interface Voucher {
//   id: number
//   gift_id: number
//   user_id: number
//   address: null
//   status: number
//   is_active: number
//   create_by: number
//   update_by: null
//   delete_by: null
//   create_at: string
//   update_at: string
//   delete_at: null
//   version: number
//   Gift: Gift
// }

// export interface Gift {
//   icon_url: string
//   id: number
//   df_type_gift_id: number
//   name: string
//   price: number
//   quantity: number
//   discount_percent: number
//   max_discount_money: number
//   status: number
//   is_active: number
//   create_by: number
//   update_by: number
//   delete_by: null
//   create_at: string
//   update_at: string
//   delete_at: null
//   version: number
// }

export interface CartClass {
  id: number
  user_id: number
  amount: number
  product_price_id: number
}

export interface ProductAttributeName {
  id: number
  product_custom_attribute_id: number
  name: string
  is_active: number
}
