// pages/stock/addStockInfo/addStockInfo.js
var util = require('../../utils/util.js'), p = require('../../const/path.js'),c = require('../../const/constant')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    cargoList: [],
    cargoInfoList: [],
    cargoId:'',
    bigClassId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(),app.loading()
    var _id = options._id
    if(!_id || _id ==''){
      wx.showToast({
        title: '网络异常，请刷新重试',
        icon: 'none',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              url: p.PATH.PAGE_CARGO_MENU
            });
          }, 1000)
        }
      })
      return;
    }
    this.getCargoInfo(_id)
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
  openCamera: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode'],
      success: function (res) {
        that.setData({
          stockNo: res.result
        })
        that.checkStockNo();
      },
      fail: function (res) {
        if (res.errMsg == null || res.errMsg.indexOf('cancel')<1){
          wx.showToast({
            title: '未获取到商品条码信息，请手动输入。',
            icon: 'none',
            duration: 2000
          })
        }
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  getCargoInfo: function (_id) {
    var that = this;
    that.showLoading(!0)
    try {
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
          if(res.result.length<1){
            wx.showToast({
              title: '获取商品信息失败，请刷新后重试',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    url: p.PATH.PAGE_CARGO_MENU
                  });
                }, 1000)
              }
            })
            return;
          }
          var cargoInfo = res.result[0];
          that.setData({
            bigClassId:cargoInfo.bigClassId,
            cargoId: cargoInfo._id,
            cargoName: cargoInfo.cargoName,
            purPrice: cargoInfo.purPrice,
            price: cargoInfo.price,
            imagePath: cargoInfo.imagePath
          })
        },
        fail:function(err){
          console.log('新增库存获取商品信息失败'+err)
        },
        complete:function(){
          that.showLoading(!1)
        }
      })
    } catch (e) {
      console.error("查询商品信息异常" + e);
      wx.showToast({
        title: '获取商品信息失败，请刷新后重试',
        icon: 'none',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            wx.navigateBack({
              url: p.PATH.PAGE_CARGO_MENU
            });
          }, 1000)
        }
      })
    }
  },
  inputStockNo: function (event) {
    var that = this;
    that.setData({
      "stockNo": event.detail.value
    })
  },
  checkStockNo:function(type){
    var that = this;
    if(!this.data.stockNo || this.data.stockNo == ''){
        return false;
    }
    var queryCondition = {
      userMp: app.globalData.userMp,
      stockNo: this.data.stockNo
    }
    that.showLoading(!0)
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation: 'query',
        tabName: c.CONSTANT.STOCK_TAB,
        condition: queryCondition
      },
      success:function(res){
        console.log("根据商品条码查询商品在库存中是否存在",res)
        if(res.result.length >0){
          wx.showModal({
            title: '提示',
            content: '该商品在库存中已存在，是否修改该商品的所在商品信息？',
            cancelText:'否',
            confirmText:'是',
            success: function (sm) {
              if(sm.confirm){
                wx.showModal({
                  title: '提示',
                  content: '该商品要修改为当前商品信息还是其他商品信息？',
                  cancelText:'当前',
                  confirmText:'其他',
                  success: function (ss) {
                    if (ss.confirm) {
                      wx.navigateTo({
                        url: p.PATH.PAGE_MANAGE_STOCKINFO + '?_id=' + res.result[0]._id,
                      })
                      } else if (ss.cancel) {
                        if(res.result[0].cargoId == that.data.cargoId){
                          wx.showToast({
                            title: '所添加商品已在当前商品所属下',
                            icon:'none'
                          })
                        }else{
                          that.showLoading(!0)
                          let param = {
                            bigClassId:that.data.bigClassId,
                            cargoId: that.data.cargoId,
                            stockName: that.data.cargoName,
                            purPrice: that.data.purPrice,
                            price: that.data.price,
                            imagePath: that.data.imagePath,
                            stat: 'N',
                            updDate: util.formatDate(new Date()),
                            updTime: util.formatTime(new Date())
                          };
                          let condition = {
                            _id : res.result[0]._id
                          }
                          wx.cloud.callFunction({
                            name:'dbapi',
                            data:{
                              operation: 'update',
                              tabName: c.CONSTANT.STOCK_TAB,
                              condition: condition,
                              params:param
                            },
                            success:function(suc){
                              that.manageCargoCount(that.data.cargoId,1)
                              that.manageCargoCount(res.result[0].cargoId,-1)
                              wx.showToast({
                                title: '修改商品所属信息成功',
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
                            fail:function(err){
                              console.error('修改商品所属信息失败',err)
                              wx.showToast({
                                title: '修改商品所属信息失败，请刷新后重试',
                                icon:'none'
                              })
                            },
                            complete:function(c){
                              that.showLoading(!1)
                            }
                          })
                        }
                      }
                    }
                })
              }else{
                wx.showToast({
                  title: '同一商品不能重复入库',
                  icon:'none'
                })
              }
            }
          })
        }else{
          console.log('新增商品信息校验商品信息不存在');
          if(type && type != '' && type == 'add'){
            that.doAddStockInfo();
          }
        }
      }
      ,complete:function(){
        that.showLoading(!1)
      }
    })
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
    that.checkStockNo('add');
  },
  doAddStockInfo:function(){
    var that = this;
    var data = {
      userMp: app.globalData.userMp,
      cargoId: that.data.cargoId,
      bigClassId:that.data.bigClassId,
      stockNo: that.data.stockNo,
      stockName: that.data.cargoName,
      purPrice: that.data.purPrice,
      price: that.data.price,
      imagePath: that.data.imagePath,
      stat: 'N',
      transDate: util.formatDate(new Date()),
      transTime: util.formatTime(new Date())
    };
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'add',
        tabName: c.CONSTANT.STOCK_TAB,
        data: data
      },
      success: function (res) {
        console.log(res)
        console.log('[数据库] [修改商品库存信息] 成功，记录 _id: ', res)
        wx.showToast({
          title: '新增商品库存信息成功',
        })
        that.setData({
          stockNo: ''
        })
        that.manageCargoCount(that.data.cargoId,1)
      },
      fail: function (err) {
        console.error('[数据库] [修改商品库存信息] 失败：', err)
        wx.showToast({
          icon: 'none',
          title: '网络异常，请重试。'
        })
      },
      complete:function(){
        that.showLoading(!1)
        that.openCamera()
      }
    })
  },
  randomCargono:function(){
    var random = util.random(13,false)
    this.setData({
      stockNo:random
    })
  },
  manageCargoCount:function(cargoId,count){
    wx.cloud.callFunction({
      name: 'cargoinfo',
      data: {
        data: {
          _id: cargoId,
          count: count,
          type:'M'
        }
      },
      success: function (res) {
        console.log('更新商品库存数量成功', res)
      },
      fail: function (err) {
        console.log('更新商品库存数量失败', err)
      }
    })
  }
})