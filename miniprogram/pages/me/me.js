const app=getApp();
// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    hasUserLogin:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = app.globalData.userInfo;
    if (userInfo){
      this.setData({
        userInfo: userInfo,
        hasUserLogin: true
      })
    }
    else if (!this.data.canIUse){
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserLogin: true
          })
        }
      })
    }
  },
  getUserInfo(e){
    if (!e.detail.userInfo) {
      return;
    }
    const {userInfo}=e.detail;
    app.globalData.userInfo=userInfo;
    this.setData({
      userInfo: userInfo,
      hasUserLogin:true
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

  },
  handlenouser(){
    let hasUserLogin = this.data.hasUserLogin;
    if (!hasUserLogin){
      app.showToast('请登录后再进行后续操作');
    }
    return hasUserLogin;
  },
  enterOpera(e){
    if (!this.handlenouser()){
      return;
    }
    var type=e.currentTarget.dataset.type;
    var obj={
      'history':function(){
        this.commonLink('/pages/history/list/list');
      },
      'shop':function(){
        app.showToast('暂未开放，主人敬请期待')
      },
      'phone':function(){
        this.commonLink('/pages/phone/phone');
      },
      'concat':function(){
        wx.makePhoneCall({
          phoneNumber: '18068010843'
        })
      },
      'commonLink':function(url){
          wx.navigateTo({
            url: url,
          })
      }
    }
    obj[type]();
  }
})