// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const wxContext = cloud.getWXContext()
    const infoCollection = db.collection('player')
    const {userInfo:{openId}} =event
    const res=await infoCollection.where({
      _openid:openId
    }).field({
      phone:true
    }).get()
    console.log(res)
    return {
      res
    }
  }catch(e){
    console.log(e)
  }
}