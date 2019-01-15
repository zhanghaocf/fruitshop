// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {behindType}=event
  const obj={
    //首页模糊查询
    'search':function(){
      const frultCollection = db.collection('frult')
      let {kw} = event;
      const res = await frultCollection.where({
      })
    }
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}