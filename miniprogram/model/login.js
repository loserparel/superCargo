var s = null, app = getApp(), constant = require('../const/constant.js'),
util = require('../utils/util.js'), storage = require('../const/storage'),
u = require('./userInfo.js'),
r = {
  models: function (e) {
    s = e;
  },
  authFun: function (e, t, a) {
    var that = this;
    arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    var o = arguments[4];
    !(arguments.length > 5 && void 0 !== arguments[5]) || arguments[5];
    wx.showModal({
      title: e,
      content: t,
      confirmText: "去设置",
      success: function (e) {
        e.confirm ? wx.openSetting && wx.openSetting() : s.eventGoLogin();
      }
    });
  },
  dialogWarning: function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, t = arguments[1];
    this.authFun("温馨提示", "您点击了拒绝授权，将无法正常显示个人信息，请先前往设置进行授权。", !1, e, t, !1);
  },
  toLogin: function (mobile){
    var u = arguments[1]
    wx.showLoading({
      title: '登录中',
    })
    wx.cloud.callFunction({
      name:'dbapi',
      data:{
        operation:'query',
        tabName: constant.CONSTANT.USER_INFO_TAB,
        condition:{
          userMp: mobile
        }
      },
      success:function(res){
        console.log('根据手机号查询当前客户是否存在返回成功',res)
        if (res.result.length < 1){
          wx.showModal({
            title: '提示',
            content: '该手机号还未注册，是否现在注册？',
            confirmText:'是',
            cancelText:'否',
            success:function(res){
              if(res.cancel){

              }else if(res.confirm){
                wx.cloud.callFunction({
                  name: 'dbapi',
                  data: {
                    operation: 'add',
                    tabName: constant.CONSTANT.USER_INFO_TAB,
                    data: {
                      userMp: mobile,
                      openDate: util.formatDate(new Date()),
                      openTime:util.formatTime(new Date())
                    }
                  },
                  success:function(res){
                    util.SafeSetStorageSync(storage.STORAGE.USER_MP, mobile)
                    app.globalData.userMp = mobile
                    app.globalData.userHasLogined = 1
                    u(res) && s.show('注册并登录成功')
                  },
                  fail:function(err){
                    u(err) && s.show('注册失败，请刷新后重试')
                  },
                  complete:function(){
                    wx.hideLoading()
                  }
                })
              }
            }
          })
        }else{
          util.SafeSetStorageSync(storage.STORAGE.USER_MP, mobile)
          wx.cloud.callFunction({
              name: 'dbapi',
              data: {
                operation: 'update',
                tabName: constant.CONSTANT.USER_INFO_TAB,
                params: {
                  lastLoginDate: util.formatDate(new Date()),
                  lastLoginTime:util.formatTime(new Date())
                },
                condition:{
                  userMp:mobile
                }
              },
              success:function(res){
                util.SafeSetStorageSync(storage.STORAGE.USER_MP, mobile)
                app.globalData.userMp = mobile
                app.globalData.userHasLogined = 1
                u(res) && s.show('登录成功')
              },
              fail:function(err){
                u(err) && s.show('登录失败，请刷新后重试')
              },
              complete:function(){
                wx.hideLoading()
              }
            })
        }
      },
      fail:function(err){
        console.log('根据手机号查询当前客户是否存在返回失败', err)
        u(err) && s.show('登录失败，请刷新后重试')
      },
      complete:function(){
        wx.hideLoading()
      }
    })

  }
}
module.exports = {
  login: r
};