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

export function deptAttachmentList(deptId) {
  return request({
    url: '/admin/attachment/attachmentList/' + deptId,
    method: 'get'
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

export function delObj(id) {
  return request({
    url: '/admin/attachment/' + id,
    method: 'delete'
  })
}

