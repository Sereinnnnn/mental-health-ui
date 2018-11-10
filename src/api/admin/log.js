import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/log/logList',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/admin/log/' + id,
    method: 'delete'
  })
}
