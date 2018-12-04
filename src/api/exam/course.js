import request from '@/router/axios'

export function courseList() {
  return request({
    url: '/exam/course/courseList',
    method: 'get'
  })
}

export function fetchCourseList(query) {
  return request({
    url: '/exam/course/courseList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/course/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/course/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/course/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/exam/course/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/exam/course/deleteAll',
    method: 'post',
    data: obj
  })
}
