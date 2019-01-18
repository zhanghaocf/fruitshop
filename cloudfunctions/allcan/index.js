// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const wxContext = cloud.getWXContext()
    const {behindType}=event
    console.log(`类型为${behindType}`)
    const frultCollection = db.collection('frult')
    switch (behindType){
      case 'search':
        let { kw } = event
        console.log(`关键字为${kw}`)
        let res = await frultCollection.where({
          name: db.RegExp({
            regexp: `${kw}`,
            options: 'i'
          })
        }).get()
        return res
      break;
      //获取首页水果列表
      case 'fruit':
        let {pageIndex} = event
        let limitCount=5
        const {total} = await frultCollection.count()
        let pageCount = Math.ceil(total / limitCount)
        let fruitres=null
        let skipnumber = pageIndex * limitCount
        if(total>0){
          fruitres = await frultCollection.orderBy('addtime', 'desc').skip(skipnumber).limit(limitCount).get()
        }
        return {
          total,
          pageCount,
          fruitres
        }
      break;
      default:
        return {
          data:[]
        }
      break;
    }
  }catch(e){
    console.log(e)
  }
}