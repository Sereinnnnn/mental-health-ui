import request from '@/router/axios'

const baseExaminationUrl = '/exam/api/v1/examination/'

export function fetchList(query) {
  return request({
    url: baseExaminationUrl + 'examinationList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: baseExaminationUrl + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: baseExaminationUrl,
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: baseExaminationUrl,
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: baseExaminationUrl + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: baseExaminationUrl + 'deleteAll',
    method: 'post',
    data: obj
  })
}
