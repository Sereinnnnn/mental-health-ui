/**
 *
 * http配置
 *
 */
import axios from 'axios'
import store from '../store'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import errorCode from '@/const/errorCode'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
const whiteList = ['/auth/authentication/removeToken']// 白名单

// 超时时间
axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true
NProgress.configure({ showSpinner: false })// NProgress Configuration
// HTTPrequest拦截
axios.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.access_token && whiteList.indexOf(config.url) === -1) {
    config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axios.interceptors.response.use(data => {
  NProgress.done()
  return data
}, error => {
  NProgress.done()
  const errMsg = error.toString()
  const code = errMsg.substr(errMsg.indexOf('code') + 5)
  console.log(code)
  Message({
    message: errorCode[code] || errorCode['default'],
    type: 'error'
  })
  return Promise.reject(new Error(error))
})

export default axios
