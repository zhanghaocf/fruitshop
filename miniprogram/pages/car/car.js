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
    totalprice:0,
    list:[],
    note:'',
    createorderlist:[],//生成订单的数据
    singleBol:true//防止连点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  allselect(){
    let list = this.data.list;
    let allOn=!this.data.allOn;
    let selectedcount = this.data.selectedcount;//用来统计选中的有几个
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
    let ths=this;
    let wayobj={
      'all':function(){
        ths.data.createorderlist = [];
        totalprice = allBol ? list.reduce((sum,item)=>{
          ths.getcreateorderdata(true, item)
          return sum+=item.money*item.count;
        }, 0):0;
      },
      'one':function(){
        totalprice = obj.on ? totalprice + obj.money * obj.count : totalprice - obj.money * obj.count;
        ths.getcreateorderdata(obj.on,obj);
      },
      'opera':function(){
        totalprice = obj.on ?list.reduce((sum, item) => {
          var data = item.on ? item.money * item.count:0;
          return sum += data;
        }, 0) : totalprice;
      },
      'delete':function(){
        totalprice = obj.on ? totalprice - obj.money * obj.count : totalprice;
        ths.getcreateorderdata(false, obj);
      }
    }
    wayobj[type]();
    return totalprice;
  },
  //获取生成订单数据函数
  getcreateorderdata(bol,obj){
    let createorderlist = this.data.createorderlist;
    if(bol){
      createorderlist.push(obj);
    }else{
      let index = createorderlist.indexOf(obj);
      if(index>=0){
        createorderlist.splice(index,1);
      }
    }
    this.data.createorderlist = createorderlist;
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
      selectIndex:-1,
      allOn:false,
      totalprice:0,
      createorderlist:[],
      note:'',
      singleBol:true
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
  // onShareAppMessage: function () {

  // },
  indepen(e) {
    this.setData({
      selectIndex: e.detail.selectIndex
    })
  },
  delopera(e){
    const index=e.detail.index;
    const ths=this;
    const datadel=ths.data;
    const list = datadel.list;
    wx.showModal({
      title: '提示',
      content: '确认要删除该商品吗',
      success(res) {
        if (res.confirm) {
          let selectedcount = datadel.selectedcount;
          let item = list[index];
          if(item.on){
            selectedcount--;
          }
          console.log(selectedcount)
          let total = ths.handleprice('delete', false, item);//处理总结算面板数据
          list.splice(index,1);
          let allOn = list.length === selectedcount;
          ths.delupdatedata(item._id);
          ths.setData({
            list:list,
            totalprice: total,
            selectedcount,
            allOn
          })
        }
      }
    })
  },
  createmenu(){
    if(!app.handleNeedLogin()){
      return false;
    }
    let singleBol = this.data.singleBol;
    
    let note = this.data.note;
    let createorderlist = this.data.createorderlist;
    // console.log(createorderlist)
    if (createorderlist.length===0){
      app.showToast('主人还没有选好商品哦~');
      return;
    }
    if (!singleBol) {
      console.log('只能点一次')
      return;
    }
    this.data.singleBol = false;
    let totalprice = this.data.totalprice;
    let data={
      note,
      orderlist: createorderlist,
      totalprice
    }
    app.commoncallFunction('createorder', data,this)
       .then(res=>{
        //  console.log(res);
         let {result:{msg,success}} = res;
         if(success){
           createorderlist.map((item) => {
             this.delupdatedata(item._id);
           })
         }
         let type=success?'success':'none';
         app.showToast(msg, () => {
           wx.switchTab({
             url: '/pages/info/info',
           })
         }, type)
       }).catch(err=>{
         app.handleError(err,this)
       })
    
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
  },
  //每次删除操作更新storage中的数据
  delupdatedata(_id){
    const data = wx.getStorageSync('shoppcarData') || {};
    delete data[_id];
    wx.setStorageSync('shoppcarData', data);
  },
  //处理textarea值
  handletextarea(e){
    this.data.note = e.detail.value
  }
})