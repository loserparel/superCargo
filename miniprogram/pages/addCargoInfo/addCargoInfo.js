// pages/stock/addCargoInfo/addCargoInfo.js
var app = getApp();
var p = require('../../const/path.js')
var constant = require('../../const/constant.js')
var util = require('../../utils/util.js')
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
    app.loading()
    var todayDate = util.formatDate(new Date())
    this.setData({
      todayDate: todayDate,
      creatDate: todayDate,
      pastDate: todayDate
    })
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
        that.setData({
          cargoNo: res.result
        })
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
            console.error(err)
            wx.showToast({
              title: '扫描商品信息失败，请手工录入。',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
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
      var condition = { userMp: app.globalData.userMp,
                    stat:'N'
                  };
      var orderCondition = [{ field: 'priority', condition: 'asc' }]
      wx.cloud.callFunction({
        name: 'dbapi',
        data: {
          operation: 'query',
          tabName: constant.CONSTANT.BIG_CLASS_TAB,
          condition: condition,
          orderCondition: orderCondition
        },
        success:function(res){
          if(res.result.length < 1){
            wx.showModal({
              title: '提示',
              cancelText:'等会再说',
              confirmText:'马上添加',
              content: '您还没添加任何商品大类，请\r\n先添加商品大类。',
              success:function(res){
                if(res.cancel){
                  
                }else if(res.confirm){
                  wx.setStorage({
                    key: 'activeIndex',
                    data: '0',
                  })
                  wx.switchTab({
                    url: p.PATH.PAGE_CLASSFIC
                  })
                }
              }
            })
            return;
          }
          that.setData({
            bigClassList: res.result,
            bigClassInfo: res.result[that.data.index]
          })
        },
        fail:function(){
          wx.showToast({
            title: '查询商品大类信息失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } catch (e) {
      console.error("查询商品大类信息异常" + e);
    }
  },
  bindBigClassChange: function (e) {
    console.log(this.data.bigClassList[e.detail.value])
    this.setData({
      index: e.detail.value,
      bigClassInfo: this.data.bigClassList[e.detail.value]
    })
  },
  inputCargoName: function (event) {
    const that = this;
    that.setData({
      "cargoName": event.detail.value
    })
  },
  inputBrand:function(e){
    this.setData({
      brand:e.detail.value
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
    var that = this
    if (!this.data.cargoName
      || this.data.cargoName == '') {
      wx.showToast({
        title: '请输入商品名称',
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
    if (!this.data.price
      || this.data.price == '') {
      wx.showToast({
        title: '请输入商品售价',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.showLoading(!0)
    var condition = {
        userMp: app.globalData.userMp,
        stat: 'N',
        cargoName: this.data.cargoName
      };
    console.log(condition)
    var data = {
      userMp: app.globalData.userMp,
      cargoName: this.data.cargoName,
      bigClassId: this.data.bigClassInfo._id,
      purPrice: this.data.purPrice,
      price: this.data.price,
      brand: this.data.brand,
      imagePath: this.data.imagePath,
      stat: 'N',
      cargoDesc:this.data.cargoDesc,
      creatDate: that.data.creatDate,
      pastDate: that.data.pastDate,
      totalNum:that.data.totalNum,
      saleNum:0
    }
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'query',
        tabName: constant.CONSTANT.CARGO_TAB,
        condition: condition
      },
      success:function(res){
        console.log(res)
        if(res.result.length >0){
          wx.showModal({
            title: '提示',
            content: '该商品信息已存在，请勿重复添加',
            showCancel: false,
            confirmText: "确定"
          });
        }else{
          wx.cloud.callFunction({
            name: 'dbapi',
            data: {
              operation: 'add',
              tabName: constant.CONSTANT.CARGO_TAB,
              data: data
            },
            success:function(ree){
              console.log('[数据库] [新增商品信息] 成功，记录 _id: ', ree.result)
              wx.showModal({
                title: '提示',
                content: '新增商品成功，是否添加商品库存？',
                cancelText:'否',
                confirmText: "是",
                success(re){
                  if (re.cancel) {
                    that.setData({
                      userMp: '',
                      cargoName: '',
                      bigClassId: that.data.bigClassInfo._id,
                      purPrice: '',
                      price: '',
                      brand:'',
                      cargoDesc:'',
                      imagePath: '',
                      creatDate: that.data.todayDate,
                      pastDate: that.data.todayDate,
                      totalNum:''
                    })
                  } else if (re.confirm) {
                    console.log(ree)
                    console.log(ree._id)
                    wx.navigateTo({
                      url: p.PATH.PAGE_STOCK + "?_id=" + ree.result
                    })
                  }
                }
              });
            },
            fail:function(err){
              console.error('[数据库] [新增商品信息] 失败：', err)
              wx.showToast({
                icon: 'none',
                title: '新增商品信息失败'
              })
            },
            complete:function(){
              that.showLoading(!1)
            }
          })
        }
      }
    })
  },
  doUpload: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'public/my-image' + util.random(6,true) + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            console.log('[上传文件] 成功：', filePath)
            that.setData({
              fileID: res.fileID,
              imagePath: res.fileID
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },
  previewImg: function (e) {
    var current = e.target.dataset.src;
    var urls = new Array()
    urls.unshift(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  deleteImage:function(){
    var that = this
    wx.cloud.deleteFile({
      fileList: [that.data.imagePath],
      success: res => {
        that.setData({
          imagePath: ''
        })
      },
      fail: console.error
    })
  },
  bindCreatDateChange:function(e){
    this.setData({
      creatDate: e.detail.value
    })
  },
  bindPastDateChange:function(e){
    this.setData({
      pastDate: e.detail.value
    })
  },
  inputCargoDesc:function(e){
    this.setData({
      cargoDesc:e.detail.value
    })
  },
  inputTotalNum:function(e){
    this.setData({
      totalNum:e.detail.value
    })
  }
})