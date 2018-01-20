const util = require('../../utils/util.js')
const api = require('../../config/api.js')
const user = require('../../services/user.js')

const app = getApp()

Page({
  data: {
    newGoods: [],
    starGoods: [],
    banner: [],
  },
  onShareAppMessage: function () {
    return {
      title: 'MSA',
      desc: 'MSA',
      path: '/pages/index/index'
    }
  },
  getIndexData: function () {
    let that = this
    util.requestWithoutToken(api.NewestProductList).then(function(res){
      if (res.code === "0") {
        that.setData({
          newGoods: res.data.newestProductList
        })
      }
    })
    util.requestWithoutToken(api.StarProductList).then(function (res) {
      if (res.code === "0") {
        that.setData({
          starGoods: res.data.starProductList
        })
      }
    })
  },
  onLoad: function (options) {
    this.getIndexData()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
