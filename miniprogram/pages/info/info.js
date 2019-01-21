const app=getApp();
// pages/info/info.js
import ordertemp from '../../templates/prebuy/order.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,
    title:'',
    orderlist:[],
    totalprice:0,
    note:'',
    type:'now',
    orderid:0
  },
  finishTab(e){
    if (!app.handleNeedLogin()) {
      return false;
    }
    ordertemp.finishTab.call(this,e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //获取最新订单且没完成的数据
  getNewOrder(){
     app.commoncallFunction('getneworder',null,this)
        .then(res=>{
          const {result:{data}} = res;
          if(data.length===0){
            this.setData({
              orderlist:[],
              isLoading: false
            })
            return;
          }
          console.log(data);
          const { orderlist, addtime, note, totalprice, _id, type } = data[0];
          const date = new Date(addtime);
          const title=`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}的预购单`;
          this.setData({
            orderlist,
            isLoading:false,
            note,
            totalprice,
            title,
            orderid:_id,
            type
          })
        }).catch(err=>{
          app.handleError(err,this)
        })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNewOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})