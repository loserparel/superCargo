// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    return accountCargoTotalNum(event)
}

async function accountCargoTotalNum(event){
  var _id = event.data._id,
  type = event.data.type;
  console.log(_id)
  var count = parseInt(event.data.count)
  console.log(count)
  var promise = null;
  if (count >0){
    promise = new Promise((resolve, reject) => {
      db.collection('cargo_info').doc(_id).update({ data: {
        totalNum: _.inc(count),
      } }).then(res => {
        console.log(res)
        resolve(res)
      })
    }).catch(err => {
      throw new Error('新增数据信息异常')
    })
  }else{
    var data = {};
    if(type && type =='M'){
      data.totalNum = _.inc(count)
    }else{
      data.saleNum = _.inc(-count)
    }
    promise = new Promise((resolve, reject) => {
      db.collection('cargo_info').doc(_id).update({
        data: data
      }).then(res => {
        console.log(res)
        resolve(res)
      })
    }).catch(err => {
      throw new Error('新增数据信息异常')
    })
  }
  return promise;
}
