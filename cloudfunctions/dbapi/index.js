// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  switch (event.operation){
    case 'add':{
      return dbAdd(event) 
    }
    case 'query':{
      return dbQuery(event)
    }
    case 'update':{
      return dbUpdate(event)
    }
    case 'delete':{
      return dbdelete(event)
    }
    default:{
      return
    }
  }
}

async function dbAdd(event){
  const tabName = event.tabName
  const data = event.data
  const promise = new Promise((resolve, reject) => {
    db.collection(tabName).add({ data: data}).then(res=>{
      console.log(res)
      resolve(res._id)
    })
  }).catch(err => {
    throw new Error('新增数据信息异常')
  })
  return promise;
} 

async function dbQuery(event) {
  const tabName = event.tabName
  const condition = event.condition
  const neqCondition = event.neqCondition
  const ltCondition = event.ltCondition
  const lteCondition = event.ltCondition
  const gtCondition = event.gtCondition
  const gteCondition = event.gteCondition
  const inCondition = event.inCondition
  const ninCondition = event.ninCondition
  if(neqCondition && neqCondition != null){
    console.log(neqCondition)
    let field = Object.keys(neqCondition)[0]
    let condition = Object.values(neqCondition)[0]
    condition.field = _.neq(condition)
  }
  if(lteCondition && lteCondition != null){
    console.log(lteCondition)
    let field = Object.keys(lteCondition)[0]
    let condition = Object.values(lteCondition)[0]
    condition.field = _.lte(condition)
  }
  if(ltCondition && ltCondition != null){
    console.log(ltCondition)
    let field = Object.keys(ltCondition)[0]
    let condition = Object.values(ltCondition)[0]
    condition.field = _.lt(condition)
  }
  if(gtCondition && gtCondition != null){
    console.log(ltCondition)
    let field = Object.keys(gtCondition)[0]
    let condition = Object.values(gtCondition)[0]
    condition.field = _.gt(condition)
  }
  if(gteCondition && gteCondition != null){
    console.log(gteCondition)
    let field = Object.keys(gteCondition)[0]
    let condition = Object.values(gteCondition)[0]
    condition.field = _.gte(condition)
  }
  if(inCondition && inCondition != null){
    console.log(inCondition)
    let field = Object.keys(inCondition)[0]
    let condition = Object.values(inCondition)[0]
    condition.field = _.in(condition)
  }
  if(ninCondition && ninCondition != null){
    console.log(ninCondition)
    let field = Object.keys(ninCondition)[0]
    let condition = Object.values(ninCondition)[0]
    condition.field = _.nin(condition)
  }
  const limit = event.limit
  const fields = event.fields
  const collection = db.collection(tabName)
  var query = collection.where(condition)
  if (fields && fields != '') {
    query = query.field(fields)
  }
  if (limit && limit != ''){
    query = query.limit(limit)
  }
  if (event.orderCondition && event.orderCondition != '') {
    const orderCondition = JSON.parse(JSON.stringify(event.orderCondition))
    for (var i in orderCondition){
      query = query.orderBy(orderCondition[i].field, orderCondition[i].condition)
    }
  }
  const promise = new Promise((resolve, reject) => {
    query.get().then(res => {
      resolve(res.data)
    })
  }).catch(err => {
    throw new Error('根据条件查询数据信息异常')
  })
  return promise
}

async function dbUpdate(event) {
  const tabName = event.tabName
  const condition = event.condition
  const params = event.params
  const collection = db.collection(tabName)
  const promise = new Promise((resolve, reject) => {
    collection.where(condition).update({
      data: params
    }).then(res =>{
      resolve(res)
    })
  }).catch(err => {
    throw new Error('根据条件更新数据信息异常')
  })
  return promise
}

async function dbdelete(event){
  const tabName = event.tabName
  const condition = event.condition
  const data = event.data
  const collection = db.collection(tabName)
  var promise = null
  if(condition && condition != null){
    promise = new Promise((resolve, reject) => {
     collection.where(condition).remove().then(res => {
       resolve(res)
     })
   }).catch(err => {
     throw new Error('根据条件更新数据信息异常')
   })
  }else if(data && data.length >0){
    promise = new Promise((resolve, reject) => {
      collection.where({
        _id:_.in(data)
      }).remove().then(res => {
        resolve(res)
      })
    }).catch(err => {
      throw new Error('根据条件更新数据信息异常')
    })
  }
  return promise
}
