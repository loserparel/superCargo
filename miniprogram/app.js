//app.js
var u = require("./utils/wxUtil"),
s = require("./utils/util.js"),
l = require("./component/backTop/backTop"),
d = require("./component/loading/loading"),
i = require("./model/userInfo"),
o = require("./const/storage.js");
global.regeneratorRuntime = require("./utils/runtime"),
App({
  userInfo: i.userInfo,
  backTop: l.backTop,
  loading: d.loading,
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    const updateManager = wx.getUpdateManager()
    wx.getStorage({
      key: o.STORAGE.USER_MP,
      success: function (e) {
        that.globalData.userMp = e.data;
      }
    })
    wx.cloud.init({
      env: this.globalData.prod,
      traceUser: true
    })
    
    wx.getStorage({
      key: o.STORAGE.UID,
      success: function(e) {
        that.globalData.uid = e.data;
      }
    }), wx.getStorage({
      key: o.STORAGE.OPENID,
      success: function(e) {
        that.globalData.openid = e.data;
      }
    }), wx.getStorage({
      key: o.STORAGE.SESSION_KEY,
      success: function(e) {
        that.globalData.sessionKey = e.data;
      }
    }),this.getSys(), (0, i.Session)()

  },
  onShow:function(){
    var n = wx.getSystemInfoSync();
    this.globalData.sdkVersion = n.SDKVersion, "devtools" !== n.platform && (-1 == (0,
      s.versionCompare)(n.version, "6.5.8") && this.incompatibleVersion(), (0, s.versionCompare)(n.SDKVersion, "1.9.90") > -1 && this.updateApp());
  },
  updateApp: function () {
    var e = wx.getUpdateManager();
    e.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，请重启应用",
        showCancel: !1,
        success: function (a) {
          a.confirm && e.applyUpdate();
        }
      });
    });
  },
  getSys: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(a) {
        var t = a.windowWidth,
          o = a.windowHeight;
          that.globalData.windowW = t, that.globalData.windowH = o;
      }
    });
  },
  incompatibleVersion: function () {
    var e = this;
    wx.showModal({
      title: "提示",
      content: "您的微信版本过低，请升级版本~",
      showCancel: !1,
      complete: function () {
        e.closeWindow();
      }
    });
  },
  globalData:{
    userInfo: null,
    userHasLogined: 0,
    loginCallBack: null,
    uid: -1,
    openid:'',
    userMp:'',
    dev: 'parel-qh8hb',
    prod:'release-xs1sn',
    sdkVersion: "",
    windowW: 0,
    windowH: 0,
    sessionKey:''
  },
  openPage:u.openPage,
  removeStorageOld:function(){
    this.globalData.userInfo = null;
    this.globalData.userMp = '';
    this.globalData.userHasLogined = 0;
  }
})