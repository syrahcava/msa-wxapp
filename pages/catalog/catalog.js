const util = require('../../utils/util.js')
const api = require('../../config/api.js')
const app = getApp()

Page({
  data: {
    navList: [],
    categoryList: [],
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  onLoad: function (options) {
    this.getCatalog()
  },
  onPullDownRefresh: function () {
    this.getCatalog()
    wx.stopPullDownRefresh()
  },
  getCatalog: function () {
    //CatalogList
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    util.requestWithoutToken(api.CatalogList).then(function (res) {
        that.setData({
          navList: res.data.categoryList,
          currentCategory: res.data.categoryList[0]
      })
      that.getCurrentCategory(that.data.currentCategory.id)
        wx.hideLoading()
      })
    // util.request(api.GoodsCount).then(function (res) {
    //   that.setData({
    //     goodsCount: res.data.goodsCount
    //   });
    // });

  },
  getCurrentCategory: function (id) {
    let that = this
    let currentCategory = that.data.navList.find((obj)=>obj.id==id)
    util.requestWithoutToken(api.CatalogCurrent(id))
      .then(function (res) {
        currentCategory.child = res.data.categoryList
        that.setData({
          currentCategory: currentCategory
        })
        // 临时存储当前根分类下的所有分类数据，用于后续页面的显示（避免二次查询）
        app.globalData.currentCategories = res.data.categoryList
      })
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
  getList: function () {
    var that = this;
    util.requestWithoutToken(api.ApiRootUrl + 'api/catalog/' + that.data.currentCategory.cat_id)
      .then(function (res) {
        that.setData({
          categoryList: res.data,
        });
      });
  },
  switchCate: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }

    this.getCurrentCategory(event.currentTarget.dataset.id);
  }
})