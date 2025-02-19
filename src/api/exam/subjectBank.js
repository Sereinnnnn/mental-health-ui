import request from '@/router/axios'

const baseSubjectBankUrl = '/exam/api/v1/subjectBank/'

export function subjectBankList() {
  return request({
    url: baseSubjectBankUrl + 'subjectBankList',
    method: 'get'
  })
}

export function fetchSubjectBankList(query) {
  return request({
    url: baseSubjectBankUrl + 'subjectBankList',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return request({
    url: baseSubjectBankUrl + id,
    method: 'get'
  })
}

export function addSubjectBank(obj) {
  return request({
    url: baseSubjectBankUrl,
    method: 'post',
    data: obj
  })
}

export function putSubjectBank(obj) {
  return request({
    url: baseSubjectBankUrl,
    method: 'put',
    data: obj
  })
}

export function delSubjectBank(id) {
  return request({
    url: baseSubjectBankUrl + id,
    method: 'delete'
  })
}

export function delAllSubjectBank(obj) {
  return request({
    url: baseSubjectBankUrl + 'deleteAll',
    method: 'post',
    data: obj
  })
}

// 导出
export function exportSubjectBank(obj) {
  return request({
    url: baseSubjectBankUrl + 'export',
    method: 'post',
    responseType: 'arraybuffer',
    headers: { 'filename': 'utf-8' },
    data: obj
  })
}
