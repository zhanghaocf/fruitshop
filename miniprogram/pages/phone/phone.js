const app=getApp();
// pages/phone/phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    isModify:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setphone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  surefn(){
    const obj=this.data;
    const phone = obj.phone;
    const isModify = obj.isModify;
    if(isModify){
      //编辑
      this.setData({
        isModify:false
      })
    }else{
      //确定
      const msg = this.phonereg(phone);//验证手机号
      if(!msg){
        //优秀没毛病
        this.setData({
          isModify: true
        })
        return;
      }
      app.showToast(msg);
    }
  },
  //验证手机号可用性
  phonereg(phone){
    const reg=/^\d{11}$/;
    if(!reg.test(phone)){
      return '请输入正确的手机号码'
    }
    return '';
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