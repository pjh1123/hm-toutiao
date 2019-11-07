import axios from 'axios'
import local from '@/utils/local.js'
import router from '@/router'
import JSONBIG from 'json-bigint'
// 对axios进行配置
// 基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [
  data => {
    // 如果后台没有数据，data==null 使用这个转换方式就会报错
    try {
      return JSONBIG.parse(data)
    } catch (e) {
      // 如果出现错误就不做转换处理，return原始数据
      return data
    }
  }
]

axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    let user = local.getUser() || {}
    config.headers.Authorization = `Bearer ${user.token}`
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  res => res,
  err => {
    // 获取响应状态码  err.response 响应对象  err.response.status 状态码
    if (err.response.status === 401) {
      // 如果是401跳转登录
      return router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default axios
