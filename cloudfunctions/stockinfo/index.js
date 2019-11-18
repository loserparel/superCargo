// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
var rp = require('request-promise')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var res = rp('http://www.mxnzp.com/api/barcode/goods/details?barcode=' + event.isbn).catch(err => {
    console.log(err)
  })
  return res;
}