import request from '@/router/axios'

export function examRecordList() {
  return request({
    url: '/exam/examRecord/examRecordList',
    method: 'get'
  })
}

export function fetchExamRecordList(query) {
  return request({
    url: '/exam/examRecord/examRecordList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/examRecord/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/examRecord/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/examRecord/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/exam/examRecord/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/exam/examRecord/deleteAll',
    method: 'post',
    data: obj
  })
}

// 导出
export function exportObj(obj) {
  return request({
    url: '/exam/examRecord/export',
    method: 'post',
    responseType: 'arraybuffer',
    headers: { 'filename': 'utf-8' },
    data: obj
  })
}
