const util = require('../../utils/util.js')
const api = require('../../config/api.js')
const app = getApp()

Page({
  data: {
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000
  },
  onLoad: function (options) {
    let that = this
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      })
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        })
      }
    })

    this.getCategoryInfo()
  },
  getCategoryInfo: function () {
    let that = this
    let currentCategory = app.globalData.currentCategories.find((obj) => obj.id == that.data.id)
    that.setData({
      navList: app.globalData.currentCategories,
      currentCategory: currentCategory
    })
    //nav位置
    let currentIndex = 0
    let navListCount = that.data.navList.length
    for (let i = 0; i < navListCount; i++) {
      currentIndex += 1
      if (that.data.navList[i].id == that.data.id) {
        break
      }
    }
    if (currentIndex > navListCount / 2 && navListCount > 5) {
      that.setData({
        scrollLeft: currentIndex * 60
      })
    }
    that.getGoodsList()
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
  getGoodsList: function () {
    let that = this
    util.requestWithoutToken(api.GoodsList(that.data.id))
      .then(function (res) {
        that.setData({
          goodsList: res.data.productList,
        })
      })
  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false
    }
    let that = this
    let clientX = event.detail.x
    let currentTarget = event.currentTarget
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      })
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      })
    }
    this.setData({
      id: event.currentTarget.dataset.id
    })

    this.getCategoryInfo()
  }
})