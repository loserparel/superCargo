// pages/stock/addBigClass/addBigClass.js
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
    inputShowed: false,
    inputVal: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  inputBigClassName: function (event) {
    const that = this;
    that.setData({
      "bigClassName": event.detail.value
    })
  },
  inputPriority: function (event) {
    const that = this;
    that.setData({
      "priority": event.detail.value
    })
  },
  submitAddBigClass: function () {
    if (!this.data.bigClassName
      || this.data.bigClassName == '') {
      wx.showToast({
        title: '请输入商品大类名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.priority
      || this.data.priority == '') {
      wx.showToast({
        title: '请输入显示优先级',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!/[0-9]*/.test(this.data.priority)) {
      wx.showToast({
        title: '优先级必须为数字',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    db.collection('bigClass').add({
      data: {
        bigClassName: this.data.bigClassName,
        priority: this.data.priority,
        done: false
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [新增商品大类] 成功，记录 _id: ', res._id)
        wx.showToast({
          title: '新增商品大类成功',
        })
      },
      fail: function (err) {
        console.error('[数据库] [新增商品大类] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '新增商品大类失败'
        })
      }
    })
  }
})