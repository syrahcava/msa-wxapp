const util = require('../../../utils/util.js')
const api = require('../../../config/api.js')
const app = getApp()

Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // this.getAddressList()
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList()
  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      that.setData({
        addressList: res
      })
    })
  },
  addressAddOrUpdate (event) {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  selectAddress(event){
    try {
      wx.setStorageSync('addressId', event.currentTarget.dataset.addressId)
    } catch (e) {

    }

    //选择该收货地址
    wx.redirectTo({
      url: '/pages/shopping/checkout/checkout'
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})