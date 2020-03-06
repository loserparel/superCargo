var e = Object.assign || function (e) {
  for (var t = 1; t < arguments.length; t++) {
    var a = arguments[t];
    for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r]);
  }
  return e;
},
  t = require("../const/params"),
  a = require("../const/storage"),
  r = require("./util"),
  o = require("../const/path"),
  i = require("../const/errorCode"),
  n = require("./wxUtil"),
  s = {
    map: {},
    mq: [],
    running: [],
    MAX_REQUEST: 10,
    push: function (o) {
      var i = t.COMMON,
        n = wx.getStorageSync(a.STORAGE.LOCATION),
        s = {
          longitude: 0,
          latitude: 0
        };
      if (n ? (n.location && (s = {
        longitude: n.location.location[0],
        latitude: n.location.location[1]
      }), i = e({}, i, {
        station_id: n.station_id || ""
      }, s)) : i = e({}, i, s), !(0, r.isObjectEmpty)(getApp())) {
        var O = getApp().globalData.uid,
          d = getApp().globalData.openid;
        if (-1 == O) {
          var u = wx.getStorageSync(a.STORAGE.UUID);
          u || (u = (0, r.UUID)(), (0, r.SafeSetStorageSync)(a.STORAGE.UUID, u)), getApp().globalData.uid = u,
            O = u;
        }
        i = e({}, i, {
          uid: O,
          openid: d
        });
      }
      o.data = Object.assign(i, o.data || {});
      var E = {
        "Content-Type": "application/x-www-form-urlencoded"
      },
        l = wx.getStorageSync(a.STORAGE.SESSION_ID);
      for ("" != l && (E = {
        Cookie: "DDXQSESSID=" + l,
        "Content-Type": "application/x-www-form-urlencoded"
      }, o.data = e({}, o.data, {
        s_id: l
      })), o.header = e({}, o.header || {}, E), o.t = +new Date(); this.mq.indexOf(o.t) > -1 || this.running.indexOf(o.t) > -1;) o.t += 10 * Math.random() >> 0;
      this.mq.push(o.t), this.map[o.t] = o;
    },
    next: function () {
      var e = (0, r.getCurrentPage)(),
        t = this;
      if (0 !== this.mq.length && this.running.length < this.MAX_REQUEST) {
        var s = this.mq.shift(),
          O = this.map[s],
          d = O.complete,
          u = O.ignore_result,
          E = O.overHttpOutCallBack;
        O.complete = function () {
          for (var s = arguments.length, l = Array(s), g = 0; g < s; g++) l[g] = arguments[g];
          if (l.length > 0) {
            var S = l[0];
            if (void 0 === S.data) u || (e && e.show ? e.show("网络不给力哦,请检查网络设置") : wx.showToast({
              image: "../../images/guide_close.png",
              title: "网络不给力"
            }));
            else {
              var c = 1 * S.data.code;
              if (c) {
                if (!u) {
                  var R = !0;
                  switch (c) {
                    case i.ERROR_CODE.LOGIN_OUT_TIME:
                    case i.ERROR_CODE.NEED_LOGIN:
                      if (R = !0, E) {
                        E();
                        break;
                      }
                      (0, r.removeStorageKeys)([a.STORAGE.USER_AUTHORIZE, a.STORAGE.SESSION_ID, a.STORAGE.USER_INFO, a.STORAGE.UID, a.STORAGE.CART_TOTAL_COUNT]);
                      var p = wx.getStorageSync(a.STORAGE.LOGIN_OUT_PATH);
                      if (e) {
                        var _ = e.route;
                        "/" + _ === o.PATH.PAGE_VIP && e.setVipNeedReload(), _ === p ? (0, n.openPage)({
                          url: o.PATH.PAGE_MINE
                        }) : ((0, r.SafeSetStorageSync)(a.STORAGE.LOGIN_OUT_PATH, _), (0, n.openPage)({
                          url: o.PATH.PAGE_LOGIN_CHOOSE + "?logout=true"
                        }));
                      } else (0, n.openPage)({
                        url: o.PATH.PAGE_LOGIN_CHOOSE + "?logout=true"
                      });
                      void 0 != e.data._hasLoginPage_ && e.setData({
                        _hasLoginPage_: 1
                      }), !!wx.removeTabBarBadge && wx.removeTabBarBadge({
                        index: 3
                      });
                      break;

                    case i.ERROR_CODE.MAKEORDER_STOCKOUT:
                    case i.ERROR_CODE.MAKEORDER_ERROR:
                    case i.ERROR_CODE.MAKEORDER_BACKCART:
                    case i.ERROR_CODE.MAKEORDER_INVALID_TIME:
                    case i.ERROR_CODE.ACK_REGISTER:
                      R = !1;
                  }
                  if (R) {
                    var T = "";
                    S.data && (T = S.data.msg || S.data.message || ""), e && e.show ? e.show(T || "网络不给力哦,请检查网络设置") : wx.showToast({
                      image: "../../assets/network/guide_close.png",
                      title: T || "网络错误"
                    });
                  }
                }
              } else {
                if (S.data.server_time) {
                  var h = S.data.server_time;
                  r.TimeUtil.updateServerTime(h);
                }
                if (S.data.data) {
                  var A = S.data.data.toast;
                  A && e && e.show && e.show(A, 2500);
                }
              }
            }
          }
          t.running.splice(t.running.indexOf(O.t), 1), delete t.map[O.t], d && d.apply(O, l),
            t.next();
        };
        var l = O.success,
          g = O.fail;
        return O.success = function () {
          for (var e = arguments.length, t = Array(e), o = 0; o < e; o++) t[o] = arguments[o];
          var i = t[0] && t[0].header && t[0].header["Set-Cookie"];
          i && (0, r.SafeSetStorageSync)(a.STORAGE.SESSION_ID, (0, r.getCookie)(i, "DDXQSESSID")),
            t[0].data && (0 === t[0].data.code && l && l.apply(O, t), 0 !== t[0].data.code && g && g.apply(O, t));
        }, this.running.push(O.t), wx.request(O);
      }
    },
    abort: function (e) { },
    request: function (e) {
      return this.push(e), this.next();
    },
    downloadFile: function (e) { },
    uploadFile: function (e) { }
  };

module.exports = {
  RequestMQ: s
};