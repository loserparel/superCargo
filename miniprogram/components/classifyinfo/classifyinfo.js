// components/stockinfo/stockinfo.js
var app = getApp(),util = require('../../utils/util.js'),
constant = require('../../const/constant.js');
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
    manageUrl: {
      type: String
    },
    inputVal:{
      type: String
    },
    limit:{
      type:Number
    },
    isRefreshing:{
      type:Boolean
    },
    isLoadingMoreData:{
      type:Boolean
    },
    hasMoreData:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bigClassInfo:[]
  },
  ready:function(){
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#weui-navb').boundingClientRect(function (rect) {
      that.setData({
        tabHeight: rect.height
      })
    }).exec();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputBigClassName:function(e){
      console.log(e.detail.value)
      this.setData({
        bigClassName: e.detail.value
      })
    },
    getDataList: function () {
      var type = this.data.type;
      var that = this;
      console.log(that.data.inputVal)
      var condition = { userMp: app.globalData.userMp,
          stat:'N' };
      if (that.data.inputVal
        && that.data.inputVal != '') {
          condition.bigClassName = {
            $regex: '.*' + that.data.inputVal,
            $options: 'i'
          }
      }
      var orderCondition = [{ field: 'priority', condition:'asc'}]
      try {
        wx.cloud.callFunction({
          name: 'dbapi',
          data: {
            operation: 'query',
            tabName: type,
            condition: condition,
            limit: that.data.limit,
            orderCondition: orderCondition
          },
          success: res => {
            console.log(res)
            that.setData({
              bigClassList: res.result,
              isRefreshing: false,
              isLoadingMoreData: false
            })
            if (res.result.length == 0) {
              that.setData({
                hasMoreData: true
              })
            } else if (res.result.length < that.data.limit) {
              that.setData({
                hasMoreData: false
              })
            }
            that.changeRefreshStat();
            console.log('[云函数] [dbapi-query-classify]调用成功 ', res.result)
          },
          fail: err => {
            that.setData({
              isRefreshing: false,
              isLoadingMoreData: false,
              hasMoreData: false
            })
            that.changeRefreshStat();
            console.error('[云函数] [dbapi-query-classify] 调用失败', err)
          }
        })
      } catch (e) {
        that.setData({
          isRefreshing: false,
          isLoadingMoreData:false
        })
        that.changeRefreshStat();
        console.error(e);
      }
    },
    changeRefreshStat:function(){
      var that = this;
      var classifyEventDetail = { isRefreshing: that.data.isRefreshing, 
                                  isLoadingMoreData: that.data.isLoadingMoreData,
                                  hasMoreData:that.data.hasMoreData } // detail对象，提供给事件监听函数
      this.triggerEvent('classifyEvent', classifyEventDetail); //myevent自定义名称事件，父组件中使用
    }, 
    cancleAdd:function(){
      var bigClassList = this.data.bigClassList
      bigClassList.splice(0,1);
      this.setData({
        bigClassList: bigClassList
      })
    },
    sureAdd:function(e){
      var that = this,type = this.data.type;
      if (!this.data.bigClassName 
      || this.data.bigClassName == ''){
        wx.showToast({
          title: '请输入商品大类名称',
          icon:'none'
        })
        return;
      }
      wx.showLoading({
        title: '新增中',
        mask:true
      })
      try {
        var condition = {
          userMp: app.globalData.userMp,
          bigClassName: this.data.bigClassName
        }
        var data = {
          userMp: app.globalData.userMp,
          bigClassName: that.data.bigClassName,
          priority: this.data.bigClassList.length < 1 ? 0 : 1,
          stat: 'N',
          transDate: util.formatDate(new Date()),
          transTime: util.formatTime(new Date())
        }
        const promise = new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'dbapi',
            data: {
              operation: 'query',
              tabName: type,
              condition: condition
            }
          }).then(res => {
            console.log(res)
            if (res.result != null && res.result.length > 0) {
              wx.showToast({
                icon: 'none',
                title: '商品大类已存在，不能重复添加'
              })
              wx.hideLoading();
            } else {
                wx.cloud.callFunction({
                  name: 'dbapi',
                  data: {
                    operation: 'add',
                    tabName: type,
                    data: data
                  }
                }).then(res => {
                  if (res == null) {
                    wx.showToast({
                      title: '新增商品大类失败',
                      icon:'none'
                    })
                  }
                  this.getDataList();
                  wx.hideLoading();
                })
            }
          })
        })
      } catch (e) {
        console.error(e)
      }

    },
    bigclassPriority:function(e){
      let type = this.data.type
      let _id = e.currentTarget.dataset.id
      let index = e.currentTarget.dataset.index
      console.log(index)
      let bigClassList = this.data.bigClassList
      if (bigClassList.length == 1){
        bigClassList[index].priority = 0
      }else{
        let bigClassInfo = bigClassList[index]
        for (var i in bigClassList) {
          if (i != index) {
            bigClassList[i].priority = 1
          }
        }
        bigClassInfo.priority = 0
        bigClassList.splice(index, 1)
        if (bigClassList[0].bigClassName == '') {
          bigClassList.splice(0, 1, bigClassInfo)
        } else {
          bigClassList.unshift(bigClassInfo)
        }
      }
      this.setData({
        bigClassList: bigClassList
      })
      var updCondit = {
        userMp: app.globalData.userMp,
      }
      wx.cloud.callFunction({
        name: 'dbapi',
        data: {
          operation: 'update',
          tabName: type,
          condition: updCondit,
          params: { priority: 1}
        }
      }).then(res => {
        updCondit._id = _id;
        console.log(updCondit)
        wx.cloud.callFunction({
          name: 'dbapi',
          data: {
            operation: 'update',
            tabName: type,
            condition: updCondit,
            params: { priority: 0 }
          }
        }).then(res=>{
          console.log("更新商品大类优先级返回参数",res)
        })
      })
    },
    /**
     * 显示删除按钮
     */
    showDeleteButton: function (e) {
      console.log(e.currentTarget.dataset)
      console.log(e.currentTarget.dataset.bigclassindex)
      let bigclassindex = e.currentTarget.dataset.bigclassindex
      this.setXmove(bigclassindex, -65)
      },

      /**
       * 隐藏删除按钮
       */
      hideDeleteButton: function (e) {
        let bigclassindex = e.currentTarget.dataset.bigclassindex

        this.setXmove(bigclassindex, 0)
      },

      /**
       * 设置movable-view位移
       */
    setXmove: function (bigclassindex, xmove) {
      let bigClassList = this.data.bigClassList
      if (bigClassList.length<1){
        return;
      }
      console.log(bigClassList)
      console.log(bigClassList[bigclassindex])
      bigClassList[bigclassindex].xmove = xmove

      this.setData({
        bigClassList: bigClassList
      })
    },

      /**
       * 处理movable-view移动事件
       */
    handleMovableChange: function (e) {
      if (e.detail.source === 'friction') {
        if (e.detail.x < -30) {
          this.showDeleteButton(e)
        } else {
          this.hideDeleteButton(e)
        }
      } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
        this.hideDeleteButton(e)
      }
    }, 
    handleTouchStart(e) {
      this.startX = e.touches[0].pageX
    },

    /**
     * 处理touchend事件
     */
    handleTouchEnd(e) {
      console.log(e.changedTouches[0].pageX)
      console.log(this.startX)
      if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -80) {
        this.showDeleteButton(e)
      } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX > 30) {
        this.hideDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    }, 
    handleDeleteBigclass: function (event) {
      var that = this;
      var condition = {
        userMp: app.globalData.userMp,
        _id : event.currentTarget.dataset.id
      }
      console.log(condition)
      try{
        wx.cloud.callFunction({
          name: 'dbapi',
          data: {
            operation: 'delete',
            tabName: this.data.type,
            condition: condition
          },
          success:function(res){
            that.getDataList();
          },
          fail:function(err){
            wx.showToast({
              title: '删除商品大类失败',
              icon:'none'
            })
          }
        })
      }catch(e){
        console.error(e)
      }
    },
    addBigClass:function(){
      if (this.data.bigClassList.length > 0
      &&  this.data.bigClassList[0].bigClassName == ''){
        wx.showToast({
          title: '请逐个添加',
          icon: 'none'
        })
        return false;
      }
      var addBigClass = {bigClassName:'',_id:''};
      this.data.bigClassList.unshift(addBigClass);
      this.setData({
        bigClassList: this.data.bigClassList
      })
    },
    inputUpdBigClassName:function(e){
      var updClassName = e.detail.value
      this.setData({
        updClassName: updClassName
      })
    },
    updateBigClass:function(e){
      var _id = e.currentTarget.dataset.id
      var bigClassList = this.data.bigClassList
      if (bigClassList.length > 0
        && bigClassList[0].bigClassName == '') {
        for (var ind in bigClassList) {
          if (bigClassList[index]._id == id) {
            bigClassList[index].isUpd = false
          }
        }
          return;
      }
      console.log(_id)
      for (var index in bigClassList){
        if (bigClassList[index]._id == _id){
          console.log(index)
          bigClassList[index].isUpd = true
        }
      }
      this.setData({
        bigClassList: bigClassList
      })
    },
    doUpdBigClass:function(e){
      var that = this;
      let id = e.currentTarget.dataset.id
      var bigClassList = this.data.bigClassList
      var updClassName = this.data.updClassName
      var bigClassName = '';
      console.log(this.data.updClassName)
      for (var index in bigClassList) {
        if (bigClassList[index]._id == id) {
          bigClassName = bigClassList[index].bigClassName
          bigClassList[index].isUpd = false
        }
      }
      if (!updClassName || updClassName == ''
        || updClassName == bigClassName){
        this.setData({
          bigClassList: bigClassList
        })
        return false;
      }
      var updCondition  = {
        userMp :app.globalData.userMp,
        _id : id
      }
      wx.cloud.callFunction({
        name:'dbapi',
        data:{
          operation:'update',
          tabName:this.data.type,
          condition: updCondition,
          params:{
            bigClassName: updClassName
          }
        },
        success:function(){
          for (var index in bigClassList){
            if (bigClassList[index]._id == id){
              bigClassList[index].isUpd = false
              bigClassList[index].bigClassName = updClassName
            }
          }
          that.setData({
            bigClassList: bigClassList
          })
        },
        fail:function(){
          for (var index in bigClassList) {
            if (bigClassList[index]._id == id) {
              bigClassList[index].isUpd = false
            }
          }
          that.setData({
            bigClassList: bigClassList
          })
        }
      })
    }
  }
})
