// components/stockinfo/stockinfo.js
var app = getApp(), p = require('../../const/path.js'), constant = require('../../const/constant.js');
Component({
  /**
   * 组件的属性列表
   */
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    type: {
      type: String
    },
    inputVal: {
      type: String
    },
    limit: {
      type: Number
    },
    isRefreshing: {
      type: Boolean
    },
    isLoadingMoreData: {
      type: Boolean
    },
    hasMoreData: {
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index:null,
    cargoMenuUrl:p.PATH.PAGE_CARGO_MENU
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDataList:function(){
      var type = this.data.type, that = this;
      var query = wx.createSelectorQuery();
      query.select('#weui-navb').boundingClientRect(function (rect) {
        that.setData({
          tabHeight: rect.height
        })
      }).exec();
      var condition = { userMp: app.globalData.userMp,
                    stat:'N'
       };
      wx.cloud.callFunction({
        name: 'dbapi',
        data: {
          operation: 'query',
          tabName: constant.CONSTANT.BIG_CLASS_TAB,
          condition: condition
        },
        success:function(res){
          var data = new Array()
          if(res.result && res.result.length >0){
            data = res.result
          }
          data.unshift({ _id: 0, bigClassName: '全部' })
          that.setData({
            bigClassList: data
          })
          if (that.data.inputVal
            && that.data.inputVal != '') {
            condition.cargoName = {
              $regex: '.*' + that.data.inputVal,
              $options: 'i'
            }
          }
          if (that.data.bigclassId && that.data.bigclassId != ''
            && that.data.bigclassId != 0) {
            condition.bigClassId = that.data.bigclassId
          }
          wx.cloud.callFunction({
            name: 'dbapi',
            data: {
              operation:'query',
              tabName:type,
              condition:condition,
              limit:that.data.limit,
              orderCondition:[{
                field:'transDate',
                condition:'desc'
              },{
                field: 'transTime',
                condition: 'desc'
            }]
            },
            success: res => {
              console.log(res)
              that.setData({
                list: res.result,
                isRefreshing: false,
                isLoadingMoreData: false,
                isToTop:false
              })
              if (res.result.length == 0){
                that.setData({
                  hasMoreData: true,
                  isToTop:false
                })
              } else if (res.result.length < that.data.limit){
                that.setData({
                  hasMoreData: false,
                  isToTop:false
                })
              }
              that.changeRefreshStat();
              console.log('[云函数] [dbapi-query]调用成功 ', res.result)
            },
            fail: err => {
              that.setData({
                isRefreshing: false,
                isLoadingMoreData: false,
                hasMoreData: false,
                isToTop:false
              })
              that.changeRefreshStat();
              console.error('[云函数] [dbapi-query] 调用失败', err)
            }
          })
        },
        fail:function(err){
          wx.showToast({
            title: '网络异常，请刷新重试',
            icon:'none'
          })
        },
        complete:function(){
        }
      })
    },
    changeRefreshStat: function () {
      var that = this;
      var classifyEventDetail = {
        isRefreshing: that.data.isRefreshing,
        isLoadingMoreData: that.data.isLoadingMoreData,
        hasMoreData: that.data.hasMoreData,
        isToTop:that.data.isToTop
      } // detail对象，提供给事件监听函数
      this.triggerEvent('classifyEvent', classifyEventDetail); //myevent自定义名称事件，父组件中使用
    },
    handleMenu:function(a){
      var that = this;
      var i = a.currentTarget.dataset.item; 
      console.log(i)
      that.setData({
        bigclassId:i._id,
        limit:10,
        hasMoreData:true,
        isRefreshing: false,
        isLoadingMoreData: false,
        isToTop:true
      })
      that.getDataList();
      that.changeRefreshStat();
    }
  }
})
