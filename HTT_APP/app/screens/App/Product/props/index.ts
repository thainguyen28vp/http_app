// Generated by https://quicktype.io

export interface ListProductProps {
  rows: Row[]
  listCategory: ListCategory[]
}

export interface ListCategory {
  icon_url: string
  id: number
  name: string
}

export interface Row {
  id: number
  name: string
  category_id: number
  star: number | null
  category_name: string
  quantity_items: string
  min_max_price: string
  stock_id: number
  Category: Category
  ProductMedia: ProductMedia[]
  ProductPrices: ProductPrice[]
  OrderItems: OrderItem[]
}

export interface Category {
  id: number
  name: string
}

export interface OrderItem {
  id: number
  amount: number
  Order: Order
}

export interface Order {
  id: number
}

export interface ProductMedia {
  media_url: string
  id: number
  type: number
}

export interface ProductPrice {
  id: number
  product_id: number
  percent: number
  stock_id: number
  price: number
  status: number
}
