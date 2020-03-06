// pages/loginchoose/loginchoose.js
var Mcaptcha = require('../../utils/mcaptcha.js'),
   i = require('../../const/storage.js'),
   e = require("../../model/login"),
   o = require("../../utils/util"), i = require("../../const/storage"), a = require("../../const/path"),    n = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enableLogin: !1,
    showClean:!1,
    isAgree:!1,
    agreementPath:a.PATH.PAGE_AGREEMENT
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    new n.userInfo(), e.login.models(this)
  },
  onTap() {
    this.mcaptcha.refresh();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mcaptcha = new Mcaptcha({
      el: 'canvas',
      width: 80,
      height: 35,
      createCodeImg: ""
    });
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
  eventGetUserInfo: function (event) {
    if(event.detail.userInfo){
      console.log("授权成功")
      wx.setStorage({
        key: i.STORAGE.USER_AUTHORIZE,
        data: !!event.detail.userInfo
      }),
        wx.setStorage({
          key: i.STORAGE.USER_INFO,
          data: event.detail.userInfo
        }),
        this.eventGoLogin();
    }else{
      e.login.dialogWarning()
    }

  },
  inputImgCode:function(e){
    var imgCode = e.detail.value
    this.setData({
      imgCode: imgCode
    })
  },
  getPhoneValue: function (e) {
    if(e.detail.value != '' && e.detail.value.length >3){
      this.setData({
        showClean:!0
      })
    }else{
      this.setData({
        showClean: !1
      })
    }
    this.setData({
      usrMp: e.detail.value
    })
  },
  eventGoLogin:function(){
    let that = this;
    let usrMp = that.data.usrMp;
    if (!usrMp || usrMp == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (usrMp.length != 11) {
      wx.showToast({
        title: '输入手机号长度有误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (!that.isPoneAvailable(usrMp)) {
      wx.showToast({
        title: '输入手机号格式有误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if (this.data.imgCode == '' || this.data.imgCode == null) {
      wx.showToast({ title: '请输入图形验证码',icon:'none' })
      return;
    }
    var res = this.mcaptcha.validate(this.data.imgCode);
    if (!res) {
      wx.showToast({ title: '图形验证码错误', icon: 'none' })
      this.mcaptcha.refresh();
      this.setData({
        imgCode:''
      })
      return;
    }
    if(!this.data.isAgree){
      wx.showToast({ title: '请阅读并同意百货帮服务协议', icon: 'none' })
      return;
    }
    e.login.toLogin(usrMp, function (e) {
      setTimeout(function () {
        that.tagLogin(),wx.navigateBack({
          delta: 2
        });
      }, 500);
    })
  },
  show:function(msg){
    wx.showToast({
      title: msg,
      icon:'none'
    })
  },
  isPoneAvailable: function (pone) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
  cleanUserMp:function(e){
    this.setData({
      usrMp:'',
      showClean:!1,
      enableLogin:!1
    })
  },
  bindAgreeChange:function(e){
    this.setData({
      isAgree: !!e.detail.value.length,
      enableLogin:!this.data.enableLogin
    });
  }
})