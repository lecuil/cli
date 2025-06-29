import type { LoginBody } from '@/api/user/type'
import http from '@/utils/http'

/**
 * 用户登录
 * @param data
 */
export const userLogin = (data: LoginBody) => http.post<string, LoginBody>('login', data)
