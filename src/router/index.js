import Vue from 'vue'
import VueRouter from 'vue-router'

import local from '@/utils/local.js'

// import Login from '@/views/login'
// import Home from '@/views/home'
// import Welcome from '@/views/welcome'
// import NotFind from '@/views/404'
// import article from '@/views/article'
// import Image from '@/views/image'
// import Publish from '@/views/publish'
// import Comment from '@/views/comment'
// import Setting from '@/views/setting'
// import Fans from '@/views/fans'

const Login = () => import('@/views/login')
const Home = () => import('@/views/home')
const Welcome = () => import('@/views/welcome')
const NotFind = () => import('@/views/404')
const article = () => import('@/views/article')
const Image = () => import('@/views/image')
const Publish = () => import('@/views/publish')
const Comment = () => import('@/views/comment')
const Setting = () => import('@/views/setting')
const Fans = () => import('@/views/fans')
Vue.use(VueRouter)

const router = new VueRouter({
  // 配置对象
  // 路由规则选项 routes  若干规则
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          // 欢迎页面
          path: '/',
          component: Welcome
        },
        {
          // 内容管理
          path: '/article',
          component: article
        },
        {
          // 素材管理
          path: '/image',
          component: Image
        },
        {
          // 发布文章
          path: '/publish',
          component: Publish
        },
        {
          // 评论管理
          path: '/comment',
          component: Comment
        },
        {
          // 个人设置
          path: '/setting',
          component: Setting
        },
        {
          // 粉丝管理
          path: '/fans',
          component: Fans
        }
      ]
    },
    {
      path: '*',
      component: NotFind
    }
  ]
})
// 路由的 导航守卫（前置导航守卫）
router.beforeEach((to, from, next) => {
  const user = local.getUser()
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
export default router
