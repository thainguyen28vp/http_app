export interface ProvincePayload {
  search?: string
}

export interface DistrictPayload {
  province_id: number
  search?: string
}

export interface WardPayload {
  district_id: number
  search?: string
}
