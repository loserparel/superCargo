// pages/stock/manageBigClass/manageBigClass.js
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
    bigClassList:[],
    page:1,
    pageSize:5,
    totalCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(this.data.page);
    console.log(this.data.bigClassList);
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getData:function(page){
    var that = this;
    db.collection('bigClass').count({
      success: function (res) {
        that.data.totalCount = res.total;
      }
    })
    try{
      db.collection('bigClass').where({
        _openid: app.globalData.openid
      }).limit(that.data.pageSize)
        .orderBy('priority', 'desc')
      .get({
        success:function(res){
          console.log(res.data)
          that.data.bigClassList = res.data;
          that.setData({
            bigClassList: that.data.bigClassList,
          })
          wx.hideNavigationBarLoading();//隐藏加载
          wx.stopPullDownRefresh();
        },
        fail: function (event) {
          wx.hideNavigationBarLoading();//隐藏加载
          wx.stopPullDownRefresh();
        }
      })
    } catch (e){
      wx.hideNavigationBarLoading();//隐藏加载
      wx.stopPullDownRefresh();
      console.error(e);
    }
  }
})