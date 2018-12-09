import request from '@/router/axios'

export function subjectBankList() {
  return request({
    url: '/exam/subjectBank/subjectBankList',
    method: 'get'
  })
}

export function fetchSubjectBankList(query) {
  return request({
    url: '/exam/subjectBank/subjectBankList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/subjectBank/' + id,
    method: 'get'
  })
}

export function addSubjectBank(obj) {
  return request({
    url: '/exam/subjectBank/',
    method: 'post',
    data: obj
  })
}

export function putSubjectBank(obj) {
  return request({
    url: '/exam/subjectBank/',
    method: 'put',
    data: obj
  })
}

export function delSubjectBank(id) {
  return request({
    url: '/exam/subjectBank/' + id,
    method: 'delete'
  })
}

export function delAllSubjectBank(obj) {
  return request({
    url: '/exam/subjectBank/deleteAll',
    method: 'post',
    data: obj
  })
}
