const util = require('../../../utils/util.js')
const api = require('../../../config/api.js')
const pay = require('../../../services/pay.js')

const app = getApp()

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0
  },
  onLoad: function (options) {
    try {
      let addressId = wx.getStorageSync('addressId')
      if (addressId) {
        this.setData({
          'addressId': addressId
        })
      }

      let couponId = wx.getStorageSync('couponId')
      if (couponId) {
        this.setData({
          'couponId': couponId
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  getCheckoutInfo: function () {
    let that = this
    if (that.data.addressId === 0) {
      util.request(api.AddressDefault).then(function (res) {
        if (res.code === "0") {
          if (res.data.userAddressDefault === '') {
            wx.navigateTo({
              url: '/pages/shopping/addressAdd/addressAdd',
            })
          }
          that.setData({
            checkedAddress: res.data.userAddressDefault
          })
          wx.hideLoading()
        }
      })
    } else {
      util.request(api.AddressDetail(that.data.addressId)).then(function (res) {
        if (res.code === "0") {
          that.setData({
            checkedAddress: res.data.userAddress
          })
          wx.hideLoading()
        }
      })
    }
    util.request(api.CartTotal).then(function (res) {
      that.setData({
        'goodsTotalPrice': res.total_incl_tax_excl_discounts,
        'actualPrice': res.total_incl_tax,
        'couponPrice': res.total_incl_tax_excl_discounts - res.total_incl_tax,
        'couponList': res.offer_discounts
      })
      util.request(api.CartLines(res.id)).then(function (res) {
        let cartGoods = []
        for (let item of res) {
          let goods = {}
          goods.number = item.quantity
          goods.retail_price = item.price_incl_tax
          util.request(item.product).then(function (resProduct) {
            goods.goods_name = resProduct.data.product.title
            goods.product_id = resProduct.data.product.id
            goods.list_pic_url = resProduct.data.product.primary_image.original
            cartGoods.push(goods)
            that.setData({
              checkedGoodsList: cartGoods
            })
          })
        }
      })
    })
    // util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       checkedGoodsList: res.data.checkedGoodsList,
    //       checkedAddress: res.data.checkedAddress,
    //       actualPrice: res.data.actualPrice,
    //       checkedCoupon: res.data.checkedCoupon,
    //       couponList: res.data.couponList,
    //       couponPrice: res.data.couponPrice,
    //       freightPrice: res.data.freightPrice,
    //       goodsTotalPrice: res.data.goodsTotalPrice,
    //       orderTotalPrice: res.data.orderTotalPrice
    //     });
    //   }
    //   wx.hideLoading();
    // });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo()

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})