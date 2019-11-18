// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type: String
    },
    addUrl:{
      type:String
    },
    manageUrl:{
      type: String
    },
    menuModalHide:{
      type: Boolean,
      value:true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidth: 375,
    menuArr:[{text:'扫一扫',id:'scan'},{text:'新增',id:'add'}]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWindowWidth:function(){
      var that = this;
      wx.getSystemInfo({
        success: (res) => {
          that.setData({
            windowWidth: res.windowWidth
          });
        }
      });
    },
    showInput: function () {
      this.setData({
        inputShowed: true,
        menuModalHide: true
      });
    },
    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false,
        menuModalHide: true
      });
    },
    clearInput: function () {
      this.setData({
        inputVal: "",
        menuModalHide: true
      });
    },
    inputTyping: function (e) {
      this.setData({
        inputVal: e.detail.value,
        menuModalHide: true
      });
    },
    clickAddBtn:function(e){
      console.log(this.data.type)
      console.log(this.data.menuModalHide)
      var that = this;
      this.getWindowWidth();
      if (that.data.menuModalHide) {
        that.setData({
          menuModalHide: false
        })
      } else {
        that.setData({
          menuModalHide: true
        })
      }
    },
    operationMenu:function(e){
      var operation = e.target.id;
      this.hiddenMenu();
      if(operation == 'add'){
        wx.navigateTo({
          url: this.data.addUrl
        })
      }else{
        wx.scanCode({
          onlyFromCamera: false,
          scanType: ['barCode'],
          success: function (res) {
            wx.cloud.callFunction({
              // 要调用的云函数名称
              name: 'stockinfo',
              // 传递给云函数的参数
              data: {
                isbn: res.result
              },
              success: res => {
                console.log(res)
                var result = JSON.parse(res.result);
                console.log(res.result)
                console.log(result)
                if (result.code == 1) {
                  wx.showToast({
                    title: '哈哈哈，你扫的商品是' + result.data.goodsName,
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: '呜呜呜，我不知道你扫的是啥。',
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        })
      }
    },
    hiddenMenu:function(){
      var that = this;
      that.setData({
        menuModalHide: true
      });
    }
  }
})
