// pages/stock/manageStockInfo/manageStockInfo.js
var app = getApp();
wx.cloud.init({
  env: app.globalData.env
})
const db = wx.cloud.database({
  env: app.globalData.env
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(this.data.page);
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
  getData: function (page) {
    var that = this;
    db.collection('stock').count({
      success: function (res) {
        that.data.totalCount = res.total;
      }
    })
    try {
      db.collection('stock').where({
        _openid: app.globalData.openid
      }).limit(that.data.pageSize)
        .orderBy('transSeqId', 'desc')
        .get({
          success: function (res) {
            console.log(res.data)
            that.data.stockList = res.data;
            that.setData({
              stockList: that.data.stockList,
            })
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          },
          fail: function (event) {
            wx.hideNavigationBarLoading();//隐藏加载
            wx.stopPullDownRefresh();
          }
        })
    } catch (e) {
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
  }
})