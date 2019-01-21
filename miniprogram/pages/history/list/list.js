const app = getApp();
// pages/history/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading:false,
    scrollViewHeight:0,
    loadType:'Loading0',
    isFinish:false,
    pageIndex: 0,
    pageCount: 1,
    historyList:[]
  },
  enderdetail(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/history/detail/detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sysInfo = wx.getSystemInfoSync();
    this.setData({
      scrollViewHeight: sysInfo.windowHeight//全屏高度
    })
    this.getHistory();
    //中央事件（订阅发布监听模式）
    app.globalData.event.on('okTask',this.setType,this);
  },
  getData(){
    this.getHistory();
  },
  getHistory(){
    const pd = this.data;
    let pageIndex = pd.pageIndex;
    let pageCount = pd.pageCount;
    let historyList = pd.historyList;
    if (pageIndex + 1 > pageCount) {
      this.setData({
        isFinish: true
      })
      return;
    }
    app.commoncallFunction('gethistory',{pageIndex},this)
       .then(res=>{
         const {result:{gh_pageCount,ghorders}}=res;
         historyList=historyList.concat(ghorders.data);
         pageIndex++;
         this.setData({
           isLoading:false,
           historyList,
           pageCount: gh_pageCount,
           pageIndex
         })
       }).catch(err=>{
         app.handleError(err,this);
       })
  },
  setType(id){
    const historyList = this.data.historyList;
    historyList.forEach(item=>{
      let type = item.type;
      item.type=item._id === id ? 'history' : type;
    })
    this.setData({
      historyList: historyList
    })
    console.log('处理了');
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
    app.globalData.event.off('okTask', this.setType);
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