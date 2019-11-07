const KEY = 'pc-toutian-key'
const local = {
  // 存储
  setUser (userValue) {
    userValue = JSON.stringify(userValue)
    window.sessionStorage.setItem(KEY, userValue)
  },
  // 获取
  getUser () {
    let user = window.sessionStorage.getItem(KEY)
    return JSON.parse(user)
  },
  // 清除
  delUser () {
    window.sessionStorage.removeItem(KEY)
  }
}
export default local
