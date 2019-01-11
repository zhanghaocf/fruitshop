import ordertemp from '../../../templates/prebuy/order.js'
// pages/history/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '2019-01-02的预购单',
    orderlist: [
      {
        id: 1,
        pic: '/images/yingtao.jpg',
        name: '樱桃',
        money: 100,
        count: 5
      },
      {
        id: 2,
        pic: '/images/watermelon.jpg',
        name: '西瓜',
        money: 250,
        count: 2
      }
    ],
    totalprice: 1000,
    note: '我的电话180******43、住址为**省**县，请邮递过来谢谢',
    type: 'now'
  },
  finishTab() {
    ordertemp.finishTab.call(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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