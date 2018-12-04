import request from '@/router/axios'

export function subjectList() {
  return request({
    url: '/exam/subject/subjectList',
    method: 'get'
  })
}

export function fetchSubjectList(query) {
  return request({
    url: '/exam/subject/subjectList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/subject/' + id,
    method: 'get'
  })
}

export function addSubject(obj) {
  return request({
    url: '/exam/subject/',
    method: 'post',
    data: obj
  })
}

export function putSubject(obj) {
  return request({
    url: '/exam/subject/',
    method: 'put',
    data: obj
  })
}

export function delSubject(id) {
  return request({
    url: '/exam/subject/' + id,
    method: 'delete'
  })
}

export function delAllSubject(obj) {
  return request({
    url: '/exam/subject/deleteAll',
    method: 'post',
    data: obj
  })
}
