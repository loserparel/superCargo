// pages/cargoMenu/cargoMenu.js
var path = require('../../const/path.js')
var c = require('../../const/constant.js')
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    manageUrl: path.PATH.PAGE_MANAGE_CARGOINFO,
    addStockInfoUrl: path.PATH.PAGE_STOCK,
    manageCargoImage:'../../images/manage_cargo.png',
    addStockImage:'../../images/icon_nav_stockinfo.png',
    isOpenPastRemindImg:'../../images/remind.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(),app.loading()
    var _id = options._id;
    if (_id && _id != ''){
      this.setData({_id:_id});
    }else{
      wx.showToast({
        title: '网络异常，请刷新重试',
        icon:'none',
        success: function () {
          setTimeout(function() {
            wx.navigateBack({
              delta:1
            })
          }, 2000);
        }
      })
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
    this.initCargoInfo(this.data._id)
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
    this.initCargoInfo(this.data._id)
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
  initCargoInfo:function(_id){
    var that = this;
    that.showLoading(!0)
    var condition = {
      userMp: app.globalData.userMp,
      stat: 'N',
      _id:_id
    };
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'query',
        tabName: c.CONSTANT.CARGO_TAB,
        condition: condition
      },
      success:function(res){
        var cargoInfo = res.result[0]
        console.log(cargoInfo)
        that.setData({
          _id: cargoInfo._id,
          cargoName: cargoInfo.cargoName,
          imagePath: !cargoInfo.imagePath || cargoInfo.imagePath == '' ? c.CONSTANT.UNKNOW_IMAGE : cargoInfo.imagePath,
          totalNum:cargoInfo.totalNum,
          saleNum:cargoInfo.saleNum,
          residueNum: parseInt(cargoInfo.totalNum) - parseInt(cargoInfo.saleNum),
          expirationDays: cargoInfo.creatDate != '' && cargoInfo.pastDate != '' ? util.getDaysBetween(cargoInfo.creatDate, cargoInfo.pastDate ) :'0'
        })
      },
      fail:function(err){
        console.error('获取商品信息失败', err)
        wx.showToast({
          title: '获取商品信息失败',
          icon: 'none',
          duration: 2000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                url: p.PATH.PAGE_CLASSFIC
              });
            }, 1000)
          }
        })
      },
      complete:function(){
        that.showLoading(!1)
      }
    })
  },
  previewImg: function (e) {
    var current = e.currentTarget.dataset.src;
    var urls = new Array()
    urls.unshift(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
})