// pages/todayAccount/todayAccount.js
var app = getApp(),o = require('../../model/order'),
c = require('../../const/constant'),p = require('../../const/path')
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
    app.userInfo(), o.order.models(this),app.loading()
    if (this.isUserLogined()){
      o.order.initOrderInfo('today');
    }else{
      this.showLoading(!1)
    }
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
    wx.stopPullDownRefresh()
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
  gotoSale:function(){
    wx.reLaunch({
      url: p.PATH.PAGE_SALE
    })
  },
  gotoProductDetail: function(e) {
    var orderId = e.currentTarget.dataset.order._id
    wx.navigateTo({
        url: p.PATH.PAGE_ORDER_DETAIL + "?order_id=" + orderId
    });
  }
})