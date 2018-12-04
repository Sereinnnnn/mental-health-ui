import request from '@/router/axios'

export function fetchTree(query) {
  return request({
    url: '/exam/subjectCategory/categories',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/subjectCategory/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/exam/subjectCategory/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/exam/subjectCategory/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/subjectCategory/',
    method: 'put',
    data: obj
  })
}

