var  p = require('../const/path.js'),
c = require('../const/constant.js'),
e = require('../const/storage.js'),
u = require('../utils/util'),
n = null,
s ={
  init: function() {
    n = (0, u.getCurrentPage)();
  },
  initCartInfo:function(){
    var usrMp = wx.getStorageSync(e.STORAGE.USER_MP)
    n.setData({
      cartList:[],
      totalAmount:0.00,
      cartCount:0,
      is_all_check:false
    })
    if (usrMp && usrMp != ''){
      n.showLoading(!0)
      wx.cloud.callFunction({
        name:'dbapi',
        data:{
          operation: 'query',
          tabName: c.CONSTANT.CART_TAB,
          condition: {
            userMp: usrMp
          }
        },
        success:function(res){
          if(res.result.length >0){
            n.setData({
              cartList: res.result
            })
            console.log(res.result)
            for (var i = 0;i<res.result.length;i++){
              console.log(res.result[i].count)
              n.calcTotalAmount(res.result[i].count, res.result[i].price)
            }
            n.checkIsAllCheck()
          }
        },
        complete: function() {
          n.showLoading(!1)
        }
      })
    }
  },
  addCartInfo:function(cartInfo){
    var callback = arguments[1]
    try{
      wx.cloud.callFunction({
        name: 'dbapi',
        data: {
          operation: 'add',
          tabName: c.CONSTANT.CART_TAB,
          data: cartInfo
        },
        success:function(res){
          callback(0)
        },
        fail:function(err){
          callback(1) && s.show('扫描失败，请重试')
        },
        complete:function(){
          n.showLoading(!1)
        }
      })
    }catch(e){
      console.log('新增商品信息到购物车失败',e)
    }
  },
  updCartInfo: function (cartInfo, count, callback){
    console.log('更新购物车商品信息', cartInfo)
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'update',
        tabName: c.CONSTANT.CART_TAB,
        condition: {
          _id: cartInfo._id
        },
        params:{
          is_check: cartInfo.is_check,
          count: cartInfo.count + parseInt(count)
        }
      },
      success: function (res) {
        console.log(res)
        callback(0)
      },
      fail: function (err) {
        callback(1) && s.show('网络异常，请重试')
      }
    })
  },
  delCartInfo: function (cartInfo, callback){
    console.log('删除购物车商品信息', cartInfo)
    n.showLoading(!0)
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'delete',
        tabName: c.CONSTANT.CART_TAB,
        condition: {
          _id: cartInfo._id
        }
      },
      success: function (res) {
        console.log(res)
        callback(0)
      },
      fail: function (err) {
        callback(1) && s.show('网络异常，请重试')
      },
      complete:function(){
        n.showLoading(!1)
      }
    })
  },
  delCartList:function(cartIdList){
    console.log('删除购物车商品信息list', cartIdList)
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'delete',
        tabName: c.CONSTANT.CART_TAB,
        data: cartIdList
      },
      success: function (res) {
        console.log(res)
        n.setData({
          totalAmount:0.00,
          cartCount:0,
          is_all_check:false
        })
      },
      fail: function (err) {
        callback(1) && s.show('网络异常，请重试')
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },
  accountStock:function(orderList){
    if (orderList == null || orderList.length<1)
    return
    try{
      for (var index in orderList) {
        var cartInfo = orderList[index]
        wx.cloud.callFunction({
          name: 'cargoinfo',
          data: {
            data: {
              _id: cartInfo.cargoId,
              count: -parseInt(cartInfo.count)
            }
          }
        })
      }
    }catch(e){
      console.error('购物车结算成功后，更新商品库存信息失败',e)
    }

  }
}
module.exports = {
  sale: s
};