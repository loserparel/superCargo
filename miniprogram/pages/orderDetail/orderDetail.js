// pages/orderDetail/orderDetail.js
var n = getApp(),p = require('../../const/path'),u = require('../../utils/util')
,s = require('../../const/storage'),c = require('../../const/constant')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new n.userInfo(),n.loading()
    var order_id = options.order_id
    this.setData({
      order_id:order_id
    })
    this.isUserLogined() ? this.getOrderDetail() : this.gotoLogin(this.onPullDownRefresh);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getOrderDetail(), wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getOrderDetail:function(){
    var order_id = this.data.order_id
    var that = this
    var userMp = wx.getStorageSync(s.STORAGE.USER_MP)
    if(!order_id || order_id == '' || userMp == ''){
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon:'none',
        success: function () {
          setTimeout(function() {
            wx.navigateBack({
              delta:1
            })
          }, 2000);
        }
      })
      return;
    }
    var condition = {
      userMp:userMp,
      _id:order_id
    }
    this.showLoading(!0)
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation:'query',
        tabName: c.CONSTANT.ORDER_TAB,
        condition: condition
      },
      success:function(res){
        if(res.result.length <1){
          wx.showToast({
            title: '网络异常，请稍后再试',
            icon:'none',
            success: function () {
              setTimeout(function() {
                wx.navigateBack({
                  delta:1
                })
              }, 2000);
            }
          })
          return;
        }
        var order = res.result[0]
        for(var i = 0;i< order.orderList.length;i++){
          var product = order.orderList[i]
          let productCount = product.count
          let productPrice = product.stockPrice
          var totalPrice = parseInt(productCount) * parseFloat(productPrice)
          totalPrice = "￥"+totalPrice
          product.totalPrice = totalPrice
          product.prodectDesc = "单价：￥"+ productPrice + "   数量："+productCount
        }
        that.setData({
          order:order
        })
      },
      err:function(err){
        console.log(err)
        wx.showToast({
          title: '网络异常，请稍后再试',
          icon:'none',
          success: function () {
            setTimeout(function() {
              wx.navigateBack({
                delta:1
              })
            }, 2000);
          }
        })
      },
      complete:function(){
        that.showLoading(!1)
      }
    })
  }
})