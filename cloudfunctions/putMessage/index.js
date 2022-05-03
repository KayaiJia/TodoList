// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {title,time,remark} = event
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        "touser": 'wxContext.OPENID',
        "templateId" : 'TXI-MQahiffvtlk7OYdAldaCcwG741kv3rZu6huMB_o',
        "lang": 'zh_CN',
        "data": {
          "thing5": {
            "value": title
          },
          "time3": {
            "value": time
          },
          "thing11": {
            "value": remark
          },
        },
      })
    return result
  } catch (err) {
    return err
  }

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}