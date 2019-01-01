import request from '@/router/axios'

export function fetchKnowledgeList(query) {
  return request({
    url: '/exam/knowledge/knowledgeList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: '/exam/knowledge/' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/exam/knowledge/',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/exam/knowledge/',
    method: 'put',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/exam/knowledge/' + id,
    method: 'delete'
  })
}

export function delAllObj(obj) {
  return request({
    url: '/exam/knowledge/deleteAll',
    method: 'post',
    data: obj
  })
}
