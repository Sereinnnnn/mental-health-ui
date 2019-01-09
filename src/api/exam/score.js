import request from '@/router/axios'

export function scoreList() {
  return request({
    url: '/exam/score/scoreList',
    method: 'get'
  })
}

export function fetchScoreList(query) {
  return request({
    url: '/exam/score/scoreList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/score/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/score/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/score/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/exam/score/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/exam/score/deleteAll',
    method: 'post',
    data: obj
  })
}

// 导出
export function exportObj(obj) {
  return request({
    url: '/exam/score/export',
    method: 'post',
    responseType: 'arraybuffer',
    headers: { 'filename': 'utf-8' },
    data: obj
  })
}
