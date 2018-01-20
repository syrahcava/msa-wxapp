const util = require('../../utils/util.js')
const api = require('../../config/api.js')

const app = getApp()

Page({
  data: {
    cartGoods: [],
    cartTotal: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getCartList()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getCartList: function () {
    let that = this
    util.request(api.CartTotal).then(function (res) {
      that.setData({
        'cartTotal': res
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
              cartGoods: cartGoods
            })
          })
        }
      })
    })
  },
  updateCart: function (productId, productNumber) {
    let that = this

    //添加到购物车
    let url = `${api.NewApiRootUrl}products/${productId}/`
    util.request(api.CartAdd, {
      url: url,
      quantity: productNumber
    }, "POST")
      .then(function (res) {
        if (!res.reason) {
          that.setData({
            'cartTotal': res
          })
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: '出现未知错误！',
            mask: true
          })
        }
      })
  },
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let cartNumber = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1
    cartItem.number = cartNumber
    this.setData({
      cartGoods: this.data.cartGoods
    })
    // api只提供累加接口，故每次减少数量直接添加-1
    this.updateCart(cartItem.product_id, -1)
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let cartNumber = cartItem.number + 1
    cartItem.number = cartNumber
    this.setData({
      cartGoods: this.data.cartGoods
    })
    // api只提供累加接口，故每次增加数量直接添加1
    this.updateCart(cartItem.product_id, 1)

  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this
    
    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true
      } else {
        return false
      }
    })

    if (productIds.length <= 0) {
      return false
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id
      }
    })

    util.request(api.CartDelete, {
      productIds: productIds.join(',')
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        let cartList = res.data.cartList.map(v => {
          console.log(v)
          v.checked = false
          return v
        })

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        })
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      })
    })
  }
})