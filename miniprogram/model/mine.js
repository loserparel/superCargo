var n = null, e = require('../const/storage.js'),
o = {
  getUserDetail: function() {
    var s = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
      o = wx.getStorageSync(e.STORAGE.USER_INFO), p = wx.getStorageSync(e.STORAGE.USER_MP)
    if (o) {
      var i = o;
      n.setData({
        userInfo: i,
        isLogin: !0,
        userMp: p
      });
    }else{
      n.setData({
        userInfo: i,
        isLogin: !1,
        userMp: ''
      });
    }
  },
  models: function (t) {
    n = t;
  }
}
module.exports = {
  mine: o
};