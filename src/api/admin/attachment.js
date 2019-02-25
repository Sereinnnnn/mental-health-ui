import request from '@/router/axios'

export function attachmentList() {
  return request({
    url: '/admin/attachment/attachmentList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/attachment/attachmentList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/admin/attachment/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/attachment/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/attachment/',
    method: 'put',
    data: obj
  })
}

export function delAttachment(id) {
  return request({
    url: '/admin/attachment/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/admin/attachment/deleteAll',
    method: 'post',
    data: obj
  })
}

export function attachmentConfig() {
  return request({
    url: '/admin/attachment/attachmentConfig',
    method: 'get'
  })
}

