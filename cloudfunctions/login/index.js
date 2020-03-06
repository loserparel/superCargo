// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
cloud.init({
})
var rp = require('request-promise')
var crypto = require('crypto');
// 初始化 cloud

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async(event, context) => {
  console.log(event)
  console.log(context)

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  const code = event.code
  let url = "https://api.weixin.qq.com/sns/jscode2session?appid=wxd979691ecc01a6fa&secret=40059242990813b083f33e8a21714273&js_code=" + code +"&grant_type=authorization_code";
  var res = await rp(url)
    .then(function (res) {
      console.log(res)
      return res
    })
    .catch(function (err) {
      console.log('获取sessionkey信息失败')
    });

  return res

}
async function encryptSha1(data) {
    return crypto.createHash('sha1').update(data, 'utf8').digest('hex')
  }

