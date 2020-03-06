var t = require("../../utils/util.js");

module.exports = {
  backTop:function(){
    var o = (0, t.getCurrentPage)(),
    a = {
      _backTop_: {
        is_hide: !0,
        style_bottom: ""
      }
    },
    i = {
      _backTopShow: function (t, o) {
        this.setData({
          "_backTop_.is_hide": !t,
          "_backTop_.style_bottom": o || "10px"
        });
      },
      _backTopStatus: function () {
        return this.data._backTop_.is_hide;
      },
      _backTopGo: function () {
        var t = this;
        o._backTop && o._backTop(function () {
          t._backTopShow(!1);
        });
      }
    };
    Object.assign(o, i), o.setData(a);
  }
}