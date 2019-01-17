const app=getApp();
// pages/car/car.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allOn:false,
    selectIndex:-1,
    skipHeight:272,
    selectedcount:0,//选中的数量默认为0
    totalprice:111111111111111111111111111110,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  allselect(){
    let list = this.data.list;
    let allOn=!this.data.allOn;
    let selectedcount = this.data.selectedcount;
    selectedcount = allOn?list.length:0;
    list.forEach((item)=>{
      item.on = allOn
    });
    let totalprice=this.handleprice('all',allOn,null);
    this.setData({
      allOn: allOn,
      list: list,
      selectedcount: selectedcount,
      totalprice: totalprice
    })
  },
  selectone(e){
    let index=e.currentTarget.dataset.index;
    let list=this.data.list;
    let onbol = !list[index].on;
    let selectedcount = this.data.selectedcount;
    selectedcount = onbol ? selectedcount+1 : selectedcount-1;
    var allBol = selectedcount === list.length;
    list[index].on = onbol;
    let totalprice =this.handleprice('one', false, list[index]);
    this.setData({
      list:list,
      allOn: allBol,
      selectedcount: selectedcount,
      totalprice:totalprice
    })
  },
  operafn(e) {
    const type = e.detail.opreation;
    const index=e.target.dataset.index;
    const list = this.data.list;
    let count = list[index].count;
    switch (type) {
      case 'plus':
        count++;
        break;
      case 'minus':
        count--;
        count=count<=0?1:count;
        break;
      case 'change':
      console.log(22)
        count = e.detail.count;
        break;
      default: break;
    }
    list[index].count=count;
    var totalprice = this.handleprice('opera', false, list[index])
    this.setData({
      list:list,
      totalprice: totalprice
    })
  },
  handleprice(type,allBol,obj){//第一个参数点击的单个还是全选，第二个参数是全选全不选，第三个参数是点击单个传进来的商品对象
    let totalprice = this.data.totalprice;
    let list = this.data.list;
    let wayobj={
      'all':function(){
        totalprice = allBol ? list.reduce((sum,item)=>{
          return sum+=item.money*item.count;
        }, 0):0;
      },
      'one':function(){
        totalprice = obj.on ? totalprice + obj.money * obj.count : totalprice - obj.money * obj.count;
      },
      'opera':function(){
        totalprice = obj.on ?list.reduce((sum, item) => {
          var data = item.on ? item.money * item.count:0;
          return sum += data;
        }, 0) : totalprice;
      }
    }
    wayobj[type]();
    return totalprice;
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
    this.updatecardata()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      selectIndex:-1
    })
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
  onShareAppMessage: function () {

  },
  indepen(e) {
    this.setData({
      selectIndex: e.detail.selectIndex
    })
  },
  delopera(e){
    const index=e.detail.index;
    const ths=this;
    const list=ths.data.list;
    wx.showModal({
      title: '提示',
      content: '确认要删除该商品吗',
      success(res) {
        if (res.confirm) {
          list.splice(index,1);
          ths.setData({
            list:list
          })
        }
      }
    })
  },
  createmenu(){
    if(!app.handleNeedLogin()){
      return false;
    }
    let list=this.data.list;
    console.log(list)
  },
  //处理对象变为数组
  objtoarr(obj){
    let arr=[];
    for(var item in obj){
      arr.push(obj[item]);
    }
    return arr;
  },
  //每次从storage中获取数据更新视图
  updatecardata(){
    const data = wx.getStorageSync('shoppcarData')||{};
    const datalist = !!Object.values ? Object.values(data) : this.objtoarr(data);
    this.setData({
      list: datalist
    })
  }
})