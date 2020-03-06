var m = null, p = require('../const/path.js'),
c = require('../const/constant.js'),
e = require('../const/storage.js'),
u = require('../utils/util') ,i = 4,s=0,d = {
  w: 0,
  h: 0,
  p: 0,
  size: function() {
      if (null == this.w && this.h > 0) return {
          w: this.w,
          h: this.h
      };
      try {
          var t = wx.getSystemInfoSync();
          return this.w = t.windowWidth * (750 / t.windowWidth), this.h = t.windowHeight, 
          this.p = t.windowWidth / 750, {
              w: this.w,
              h: this.h,
              p: this.p
          };
      } catch (t) {}
      return {
          w: 0,
          h: 0,
          p: 0
      };
  }
},
o ={
  models: function (t) {
    m = t;
    var e = d.size();
    s = e.p, i = parseInt((e.w - 108) / 128);
  },
  initOrderInfo:function(params){
    var usrMp = wx.getStorageSync(e.STORAGE.USER_MP)
    var that = this
    let today = u.formatDate(new Date())
    let daysAgo = u.getDaysAgo(30)
    var condition = {}
    var gteCondition = null
    var ltCondition = null
    var orderCondition = new Array()
    if(params == 'today'){
      condition = {
        userMp: usrMp,
        orderDate:today
      }
    }else{
      condition = {
        userMp: usrMp
      },
      gteCondition = {
        orderDate:daysAgo
      },
      ltCondition = {
        orderDate:today
      },
      orderCondition= [{
        field:'orderDate',condition:'desc'
      },{
        field:'orderTime',condition:'desc'
      }]
    }
    m.showLoading(!0)
    if(usrMp && usrMp != ''){
      wx.cloud.callFunction({
        name:'dbapi',
        data:{
          operation: 'query',
          tabName: c.CONSTANT.ORDER_TAB,
          condition: condition,
          orderCondition:orderCondition,
          gteCondition:gteCondition,
          ltCondition:ltCondition
        },
        success:function(res){
          console.log(res)
          if(res.result.length >0){
            m.setData({
              orders:that.dealNormalData(res.result)
            })
          }
        },
        complete:function(){
          m.showLoading(!1)
        }
      })
    }
  },
  dealNormalData:function(t){
    console.log(t)
    for(var e = 0;e < t.length; e++){
      var l = t[e]
      l.orderListTmp = new Array();
      for (var u = 0; u < l.orderList.length && u < i; u++) l.orderListTmp[u] = l.orderList[u], 
      l.orderListTmp[u].imgW = 108;
      l.orderList.length > i && (l.orderListTmp[i] = {
          id: "0x",
          imgW: 28,
          imagePath: "../../images/order_item_nore.png"
      });
    }
    console.log(t)
    return t;
  }
}

module.exports = {
  order: o
};