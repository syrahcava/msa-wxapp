const util = require('./utils/util.js')
const api = require('./config/api.js')
const user = require('./services/user.js')

App({
  onLaunch: function () {
    const that = this
    //获取用户的登录信息
    that.gologin()
    // this.gologin()
    // user.checkLogin().then(res => {
    //   console.log('app login')
    //   this.globalData.userInfo = wx.getStorageSync('userInfo')
    //   this.globalData.token = wx.getStorageSync('token')
    // }).catch(() => {

    // })
  },
  gologin: function () {
    const that = this
    let code = null
    console.log('loginByWeixin')
    wx.login({
      success: function (res) {
        code = res.code
        wx.getUserInfo({
          success: function (userInfo) {
            // 当用户授权成功的时候，保存用户的登录信息
            //登录远程服务器
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
                  that.globalData.userInfo = userInfo.userInfo
                  that.globalData.token = res.data.token
                }
              })
          },
          fail: function (res) { //用户点了“拒绝”
            console.log(res)
            wx.showModal({
              title: '登陆提示',
              content: '登陆失败，请确保成功授权登陆',
              showCancel: false,
              confirmText: '授权登陆',
              success: function (res) {
                console.log(res)
                wx.openSetting({
                  success: function (res) {
                    wx.authorize({
                      scope: 'scope.userInfo',
                      success() {
                        that.gologin()
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  globalData: {
    userInfo: {
      // nickname: 'Hi,游客',
      // username: '点击去登录',
      // avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    token: '',
  }
})