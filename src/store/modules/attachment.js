import { setStore, getStore } from '@/utils/store'
import { attachmentConfig } from '@/api/admin/attachment'

const attachment = {
  state: {
    attachmentConfig: getStore({
      name: 'attachment_config'
    }) || {}
  },
  actions: {
    // 获取附件配置
    GetAttachmentConfig({ commit }) {
      return new Promise((resolve, reject) => {
        attachmentConfig().then(response => {
          const data = response.data.data
          commit('SET_ATTACHMENT_CONFIG', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_ATTACHMENT_CONFIG: (state, attachmentConfig) => {
      state.attachmentConfig = attachmentConfig
      setStore({
        name: 'attachment_config',
        content: state.attachmentConfig,
        type: 'session'
      })
    }
  }
}
export default attachment

