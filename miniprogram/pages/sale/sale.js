// pages/sale/sale.js
var app = getApp(), util = require('../../utils/util.js'),
s = require('../../model/sale.js'),
c = require('../../const/constant.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList:[],
    totalAmount:0.00,
    cartCount:0,
    is_all_check:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo(),app.loading()
    this.setData({
      isLogin: this.isUserLogined()
    }), this.isUserLogined()? s.sale.init() & s.sale.initCartInfo() : ''
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
    this.setData({
      isLogin: this.isUserLogined()
    }), this.isUserLogined() ? s.sale.init(): ''
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
     this.data.isLogin ? s.sale.initCartInfo() 
      : this.setData({
        cartList: [],
        totalAmount: 0.00,
        cartCount: 0,
        is_all_check: false,
      })
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
  openCamera:function(){
    var that = this;
    !this.data.isLogin ? wx.showToast({
      title: '您还没登录，请先登录',
      icon:'none',
      duration: 1000,
      success:function(){
        setTimeout(function(){
          that.gotoLogin()  
        },1000)
      }
      
    }) : 
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode'],
      success: function (res) {
        that.getCartInfo(res.result);
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg == null
          || res.errMsg.indexOf('cancel') <1){
            wx.showToast({
              title: '扫描商品失败，请重试',
              icon: 'none',
              duration: 2000
            })
        }
      },
      complete: function (res) {
        that.showLoading(!1)
      }
    })
  },
  getCartInfo:function(stockNo){
    var that = this;
    var cartList = that.data.cartList
    for (var index in cartList){
      if (stockNo == cartList[index].stockNo){
        wx.showToast({
          title: '该商品在结算列表中已存在',
          icon:'none'
        })
        return;
      }
    }
    that.showLoading(!0)
    try {
      var condition = {
        userMp: app.globalData.userMp,
        stockNo: stockNo
      }
      wx.cloud.callFunction({
        name:'dbapi',
        data: {
          operation: 'query',
          tabName: c.CONSTANT.STOCK_TAB,
          condition: condition
        },
        success: function (res) {
          if (res.result.length < 1) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '该商品信息还未录入，请先录入该商品信息'
            })
            return;
          }
          var stockList = res.result;
          console.log(stockList)
          var cartInfo = stockList[0];
          cartInfo.is_check = true;
          cartInfo.count = 1; 
          s.sale.addCartInfo(cartInfo,function(code){
            if(code == 0){
              cartList.push(cartInfo);
              that.calcTotalAmount(1, cartInfo.price)
              that.setData({
                cartList: cartList
              })
              that.checkIsAllCheck();
            }
          })
        },
        fail: function (event) {
          console.log(event)
          wx.showToast({
            title: '扫描商品获取商品信息失败',
            icon: 'none',
            duration: 2000
          })
        },complete:function(){
          that.showLoading(!1)
        }
      })
    } catch (e) {
      wx.showToast({
        title: '扫描商品获取商品信息异常',
        icon: 'none',
        duration: 2000
      })
    }
  },
  eventCheckStock:function(e){
    var cartInfo = e.currentTarget.dataset.cartinfo
    var cartList = this.data.cartList
    var that = this
    for (var index in cartList){
      if (cartInfo._id == cartList[index]._id){
        var cartInfo = cartList[index]
        if (cartList[index].is_check){
          cartInfo.is_check = false
          cartList[index].is_check = false
          that.setData({
            cartList: cartList
          })
          that.checkIsAllCheck();
          this.calcTotalAmount(-parseInt(cartInfo.count), cartList[index].price)
          s.sale.updCartInfo(cartInfo,0, function(respCode){
          })
        }else{
          cartInfo.is_check = true
          cartList[index].is_check = true
          that.setData({
            cartList: cartList
          })
          that.checkIsAllCheck();
          this.calcTotalAmount(parseInt(cartInfo.count), cartList[index].price)
          s.sale.updCartInfo(cartInfo,0,function(respCode){
          })
        }
      }
    }
  },
  eventCheckAllProduct:function(){
    var cartList = this.data.cartList
    if (!this.data.is_all_check){
      for (var index in cartList) {
        if (!cartList[index].is_check){
          cartList[index].is_check=true
          this.calcTotalAmount(cartList[index].count, cartList[index].price)
        }
      }
      this.setData({
        cartList: cartList,
        is_all_check:true
      })
    }else{
      for (var index in cartList) {
        cartList[index].is_check = false
      }
      this.setData({
        cartList: cartList,
        is_all_check: false,
        totalAmount:'0.00',
        cartCount:0
      })
    }
  },
  checkIsAllCheck:function(){
    var cartList = this.data.cartList
    var allcheck = true
    if(null == cartList || cartList.length <1){
      this.setData({
        is_all_check: false
      })
      return;
    }
    for (var index in cartList) {
      if (!cartList[index].is_check) {
        allcheck = false;
        break;
      }
    }
    if (allcheck) {
      this.setData({
        is_all_check: true
      })
    } else {
      this.setData({
        is_all_check: false
      })
    }
  },
  eventAddCart:function(e){
    var count = e.currentTarget.dataset.count
    var that = this
    var cartInfo = e.currentTarget.dataset.cartinfo
    var cartList = this.data.cartList
    for (var index in cartList){
      var updCartInfo = cartList[index] 
      if (updCartInfo._id == cartInfo._id){
        if (updCartInfo.count === 1
          && count == -1 ){
          wx.showModal({
            title: '确定删除该商品吗？',
            showCancel: !0,
            confirmText: "确定",
            success: function (res) {
              if(res.cancel){
                return;
              }else if(res.confirm){
                s.sale.delCartInfo(updCartInfo,function(code){
                  if(code == 0){
                    if (cartList[index].is_check) {
                      that.calcTotalAmount(count, cartList[index].price)
                    }
                    cartList.splice(index, 1)
                    that.setData({
                      cartList: cartList
                    })
                    that.checkIsAllCheck()
                  }
                })
              }
            }
          })
          return;
        }
        cartList[index].count = cartList[index].count + parseInt(count)
        if (cartList[index].is_check) {
          that.calcTotalAmount(count, cartList[index].price)
        }
        that.setData({
          cartList: cartList
        })
        s.sale.updCartInfo(cartInfo, count, function (code) {
        })
      }
    }
  },
  calcTotalAmount : function(count,price){
    var totalAmount = this.data.totalAmount
    var cartCount = this.data.cartCount
    console.log(totalAmount)
    console.log(cartCount)
    totalAmount = parseFloat(totalAmount) + parseInt(count) * parseFloat(price)
    cartCount = parseInt(count) + parseInt(cartCount)
    this.setData({
      totalAmount: totalAmount.toFixed(2),
      cartCount: cartCount
    })
  },
  eventSubmitCart:function(){
    var that = this
    var cartList = that.data.cartList
    if(cartList.length <1 ){
      wx.showToast({
        title: '您还未添加任何商品',
        icon:'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      cancelText: '取消',
      confirmText: '确定',
      content: '确定结算当前商品吗？',
      success: function (res) {
        if (res.cancel) {
          
        } else if (res.confirm) {
          wx.showLoading({
            title: '结算中',
          })
          try{
            var orderList = new Array()
            let len = cartList.length -1;
            for (let i = len; i >= 0 ;i--){
              let cartInfo = cartList[i]
              console.log(cartInfo)
              if (cartInfo.is_check){
                var orderInfo = {}
                orderInfo.cargoId = cartInfo.cargoId
                orderInfo.stockId = cartInfo._id
                orderInfo.count = cartInfo.count
                orderInfo.stockPrice = cartInfo.price
                orderInfo.imagePath = cartInfo.imagePath
                orderInfo.stockNo = cartInfo.stockNo
                orderInfo.stockName = cartInfo.stockName
                orderList.push(orderInfo)
              }
            }
            var data = { 
              orderDate: util.formatDate(new Date()),
              orderTime: util.formatTime(new Date()),
              orderList: orderList,
              userMp:app.globalData.userMp,
              cartCount:that.data.cartCount,
              totalAmount:that.data.totalAmount
            }
            wx.cloud.callFunction({
              name:'dbapi',
              data:{
                operation:'add',
                tabName: c.CONSTANT.ORDER_TAB,
                data: data
              },
              success:function(res){
                console.log(cartList)
                var cartIdList = new Array()
                let len = cartList.length -1
                for (let i = len ; i >= 0 ;i--) {
                  if (cartList[i].is_check) {
                    cartIdList.push(cartList[i]._id)
                    cartList.splice(i, 1)
                  }
                }
                s.sale.accountStock(orderList)
                s.sale.delCartList(cartIdList)
                that.setData({
                  cartList:cartList
                })
              },
              fail:function(err){
                console.log(err)
              },
              complate:function(){
                wx.hideLoading()
              }
            })
          }catch(e){
            console.log(e)
            wx.hideLoading()
          }
        }
      }
    })
    return;
  },
  show: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none'
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