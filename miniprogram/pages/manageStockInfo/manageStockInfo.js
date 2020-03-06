// pages/manageStockInfo/manageStockInfo.js
var c = require('../../const/constant'),
app = getApp(),util = require('../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      [],
      []
    ],
    multiIndex: [0, 0],
    stockId:'',
    purPrice:'',
    price:'',
    oldCargoId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(),app.loading()
    var _id = options._id;
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
    var that = this;
    var queryBigClassCond = {
      userMp: app.globalData.userMp,
      stat:'N'
    }
    that.showLoading(!0)
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation: 'query',
        tabName: c.CONSTANT.BIG_CLASS_TAB,
        condition: queryBigClassCond
      },
      success:function(res){
        console.log("根据用户手机号查询商品大类信息成功",res)
        if(res.result.length >0){
          var bigClassArr = res.result;
          var queryCondition = {
             userMp: app.globalData.userMp,
             _id:_id
          }
          that.showLoading(!0)
          wx.cloud.callFunction({
            name:'dbapi',
            data:{
              operation: 'query',
              tabName: c.CONSTANT.STOCK_TAB,
              condition: queryCondition
            },
            success:function(ress){
              console.log("根据商品_id查询商品信息",ress)
              that.showLoading(!0)
              if(ress.result.length >0){
                var stockInfo = ress.result[0];
                for(var i = 0; i < bigClassArr.length;i++){
                  bigClassArr[i].id = i;
                  bigClassArr[i].name = bigClassArr[i].bigClassName
                  if(bigClassArr[i]._id == stockInfo.bigClassId){
                    var multiIndex = that.data.multiIndex
                    multiIndex[0] = i;
                    that.setData({
                      multiIndex:multiIndex
                    })
                  }
                }
                var multiArray = that.data.multiArray
                multiArray[0] = bigClassArr
                that.setData({
                  stockNo:stockInfo.stockNo,
                  oldCargoId:stockInfo.cargoId,
                  multiArray:multiArray
                })
              }
              queryBigClassCond.bigClassId = stockInfo.bigClassId;
              wx.cloud.callFunction({
                name:'dbapi',
                data:{
                  operation: 'query',
                  tabName: c.CONSTANT.CARGO_TAB,
                  condition: queryBigClassCond
                },
                success:function(ree){
                  var cargoArr = new Array();
                  if(ree.result.length >0){
                    console.log('根据商品大类获取商品信息成功',ree)
                    for(var j = 0; j < ree.result.length; j++){
                      var cargoInfo = ree.result[j]
                      cargoInfo.id = j;
                      cargoInfo.name = cargoInfo.cargoName;
                      cargoArr.push(cargoInfo)
                      if(cargoInfo._id == stockInfo.cargoId){
                        var multiIndex = that.data.multiIndex
                        multiIndex[1] = j;
                        that.setData({
                          cargoInfo:cargoInfo,
                          stockId:stockInfo._id,
                          stockNo:stockInfo.stockNo,
                          purPrice:cargoInfo.purPrice,
                          price:cargoInfo.price,
                          multiIndex:multiIndex
                        })
                      }
                    }
                    var multiArray = that.data.multiArray
                    multiArray[1] = cargoArr;
                    that.setData({
                      multiArray:multiArray
                    })
                  }
                },
                fail:function(err){
                    console.error('编辑入库商品信息查询商品所属失败',err)
                    wx.showToast({
                      title: '网络异常，请返回刷新重试',
                      icon:'none'
                    })
                },
                complete:function(res){
                  that.showLoading(!1)
                }
              })
            },
            complete:function(res){
              that.showLoading(!1)
            }
          })
        }
      },
      complete:function(res){
        that.showLoading(!1)
      }
    })
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
  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e){
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    var that = this;
    console.log(e.detail)
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:      
        let bigClassInfo = data.multiArray[0][e.detail.value]
        that.changeBigClass(bigClassInfo);
        break;
      case 1:
        let cargoInfo = data.multiArray[1][e.detail.value]
        that.changeCargoInfo(cargoInfo)
        break;
      break;
    }
  },
  changeBigClass:function(bigClassInfo){
    let that = this;
    var queryCondition = {
      userMp: app.globalData.userMp,
      bigClassId :bigClassInfo._id
    }
    that.showLoading(!0)
    let multiArray = this.data.multiArray;
    let multiIndex = this.data.multiIndex;
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation: 'query',
        tabName: c.CONSTANT.CARGO_TAB,
        condition: queryCondition
      },
      success:function(res){
        if(res.result.length >0){
          var cargoArr = new Array();
          for(var k = 0; k < res.result.length; k++){
            var cargoInfo = res.result[k]
            cargoInfo.id = k;
            cargoInfo.name = cargoInfo.cargoName;
            cargoArr.push(cargoInfo);
          }
          multiIndex[1] =0;
          multiArray[1] = cargoArr
          that.setData({
            multiIndex:multiIndex,
            cargoInfo:cargoArr[0],
            purPrice:cargoArr[0].purPrice,
            price:cargoArr[0].price,
            multiArray:multiArray
          })
        }else{
          multiIndex[1] =0;
          multiArray[1] = [];
          that.setData({
            multiIndex:multiIndex,
            multiArray:multiArray
          })
        }
      },
      complete:function(){
        that.showLoading(!1)
      }
    })
  },
  changeCargoInfo:function(cargoInfo){
    this.setData({
      cargoInfo:cargoInfo,
      purPrice:cargoInfo.purPrice,
      price:cargoInfo.price
    })
  },
  submitUpdStock:function(){
    if(this.data.cargoInfo == null){
      wx.showToast({
        title: '网络异常，请重新选择商品名称',
        icon:'none'
      })
      return false;
    }
    var that = this,cargoInfo = this.data.cargoInfo;
    that.showLoading(!0)
    var condition = {
      userMp: app.globalData.userMp,
      _id :this.data.stockId
    }
    var params = {
      stockName:cargoInfo.cargoName,
      cargoId:cargoInfo._id,
      bigClassId:cargoInfo.bigClassId,
      purPrice:cargoInfo.purPrice,
      price:cargoInfo.price,
      imagePath:cargoInfo.imagePath,
      updDate:util.formatDate(new Date()),
      updTime:util.formatTime(new Date())
    }
    console.log(params)
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation: 'update',
        tabName: c.CONSTANT.STOCK_TAB,
        condition: condition,
        params:params
      },
      success:function(res){
        that.manageCargoCount(cargoInfo._id,1)
        that.manageCargoCount(that.data.oldCargoId,-1)
        wx.showToast({
          title: '编辑商品入库信息成功',
          icon:'none' ,
          success: function () {
            setTimeout(function() {
              wx.navigateBack({
                delta:2
              })
            }, 2000);
          }
        })
      },
      fail:function(err){
        wx.showToast({
          title: '编辑商品入库信息失败',
          icon:'none'
        })
      },
      complete:function(){
        that.showLoading(!1)
      }
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