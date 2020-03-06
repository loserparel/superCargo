var e = require("../const/storage"),
  n = require("../utils/util"),
  o = require("../utils/network"),
  t = require("../const/path.js"),
  i = function() {
    var a = getApp()
    if (0 == a.globalData.userHasLogined)
     try {
      var t = wx.getStorageSync(e.STORAGE.USER_INFO);
      var userMp = wx.getStorageSync(e.STORAGE.USER_MP),
        n = wx.getStorageSync(e.STORAGE.USER_AUTHORIZE);
        a.globalData.userHasLogined = userMp && userMp != '' && n ? 1 : -1;
    } catch (e) {
    }
    return 1 == a.globalData.userHasLogined;
  },
  l = function () {
    var a = getApp();
    a && null != a.globalData.loginCallBack && (a.globalData.loginCallBack(), a.globalData.loginCallBack = null);
  },
  g = function () {
    var session_key = wx.getStorageSync(e.STORAGE.SESSION_KEY);
    if(session_key && session_key !=''){
      wx.checkSession({
  　　　　success: function(res){
    　　　　　　console.log("小程序已处于登录态");
  　　　　},
  　　　　fail: function(res){
  　　　　　　console.log("小程序需要重新登录");
  　　　　　　S(l);
  　　　　}
      })
    }else{
　　　　  console.log("获取小程序sessionKey为空需要重新登录");
　　　　  S(l);
    }
  },
  r = function () {
    var a = arguments.length > 0  ? arguments[0] : null;
    if (a!=null)
      var res = JSON.parse(a);
      if(res.session_key != '' && res.openid != ''){
        var t = getApp();
         t.globalData.sessionKey = res.session_key, t.globalData.openid = res.openid,
          wx.setStorage({
            key: e.STORAGE.OPENID,
            data: res.openid
          }), wx.setStorage({
            key: e.STORAGE.SESSION_KEY,
            data: res.session_key
          }), wx.setStorage({
            key: e.STORAGE.USER_AUTHORIZE,
            data: !0
          });
      }else{

      }
  },
  S = function(){
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
      e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
      i = (0,n.getCurrentPage)();
      wx.login({
        success: function(n) {
          wx.cloud.callFunction({
            name: 'login', 
            data: {code:n.code},
            success: res => {
              r(res.result), e && e(res.result);
            },
            fail: err => {
              getApp().globalData.userHasLogined = -1,
              i ? i.show && i.show("获取用户授权态失败,请退出重新登录") : wx.showToast({
                title: "获取用户授权态失败,请退出重新登录",
                icon: "fail"
              });
            },
            complete: function(a) {
              t && t();
            }
          })
        },
        fail: function(a) {
          i ? i.show && i.show("获取用户授权态失败,请退出重新登录") : wx.showToast({
            title: "获取用户授权态失败,请退出重新登录",
            icon: "fail"
          });
        }
      })
  };

module.exports = {
  userInfo: function () {
    var g = getCurrentPages(),
      r = g[g.length - 1],
      s = {
        getLoginState: function () {
          return getApp().globalData.userHasLogined;
        },
        isUserLogined: function () {
          return i();
        },
        tagLogin: function () {
          getApp().globalData.userHasLogined = 1, wx.setStorageSync(e.STORAGE.USER_AUTHORIZE, !0);
        },
        gotoLogin: function () {
          var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          this.setData({
            _loginCallBack_: a
          }), wx.navigateTo({
            url: t.PATH.PAGE_LOGIN
          });
        },
        bindLoginedBack: function () {
          var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          this.setData({
            _hasLoginPage_: -1,
            _httpLoginOutCallBack_: a
          });
        },
        logOut: function () {
          var f = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null;
          getApp().globalData.userHasLogined = 0, wx.setStorageSync(e.STORAGE.USER_AUTHORIZE, 0);
          try{
              wx.removeStorageSync(e.STORAGE.USER_AUTHORIZE), 
                wx.removeStorageSync(e.STORAGE.USER_MP), wx.removeStorageSync(e.STORAGE.USER_INFO)
                , S(),null != f && f(), wx.navigateBack({
                  url: t.PATH.PAGE_MINE
                });
          }catch(a){

          }
        },
        registerLoginStateListener: function (a, t) {
          var e = this;
          if (0 != getApp().globalData.userHasLogined) return this.isUserLogined() ? a() : t();
          this.registerLoginedEndCallBack(function () {
            return e.isUserLogined() ? a() : t();
          }), this.isUserLogined() && l();
        }
      }
    Object.assign(r, s);
  },
  isUserLogined: i,
  Session: g,
  AutoLoginByWX: S
}
