var app = getApp(), e = require("../../const/path.js"), m = require("../../model/mine"),
i = require("../../const/storage.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImage:'../../images/logo.png',
    todayOrderImage:'../../images/todayOrder.png',
    historyOrderImage:'../../images/historyOrder.png',
    sericeImage:'../../images/service.png',
    heartImage:'../../images/heart.png',
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(), m.mine.models(this)

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
    this.setData({
      isLogin: this.isUserLogined()
    }),this.isUserLogined() ? m.mine.getUserDetail() : (this.setData({
      userInfo: null,
      userMp:''
    })
    )
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
  callback: function() {},
  gotologin: function(i) {
    this.isUserLogined() || this.gotoLogin(this.callback);
  },
  gotoLoginOrExit: function (t) {
    this.data.isLogin ?
      app.openPage({
        url: e.PATH.PAGE_EXIT
      }):
      app.openPage({
        url: e.PATH.PAGE_LOGIN
      })
  },
  gotoTodayAccount:function(d){
    this.data.isLogin ? wx.navigateTo({
      url: e.PATH.PAGE_TODAY_ACCOUNT
    }) : this.gotoLogin(this.callback);
  },
  gotoHistoryAccount:function(d){
    this.data.isLogin ? wx.navigateTo({
      url: e.PATH.PAGE_HISTORY_ACCOUNT
    }) : this.gotoLogin(this.callback);
  },
  gotoFairy:function(){
    this.data.isLogin ? wx.navigateTo({
      url: e.PATH.PAGE_FAIRY
    }) : this.gotoLogin(this.callback);
  }
})