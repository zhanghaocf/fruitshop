// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const playerCollection = db.collection('player')
    const wxContext = cloud.getWXContext()
    const { nickname, phone, userInfo}=event
    const openid = userInfo.openId
    const { total } = await playerCollection.where({
      _openid: openid
    }).count()
    if(total===0){
      //新增数据
      const data={
        nickname,
        phone,
        _openid:openid
      }
      return await playerCollection.add({ data: data }).then(res => {
        if (res._id) {
          return {
            msg: "新增成功",
            success:true,
            id: res._id
          }
        }
      }).catch(err=>console.log('失败'))
    }else{
      //更新数据
      const { stats } = await playerCollection.where({
        _openid: openid
      }).update({
        data:{
          phone
        }
      });
      const obj = stats.updated>0?{
        msg: "修改成功",
        success: true
      } : {
        msg: "修改失败",
          success: false}
      return obj
    }
  }catch(e){
    console.error(e)
  }
}