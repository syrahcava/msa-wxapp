const NewApiRootUrl = 'http://127.0.0.1:8000/we_chat_api/'
// const NewApiRootUrl = 'http://192.168.30.82:8000/we_chat_api/'
// const NewApiRootUrl = 'http://47.100.30.234/we_chat_api/'

module.exports = {
  NewApiRootUrl,
  AuthLoginByWeixin: NewApiRootUrl + 'auth/', // 微信小程序登录
  NewestProductList: NewApiRootUrl + 'home/products/newest',  // 首页新品推荐
  StarProductList: NewApiRootUrl + 'home/products/star',  // 首页明星商品
  CatalogList: NewApiRootUrl + 'categories/',  // 分类目录全部分类数据接口
  CatalogCurrent: function (pk) {
    // 分类目录当前分类数据接口
    return NewApiRootUrl + `categories/${pk}/` + 'categories/'
  },
  // GoodsCategory: function (pk) {
  //   // 获得商品分类数据
  //   return NewApiRootUrl + `categories/${pk}/` + 'products/'
  // },
  GoodsList: function (pk) {
    // 获得分类下商品列表
    return NewApiRootUrl + `categories/${pk}/` + 'products/'
  },
  CartGoodsCount: NewApiRootUrl + 'basket/items/count/', // 获取购物车商品件数
  GoodsDetail: function (pk) {
    // 获得商品的详情
    return NewApiRootUrl + `products/${pk}/`
  },
  CartTotal: NewApiRootUrl + 'basket/',  // 获取购物车汇总数据
  CartLines: function (pk) {
    // 获取购物车明细数据
    return NewApiRootUrl + `baskets/${pk}/` + 'lines/'
  },
  CartAdd: NewApiRootUrl + 'basket/add-product/', // 添加商品到购物车
  AddressDefault: NewApiRootUrl + 'useraddresses/default/',  //获取默认收货地址
  AddressList: NewApiRootUrl + 'useraddresses/',  //收货地址列表
  AddressCreate: NewApiRootUrl + 'useraddresses/create/',  //保存收货地址
  AddressUpdate: function (pk) {
    // 更新收货地址
    return NewApiRootUrl + `useraddresses/${pk}/`
  },
  AddressDetail: function (pk) {
    // 收货地址详情
    return NewApiRootUrl + `useraddresses/${pk}/`
  },

  IndexUrl: NewApiRootUrl + 'index/index', //首页数据接口
  GoodsCount: NewApiRootUrl + 'goods/count',  //统计商品总数
  GoodsNew: NewApiRootUrl + 'goods/new',  //新品
  GoodsHot: NewApiRootUrl + 'goods/hot',  //热门
  GoodsRelated: NewApiRootUrl + 'goods/related',  //商品详情页的关联商品（大家都在看）
  BrandList: NewApiRootUrl + 'brand/list',  //品牌列表
  BrandDetail: NewApiRootUrl + 'brand/detail',  //品牌详情
  CartUpdate: NewApiRootUrl + 'cart/update', // 更新购物车的商品
  CartDelete: NewApiRootUrl + 'cart/delete', // 删除购物车的商品
  CartChecked: NewApiRootUrl + 'cart/checked', // 选择或取消选择商品
  CartCheckout: NewApiRootUrl + 'cart/checkout', // 下单前信息确认
  OrderSubmit: NewApiRootUrl + 'order/submit', // 提交订单
  PayPrepayId: NewApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id
  CollectList: NewApiRootUrl + 'collect/list',  //收藏列表
  CollectAddOrDelete: NewApiRootUrl + 'collect/addordelete',  //添加或取消收藏

  CommentList: NewApiRootUrl + 'comment/list',  //评论列表
  CommentCount: NewApiRootUrl + 'comment/count',  //评论总数
  CommentPost: NewApiRootUrl + 'comment/post',   //发表评论

  TopicList: NewApiRootUrl + 'topic/list',  //专题列表
  TopicDetail: NewApiRootUrl + 'topic/detail',  //专题详情
  TopicRelated: NewApiRootUrl + 'topic/related',  //相关专题

  SearchIndex: NewApiRootUrl + 'search/index',  //搜索页面数据
  SearchResult: NewApiRootUrl + 'search/result',  //搜索数据
  SearchHelper: NewApiRootUrl + 'search/helper',  //搜索帮助
  SearchClearHistory: NewApiRootUrl + 'search/clearhistory',  //搜索帮助

  AddressDelete: NewApiRootUrl + 'address/delete',  //保存收货地址

  RegionList: NewApiRootUrl + 'region/list',  //获取区域列表

  OrderList: NewApiRootUrl + 'order/list',  //订单列表
  OrderDetail: NewApiRootUrl + 'order/detail',  //订单详情
  OrderCancel: NewApiRootUrl + 'order/cancel',  //取消订单

  FootprintList: NewApiRootUrl + 'footprint/list',  //足迹列表
  FootprintDelete: NewApiRootUrl + 'footprint/delete',  //删除足迹
};