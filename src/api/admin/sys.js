import request from '@/router/axios'

export function getSysConfig() {
  return request({
    url: '/admin/api/v1/sysConfig',
    method: 'get'
  })
}

/**
 * 首页数据
 */
export function getDashboard() {
  return request({
    url: '/admin/api/v1/dashboard',
    method: 'get'
  })
}
