const util = require('../../../utils/util.js')
const api = require('../../../config/api.js')
const app = getApp()

Page({
  data: {
    address: {
      id: 0,
      first_name: '',
      phone_number: '',
      state: '', // 省
      line4: '', // 市
      line1: '', // 区
      line2: '', // 详细地址, 如街道、楼盘号等
    },
    region: [],
    addressId: 0,
  },
  bindinputName(event) {
    let address = this.data.address
    address.first_name = event.detail.value
    this.setData({
      address: address
    })
  },
  bindinputMobile(event) {
    let address = this.data.address
    address.phone_number = event.detail.value
    this.setData({
      address: address
    })
  },
  bindRegionChange: function (e) {
    let address = this.data.address
    let region = e.detail.value
    address.state = region[0]
    address.line4 = region[1]
    address.line1 = region[2]
    this.setData({
      address: address,
      region: region
    })
  },
  bindinputAddress(event) {
    let address = this.data.address
    address.line2 = event.detail.value
    this.setData({
      address: address
    })
  },
  getAddressDetail() {
    let that = this
    let region = that.data.region
    util.request(api.AddressDetail(that.data.addressId)).then(function (res) {
      if (res.code === '0') {
        region[0] = res.data.userAddress.state
        region[1] = res.data.userAddress.line4
        region[2] = res.data.userAddress.line1
        that.setData({
          address: res.data.userAddress,
          region: region
        })
      }
    })
  },
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        addressId: options.id
      })
      this.getAddressDetail()
    } else {
      let that = this
      wx.chooseAddress({
        success: function (res) {
          let address = that.data.address
          let region = that.data.region
          address.first_name = res.userName
          address.phone_number = res.telNumber
          address.state = region[0] = res.provinceName
          address.line4 = region[1] = res.cityName
          address.line1 = region[2] = res.countyName
          address.line2 = res.detailInfo
          that.setData({
            address: address,
            region: region
          })
        }
      })
    }

  },
  onReady: function () {

  },
  saveAddress() {
    let that = this
    let address = that.data.address

    if (address.name == '') {
      util.showErrorToast('请输入姓名')
      return false
    }
    if (address.mobile == '') {
      util.showErrorToast('请输入手机号码')
      return false
    }
    if (address.state == '') {
      util.showErrorToast('请输入省市区')
      return false
    }
    if (address.line2 == '') {
      util.showErrorToast('请输入详细地址')
      return false
    }

    let id = address.id
    if (id === 0) {
      util.request(api.AddressCreate, {
        first_name: address.first_name,
        phone_number: address.phone_number,
        state: address.state,
        line4: address.line4,
        line1: address.line1,
        line2: address.line2
      }, 'POST').then(function (res) {
        if (res.code === '0') {
          // wx.reLaunch({
          //   url: '/pages/shopping/address/address',
          // })
          wx.navigateBack()
        }
      })
    } else {
      util.request(api.AddressUpdate(id), {
        first_name: address.first_name,
        phone_number: address.phone_number,
        state: address.state,
        line4: address.line4,
        line1: address.line1,
        line2: address.line2
      }, 'PUT').then(function (res) {
        if (res.code === '0') {
          // wx.reLaunch({
          //   url: '/pages/shopping/address/address',
          // })
          wx.navigateBack()
        }
      })
    }
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})