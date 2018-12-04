import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/user/userList',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function updateObjInfo(obj) {
  return request({
    url: '/admin/user/updateInfo',
    method: 'put',
    data: obj
  })
}

export function delAllObj(obj) {
  return request({
    url: '/admin/user/deleteAll',
    method: 'post',
    data: obj
  })
}

