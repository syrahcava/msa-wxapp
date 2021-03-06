/**
 * 用户相关服务
 */

const util = require('../utils/util.js')
const api = require('../config/api.js')


/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code
      return util.getUserInfo()
    }).then((userInfo) => {
      console.log(userInfo)
      // //登录远程服务器
      util.requestWithoutToken(api.AuthLoginByWeixin, {
        code: code,
        iv: userInfo.iv,
        encryptedData: userInfo.encryptedData
      }, 'POST')
        .then(res => {
          if (res.code === '0') {
            //存储用户信息
            wx.setStorageSync('userInfo', userInfo.userInfo)
            wx.setStorageSync('token', res.data.token)
            resolve(res)
          } else {
            reject(res)
          }
        }).catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true)
      }).catch(() => {
        reject(false)
      })
    } else {
      reject(false)
    }
  })
}


module.exports = {
  loginByWeixin,
  checkLogin,
}











