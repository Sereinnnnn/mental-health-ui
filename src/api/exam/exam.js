import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/exam/examination/examinationList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/examination/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/examination/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/examination/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/exam/examination/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/exam/examination/deleteAll',
    method: 'post',
    data: obj
  })
}
