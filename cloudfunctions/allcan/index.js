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
    let frultCollection=null
    let orderlistCollection = null
    let _openid = event.userInfo.openId
    switch (behindType){
      case 'search':
        let { kw } = event
        frultCollection = db.collection('frult')
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
        frultCollection = db.collection('frult')
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
      //创建订单
      case 'createorder':
        let {totalprice,orderlist,note} = event
        orderlistCollection = db.collection('orderlist')
        let addtime = new Date();
        let orderres = await orderlistCollection.add({
          data:{
            totalprice,
            orderlist,
            note,
            _openid,
            type:'now',
            addtime
          }
        })
        let createObj = !!orderres._id ? { msg: '生成订单成功', success: true } : { msg: '生成订单失败', success: false};
        return createObj
      break;
      //获取最新订单并且是没有完成的
      case 'getneworder':
        orderlistCollection = db.collection('orderlist')
        let gnoRes = await orderlistCollection.orderBy('addtime','desc').where({
          _openid: _openid,
          type:'now'
        }).limit(1).get()
        return gnoRes
      break;
      //获取指定订单
      case 'orderdetail':
        orderlistCollection = db.collection('orderlist')
        let odOrderid = event.orderid
        let odRes = await orderlistCollection.where({
          _openid: _openid,
          _id: odOrderid
        }).get()
        return odRes
      break;
      case 'finishorder':
        orderlistCollection = db.collection('orderlist')
        let { orderid } = event;
        const foRes = await orderlistCollection.where({
          _id: orderid
        }).update({
          data:{
            type:'history'
          }
        })
        return foRes
      break;
      case 'gethistory':
        orderlistCollection = db.collection('orderlist')
        let gh_pageIndex = event.pageIndex
        let gh_limitCount = 10
        const gh_res = await orderlistCollection.where({ _openid}).count()
        let gh_total = gh_res.total
        let gh_pageCount = Math.ceil(gh_total / gh_limitCount)
        let ghorders = null
        let gh_skipnumber = gh_pageIndex * gh_limitCount
        if (gh_total > 0) {
          ghorders = await orderlistCollection.orderBy('addtime', 'desc').where({
            _openid
          }).skip(gh_skipnumber).limit(gh_limitCount).get()
          ghorders.data.forEach(item=>{
            item.totalcount = item.orderlist.length;
            delete item.orderlist;
            delete item.note;
            delete item._openid;
            let date = new Date(item.addtime);
            item.addtime=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          })
        }
        return {
          gh_total,
          gh_pageCount,
          ghorders
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