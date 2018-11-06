const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  access_token: state => state.user.access_token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  setting: state => state.user.setting,
  permissions: state => state.user.permissions,
  addRouters: state => state.permission.addRouters,
  menu: state => state.user.menu,
  isCollapse: state => state.common.isCollapse,
  errorLogs: state => state.errorLog.logs
}
export default getters
