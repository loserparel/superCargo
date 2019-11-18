// pages/stock/addCargoInfo/addCargoInfo.js
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
    bigClassList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBigClassInfo();
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
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'stockinfo',
          // 传递给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            console.log(res)
            var result = JSON.parse(res.result);
            console.log(res.result)
            console.log(result)
            if (result.code == 1) {
              that.setData({
                cargoName: result.data.goodsName,
                brand: result.data.brand
              })
            } else {
              wx.showToast({
                title: '扫描商品信息失败，请手工录入。',
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: err => {
            console.error(res)
            wx.showToast({
              title: '扫描商品信息失败，请手工录入。',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
        console.log(res)
        console.log(res.errMsg)
        if (res.errMsg
          && res.errMsg != ''
          && res.errMsg.indexOf("cancel") > 0) {
          return;
        }
        wx.showToast({
          title: '扫描商品信息失败，请手工录入。',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  getBigClassInfo: function () {
    var that = this;
    try {
      db.collection('bigClass').where({
        _openid: app.globalData.openid
      }).orderBy('priority', 'desc')
        .get({
          success: function (res) {
            console.log(res.data)
            console.log(that.data.bigClassList)
            that.data.bigClassList.push('请选择');
            console.log(that.data.bigClassList)
            for (var index in res.data) {
              console.log(index)
              that.data.bigClassList.push(res.data[index].bigClassName)
            }
            console.log(that.data.bigClassList)
            that.setData({
              bigClassList: that.data.bigClassList,
            })
          },
          fail: function (event) {
          }
        })
    } catch (e) {
      console.error("查询商品大类信息异常" + e);
    }
  },
  bindBigClassChange: function (e) {
    this.setData({
      index: e.detail.value,
      bigClass: this.data.bigClassList[e.detail.value]
    })
  },
  inputCargoName: function (event) {
    const that = this;
    that.setData({
      "cargoName": event.detail.value
    })
  },
  inputPurPrice: function (event) {
    const that = this;
    that.setData({
      "purPrice": event.detail.value
    })
  },
  inputPrice: function (event) {
    const that = this;
    that.setData({
      "price": event.detail.value
    })
  },
  submitAddCargoInfo: function () {
    if (!this.data.cargoName
      || this.data.cargoName == '') {
      wx.showToast({
        title: '请输入商品名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.index
      || this.data.index == 0) {
      wx.showToast({
        title: '请选择商品大类',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (!this.data.purPrice
      || this.data.purPrice == '') {
      wx.showToast({
        title: '请输入商品进价',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!this.data.purPrice
      || this.data.purPrice == '') {
      wx.showToast({
        title: '请输入商品售价',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    db.collection('cargo').add({
      data: {
        cargoName: this.data.cargoName,
        bigClass: this.data.bigClass,
        purPrice: this.data.purPrice,
        price: this.data.price,
        brand: this.data.brand,
        stat: 'N',
        done: false
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [新增商品信息] 成功，记录 _id: ', res._id)
        wx.showToast({
          title: '新增商品信息成功',
        })
      },
      fail: function (err) {
        console.error('[数据库] [新增商品信息] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '新增商品信息失败'
        })
      }
    })
  }
})