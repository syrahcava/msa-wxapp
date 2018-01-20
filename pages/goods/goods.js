const app = getApp()
const WxParse = require('../../lib/wxParse/wxParse.js')
const util = require('../../utils/util.js')
const api = require('../../config/api.js')

Page({
  data: {
    selectedProduct: -1,
    buynum: 1,
    id: 0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },
  getGoodsInfo: function () {
    let that = this
    util.requestWithoutToken(api.GoodsDetail(that.data.id)).then(function (res) {
      if (res.code === "0") {
        that.setData({
          goods: res.data.product,
          gallery: res.data.product.images,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect
        })

        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          })
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          })
        }

        // WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        // that.getGoodsRelated();
      }
    })

  },
  getGoodsRelated: function () {
    let that = this;
    util.requestWithoutToken(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  // 弹窗
  setModalStatus: function (e, open = false) {
    let animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step()

    this.setData({
      animationData: animation.export()
    })

    if (open || e.currentTarget.dataset.status == 1) {
      this.setData(
        {
          showModalStatus: true
        }
      )
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },
  // 加减
  changeNum: function (e) {
    var that = this;
    if (e.target.dataset.alphaBeta == 0) {
      if (this.data.buynum <= 1) {
        buynum: 1
      } else {
        this.setData({
          buynum: this.data.buynum - 1
        })
      };
    } else {
      this.setData({
        buynum: this.data.buynum + 1
      })
    };
  },
  /* 选择属性值事件 */
  selectAttrValue: function (e) {
    let text = e.currentTarget.dataset.text
    let value = e.currentTarget.dataset.value
    if (value == this.data.selectedProduct) {
      this.setData({
        selectedProduct: -1
      })
    } else {
      this.setData({
        selectedProduct: value
      })
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
    })
    let that = this
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then(function (res) {
      if (res.code === "0") {
        that.setData({
          cartGoodsCount: res.data.count
        })
      }
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
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect == 1) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            if (_res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  addToCart: function (e) {
    let that = this
    if (this.data.selectedProduct == -1) {
      that.setModalStatus(e, true)
      return false
    }
    // Todo: 需要验证库存

    //添加到购物车
    let url = `${api.NewApiRootUrl}products/${that.data.selectedProduct}/`
    util.request(api.CartAdd, {
      url: url,
      quantity: this.data.buynum
    }, "POST")
      .then(function (res) {
        if (!res.reason) {
          wx.showToast({
            title: '添加成功'
          })
          // Todo: 更新当前页面产品信息（如可用库存等）
          if (that.data.userHasCollect == 1) {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            })
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            })
          }
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: '出现未知错误！',
            mask: true
          })
        }
      })
  },
})