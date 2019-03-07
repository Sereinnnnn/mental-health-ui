import request from '@/router/axios'

const baseDeptUrl = '/admin/api/v1/dept/'

export function fetchTree(query) {
  return request({
    url: baseDeptUrl + 'depts',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: baseDeptUrl + 'dept/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: baseDeptUrl + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: baseDeptUrl + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: baseDeptUrl,
    method: 'put',
    data: obj
  })
}
