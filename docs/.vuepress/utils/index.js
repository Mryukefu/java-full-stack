let CryptoJS = require('crypto-js')

export default {
  strToMD5(str) {
    return CryptoJS.MD5(CryptoJS.MD5(str).toString()).toString()
  }
}