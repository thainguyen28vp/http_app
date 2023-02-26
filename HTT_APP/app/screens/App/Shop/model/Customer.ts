export interface Customer {
  id: number
  name: string
  phone: string
  phone_number: string
  user_id: number
  df_province_id: number
  df_district_id: number
  df_ward_id: number
  lat: number
  long: number
  location_address: string
  address: string
  is_default: number
  is_active: number
  create_by: null
  update_by: null
  delete_by: null
  create_at: string
  update_at: string
  delete_at: null
  version: number
  province_name: string
  district_name: string
  ward_name: string
  ward: {
    id: number
    name: string
  }
  district: {
    id: number
    name: string
  }
  province: {
    id: number
    name: string
  }
}
