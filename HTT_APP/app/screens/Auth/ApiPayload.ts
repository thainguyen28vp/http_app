import { exp } from "react-native-reanimated";

export interface LoginPayload {
  user_name?: string
  password: string
}

export interface RegisterPayload {
  name: string,
  phone: string,
  email: string,
  password: string
}
export interface LogoutPayload {
  token: string
}
export interface ForgotPassword {
  email: string,
}


