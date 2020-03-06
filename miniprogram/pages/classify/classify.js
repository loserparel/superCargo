// pages/stock/stock.js
var e = require("../../const/path.js"), constant = require("../../const/constant.js"), sliderWidth = 96,
 app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      text: "商品大类",
      type: constant.CONSTANT.BIG_CLASS_TAB,
      componentId:constant.CONSTANT.BIGCLASS_COMPONENTID
    }, {
      text: "商品信息",
      type: constant.CONSTANT.CARGO_TAB,
      componentId: constant.CONSTANT.CARGO_COMPONENTID,
      addUrl: e.PATH.PAGE_ADD_CARGOINFO
    }],
    isRefreshing:false,
    isLoadingMoreData:false,
    hasMoreData:true,
    isToTop:false,
    page:1,
    pageSize: constant.CONSTANT.PAGE_SIZE,
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    menuModalHide: true,
    windowWidth: 375,
    menuArr: [{ text: '扫一扫', id: 'scan' }, { text: '新增', id: 'add' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    new app.userInfo(), app.backTop(), app.loading()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    var limit = that.data.page * that.data.pageSize;
    that.setData({
      limit: limit
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
    var that = this;
    wx.getStorage({
      key: 'activeIndex',
      success: function (res) {
        console.log(res)
        if (res && res.data != '') {
          that.setData({
            activeIndex: res.data
          })
          wx.removeStorage({
            key: 'activeIndex',
            success: function(res) {},
          })
        }
      }
    })
    that.setData({
      page:1,
      isRefreshing:true,
      isLoadingMoreData: true,
      hasMoreData:true
    })
    that.refreshListInfo()
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
    var that = this;
    that.setData({
      page:1,
      isRefreshing:true,
      isLoadingMoreData: true,
      hasMoreData:true
    })
    that.refreshListInfo();
    wx.stopPullDownRefresh();
  },
  onPageScroll: function(t) {
    var e = app.globalData.windowH, a = t.scrollTop > e;
    a === this._backTopStatus() && this._backTopShow(a);
  },
  _backTop: function(t) {
      wx.pageScrollTo && wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
      }), t();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData || !this.data.hasMoreData) {
      return;
    }
    var that = this;
    that.setData({
      page:this.data.page +1,
      isLoadingMoreData: true
    })
    that.refreshListInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabClick: function (e) {
    this.setData({
      page:1,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      menuModalHide: true,
      hasMoreData:true,
      type: this.data.tabs[e.currentTarget.id].type
    })
    this.refreshListInfo();
  },
  clickAddBtn: function (e) {
    var that = this;
    !this.isUserLogined() ? wx.showToast({
      title: '您还没登录，请先登录',
      icon: 'none',
      duration: 1000,
      success: function () {
        setTimeout(function () {
          that.gotoLogin()
        }, 1000)
      }
    }) : this.showOrHideMenuModal()

  },
  showOrHideMenuModal:function(){
    var that = this
    if (this.data.tabs[this.data.activeIndex].type == constant.CONSTANT.BIG_CLASS_TAB){
      var componentId = this.data.tabs[this.data.activeIndex].componentId;
      this.selectComponent('#' + componentId).addBigClass();
    }else{
      if (that.data.menuModalHide) {
        that.setData({
          menuModalHide: false
        })
      } else {
        that.setData({
          menuModalHide: true
        })
      }
    }
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      menuModalHide: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      menuModalHide: true
    });
    this.refreshListInfo();
  },
  clearInput: function () {
    var that = this;
    that.setData({
      inputVal: "",
      menuModalHide: true
    });
    that.refreshListInfo();
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      menuModalHide: true
    });
    this.refreshListInfo();
  },
  operationMenu: function (e) {
    var operation = e.target.id;
    var that = this;
    this.hiddenMenu();
    if (operation == 'add') {
        wx.navigateTo({
          url: this.data.tabs[this.data.activeIndex].addUrl
        })
    } else {
      that.showLoading(!0)
      wx.scanCode({
        onlyFromCamera: false,
        scanType: ['barCode'],
        success: function (res) {
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
              if (result.code == 1 
                && result.data.goodsName != '') {
                  console.log(result.data.goodsName)
                  that.setData({
                    inputShowed:true,
                    inputVal:result.data.goodsName
                  })
                  that.refreshListInfo()
              } else {
                wx.showToast({
                  title: 'sorry，未查询到商品信息。',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail:res=>{
              wx.showToast({
                title: 'sorry，未查询到商品信息。',
                icon: 'none',
                duration: 2000
              })
            },
            complete:function(){
              that.showLoading(!1)
            }
          })
        },
        fail:res=>{
          wx.showToast({
            title: 'sorry，未获取到条码信息。',
            icon: 'none',
            duration: 2000
          })
          that.showLoading(!1)
        }
      })
    }
  },
  hiddenMenu: function () {
    var that = this;
    that.setData({
      menuModalHide: true
    });
  },
  refreshListInfo:function(){
    this.setData({
      limit:this.data.page * this.data.pageSize
    })
    this.showLoading(!0)
    var componentId = this.data.tabs[this.data.activeIndex].componentId;
    console.log(componentId);
    this.selectComponent('#' + componentId).getDataList();
  },
  changeRefreshStat:function(e){
    console.log(e.detail)
    var that = this;
    that.setData(e.detail);
    if(that.data.isToTop){
      wx.pageScrollTo && wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
    })
    }
    that.showLoading(!1)
  }
})