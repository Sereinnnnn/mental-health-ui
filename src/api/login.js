import request from '@/router/axios'
import { baseUrl } from '@/config/env'

export function loginByUsername(username, password, code, randomStr) {
  const grant_type = 'password'
  const scope = 'server'
  return request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': 'Basic '
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

