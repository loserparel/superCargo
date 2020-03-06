var e = require("../const/path"), a = require("./util");
module.exports = {
  openPage: function (r) {
    var t = r.type, i = r.url, s = r.params, c = getApp(), u = [e.PATH.PAGE_SALE, e.PATH.PAGE_CLASSFIC, e.PATH.PAGE_STOCK, e.PATH.PAGE_MINE], A = [], n = "", P = 0;
    for (var l in s) A.push([l] + "=" + s[l]);
    n = s ? i + "?" + (A.length > 1 ? A.join("&") : A[0]) : i, i && u.indexOf(i.split("?")[0]) >= 0 && (P = 2,
      i.split("?")[1] && (c.globalData.query = (0, a.getQueryObject)(i), n = i.split("?")[0]));
    var o = {
      url: n
    };
    switch (t || P) {
      case 0:
        n && wx.navigateTo(o);
        break;

      case 1:
        n && wx.redirectTo(o);
        break;

      case 2:
        n && wx.switchTab(o);
        break;

      case 3:
        n && wx.reLaunch(o);
        break;

      case 4:
        wx.navigateBack();
        break;

      default:
        n && wx.navigateTo(o);
    }
  }
}