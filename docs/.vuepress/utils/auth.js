export default {
  getToken() {
    let localTokenStr = localStorage.getItem('login-user')
    if (!localTokenStr) {
      console.error('未登录')
      return false
    }

    return JSON.parse(localTokenStr).token
  },
  removeToken() {
    localStorage.removeItem('login-user')
  },
  getCurrentUser() {
    let localTokenStr = localStorage.getItem('login-user')
    if (!localTokenStr) {
      console.error('未登录')
      return null
    }
    return JSON.parse(localTokenStr)
  }
}