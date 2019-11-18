// components/stockinfo/stockinfo.js
var app = getApp();
wx.cloud.init({
  env: app.globalData.env
})
const db = wx.cloud.database({
  env: app.globalData.env
})
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String
    },
    manageUrl:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pageSize:10,
    queryName:'item.bigClassName'
  },
  ready:function(){
    this.getDataList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDataList:function(){
      var type = this.data.type;
      var that = this;
      db.collection(type).count({
        success: function (res) {
          that.data.totalCount = res.total;
        }
      })
      try {
        db.collection(type).where({
          _openid: app.globalData.openid
        }).limit(that.data.pageSize)
          .get({
            success: function (res) {
              console.log(res.data)
              that.data.bigClassList = res.data;
              that.setData({
                list: that.data.bigClassList,
              })
              wx.hideNavigationBarLoading();//隐藏加载
              wx.stopPullDownRefresh();
            },
            fail: function (event) {
              wx.hideNavigationBarLoading();//隐藏加载
              wx.stopPullDownRefresh();
            }
          })
      } catch (e) {
        wx.hideNavigationBarLoading();//隐藏加载
        wx.stopPullDownRefresh();
        console.error(e);
      }
    }
  }
})
