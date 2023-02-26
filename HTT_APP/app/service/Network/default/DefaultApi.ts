import { ApiClient } from '../ApiService'
import { DistrictPayload, WardPayload } from './PayloadProps'

export const getListProvince = (payload: any) =>
  ApiClient.get('/api/v1/address/provinces', payload)

export const getListDistrict = (payload: DistrictPayload) =>
  ApiClient.get(`/api/v1/address/districts`, { params: payload })

export const getListWard = (payload: WardPayload) =>
  ApiClient.get(`/api/v1/address/wards?district_id=${payload.district_id}`)

export const requestUploadImage = (payload: any) =>
  ApiClient.post(`files/uploadImage`, payload)
