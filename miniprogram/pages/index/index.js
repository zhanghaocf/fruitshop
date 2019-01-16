const app = getApp();
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,
    searchVal:'',
    oldSearchVal:'',
    fruitList:[
      {
        _id:1,
        pic:'/images/yingtao.jpg',
        name:'樱桃',
        money:100
      },
      {
        _id: 2,
        pic: '/images/watermelon.jpg',
        name: '西瓜',
        money: 100
      },
      {
        _id: 1,
        pic: '/images/yingtao.jpg',
        name: '樱桃',
        money: 100
      },
      {
        _id: 2,
        pic: '/images/watermelon.jpg',
        name: '西瓜',
        money: 100
      },
      {
        _id: 1,
        pic: '/images/yingtao.jpg',
        name: '樱桃',
        money: 100
      },
      {
        _id: 2,
        pic: '/images/watermelon.jpg',
        name: '西瓜',
        money: 100
      }
    ],
    searchfruitList:[],
    scrollViewHeight:0,
    loadType: 'Loading0',
    isFinish: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else{
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    }
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      scrollViewHeight: sysInfo.windowHeight//全屏高度
    })
  },
  getData(){
    console.log(1);
    this.setData({
      isLoading:true
    })
  },
  searchFn(e){
    let val = e.detail.value;
    val = !!val ? val : this.data.searchVal;
    let oldSearchVal = this.data.oldSearchVal;
    if (val === oldSearchVal){
      return;
    }
    const data={
      kw:val
    }
    //模糊查询
    app.commoncallFunction('search', data,this)
      .then(res=>{
        console.log(res);
        if(res.result.data.length===0){
          this.setData({
            isLoading:false,
            oldSearchVal: val
          },()=>{
            app.showToast('主人要的东西没有了!!');
          })
          return;
        }
        this.setData({
          isLoading:false,
          searchfruitList: res.result.data,
          oldSearchVal:val
        })
      })
      .catch((e) => app.handleError(e,this))
  },
  handleipt(e){
    const val = e.detail.value;
    this.data.searchVal = val;
    if(!val){
      this.setData({
        searchfruitList:[]
      })
    }
  },
  enterCar(e){
    if(!app.handleNeedLogin())return;
    console.log(e);
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
  onShareAppMessage: function () {

  }
})