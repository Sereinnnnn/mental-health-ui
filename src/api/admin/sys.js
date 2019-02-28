import request from '@/router/axios'

export function getSysConfig() {
  return request({
    url: '/admin/sysConfig',
    method: 'get'
  })
}
