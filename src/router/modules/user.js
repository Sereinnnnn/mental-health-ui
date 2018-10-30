import Layout from '@/views/layout/Layout'

const userManagementRouter = {
  path: '/system_management',
  component: Layout,
  name: 'system_management',
  meta: {
    title: 'system_management',
    icon: 'table'
  },
  children: [
    {
      path: 'user_management',
      component: () => import('@/views/sys/user'),
      name: 'User',
      meta: { title: 'user_management' }
    }
  ]
}
export default userManagementRouter

