// pages/manageCargoInfo/manageCargoInfo.js
var app = getApp()
var p = require('../../const/path.js')
var c = require('../../const/constant.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabName: c.CONSTANT.CARGO_TAB,
    isChangeOld:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(),app.loading()
    var _id = options._id
    if(!_id || _id == ''){
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
    this.setData({
      _id:_id
    })
    this.initData(_id);
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
  initData:function(_id){
    var that = this;
    var condition = {
      userMp: app.globalData.userMp,
      _id: _id
    };
    that.showLoading(!0)
    wx.cloud.callFunction({
      name: 'dbapi',
      data: {
        operation: 'query',
        tabName: this.data.tabName,
        condition: condition
      },
      success:function(res){
        if (res.result.length<1){
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
        }else{
          var cargoInfo = res.result[0]
          that.setData({
            cargoName: cargoInfo.cargoName,
            bigClassId:cargoInfo.bigClassId,
            brand: cargoInfo.brand,
            purPrice: cargoInfo.purPrice,
            price: cargoInfo.price,
            imagePath: cargoInfo.imagePath,
            cargoDesc:cargoInfo.cargoDesc,
            totalNum:cargoInfo.totalNum,
            creatDate: cargoInfo.creatDate && cargoInfo.creatDate != '' ? cargoInfo.creatDate : util.formatDate(new Date()),
            pastDate: cargoInfo.pastDate && cargoInfo.pastDate != '' ? cargoInfo.pastDate : util.formatDate(new Date())
          })
          that.getBigClassInfo();
        }
      },
      fail:function(err){
        console.error('获取商品信息失败',err)
        wx.showToast({
          title: '获取商品信息失败',
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
      },
      complete:function(){
        that.showLoading(!1)
      }
    })
  }, 
  getBigClassInfo: function () {
    var that = this;
    try {
      var condition = {
        userMp: app.globalData.userMp,
        stat: 'N'
      };
      wx.cloud.callFunction({
        name: 'dbapi',
        data: {
          operation: 'query',
          tabName: c.CONSTANT.BIG_CLASS_TAB,
          condition: condition
        },
        success: function (res) {
          console.log(res)
          for (var index in res.result) {
            if (res.result[index]._id == that.data.bigClassId) {
              that.setData({
                index: index,
                bigClass:res.result[index]
              })
            }
          }
          that.setData({
            bigClassList: res.result,
          })
        },
        fail: function () {
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
  doUpload: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
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
    var current = e.currentTarget.dataset.src;
    var urls = new Array()
    urls.unshift(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  deleteImage: function () {
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
  inputBrand: function (e) {
    this.setData({
      brand: e.detail.value
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
  submitUpdCargoInfo:function(){
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
    var condition = {
      userMp: app.globalData.userMp,
      _id:this.data._id
    };
    var params = {
      cargoName: this.data.cargoName,
      purPrice: this.data.purPrice,
      price: this.data.price,
      bigClassId: this.data.bigClass._id,
      purPrice: this.data.purPrice,
      totalNum:this.data.totalNum,
      imagePath: this.data.imagePath,
      brand: this.data.brand,
      creatDate: this.data.creatDate,
      pastDate:this.data.pastDate,
      cargoDesc:this.data.cargoDesc
    }
    wx.cloud.callFunction({
      name: 'dbapi',
      data:{
        operation:'update',
        tabName: this.data.tabName,
        condition: condition,
        params: params
      },
      success:function(res){
        console.log(res)
        if(that.data.isChangeOld){
          console.log('需要修改之前所有库存商品信息')
          var updParams = {
            imagePath:that.data.imagePath,
            price:that.data.price,
            stockName:that.data.cargoName,
            purPrice:that.data.purPrice,
            updateDate:util.formatDate(new Date()),
            updateTime:util.formatTime(new Date())
          }
          var updCondition = {
            userMp: app.globalData.userMp,
            cargoId:that.data._id
          }
          wx.cloud.callFunction({
            name: 'dbapi',
            data:({
              operation:'update',
              tabName: c.CONSTANT.STOCK_TAB,
              condition: updCondition,
              params: updParams
            }),
            success:function(res){
              wx.showToast({
                title: '编辑商品信息成功',
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
            fail:function(err){
              console.log('编辑原有库存商品信息失败',err)
              wx.showToast({
                title: '编辑商品信息失败，请稍后重试',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }else{
          wx.showToast({
            title: '编辑商品信息成功',
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
        }
      },
      fail:function(err){
        console.log('编辑商品信息失败',err)
        wx.showToast({
          title: '编辑商品信息失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  bindCreatDateChange: function (e) {
    this.setData({
      creatDate: e.detail.value
    })
  },
  bindPastDateChange: function (e) {
    this.setData({
      pastDate: e.detail.value
    })
  },
  inputCargoDesc:function(e){
    this.setData({
      cargoDesc:e.detail.value
    })
  },
  changeModify:function(e){
    this.setData({
      isChangeOld:e.detail.value
    })
  },
  inputTotalNum:function(e){
    this.setData({
      totalNum:e.detail.value
    })
  }
})