// pages/stock/addStockInfo/addStockInfo.js
var util = require('../../utils/util.js')
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
    index: 0,
    cargoList: [],
    cargoInfoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCargoInfo();
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
  openCamera: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode'],
      success: function (res) {
        console.log(res)
        that.setData({
          stockNo: res.result
        })
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  getCargoInfo: function () {
    var that = this;
    try {
      db.collection('cargo').where({
        _openid: app.globalData.openid
      }).orderBy('_id', 'desc')
        .get({
          success: function (res) {
            console.log(res.data)
            console.log(that.data.cargoList)
            that.data.cargoInfoList = res.data;
            that.data.cargoList.push('请选择');
            console.log(that.data.cargoList)
            for (var index in res.data) {
              console.log(index)
              that.data.cargoList.push(res.data[index].cargoName)
            }
            console.log(that.data.cargoList)
            that.setData({
              cargoList: that.data.cargoList,
              cargoInfoList: that.data.cargoInfoList
            })
          },
          fail: function (event) {
          }
        })
    } catch (e) {
      console.error("查询商品信息异常" + e);
    }
  },
  inputStockNo: function (event) {
    const that = this;
    that.setData({
      "stockNo": event.detail.value
    })
  },
  bindCargoChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
      stockName: this.data.cargoList[e.detail.value]
    })
    if (e.detail.value != 0) {
      var cargoInfo = this.data.cargoInfoList[e.detail.value - 1];
      console.log(this.data.cargoInfoList)
      var i = e.detail.value;
      that.setData({
        bigClass: cargoInfo.bigClass,
        stockPurPrice: cargoInfo.purPrice,
        stockPrice: cargoInfo.price
      })
    } else {
      that.setData({
        stockName: '',
        bigClass: '',
        stockPurPrice: '',
        stockPrice: ''
      })
    }
  },
  submitAddStock: function () {
    var that = this;
    if (!this.data.stockNo
      || this.data.stockNo == '') {
      wx.showToast({
        title: '请扫描或输入商品号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.index == 0) {
      wx.showToast({
        title: '请选择商品名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    db.collection('stock').add({
      data: {
        stockNo: this.data.stockNo,
        stockName: this.data.stockName,
        bigClass: this.data.bigClass,
        purPrice: this.data.stockPurPrice,
        price: this.data.stockPrice,
        stat: 'N',
        inputDate: util.formatDate(new Date()),
        inputTime: util.formatTime(new Date()),
        done: false
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [新增商品库存信息] 成功，记录 _id: ', res._id)
        wx.showToast({
          title: '新增商品库存信息成功',
        })
        that.setData({
          stockNo: '',
          stockName: 0,
          stockPrice: 0,
          stockPurPrice: 0,
        })
      },
      fail: function (err) {
        console.error('[数据库] [新增商品库存信息] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '新增商品库存信息失败'
        })
      }
    })
  }
})