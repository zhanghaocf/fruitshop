const app=getApp();
// pages/phone/phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    oldPhone:'',//用来判断是否需要与后端交互如果修改和原始内容一样的话不需要交互
    isModify:false,
    isLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取手机号码
    this.getPhone().then(res=>{
      console.log(res);
      const {result:{res:{data}}}=res;
      console.log(data);
      const setDataObj={
        isLoading: false
      }
      if(data.length>0){
        let phone = data[0].phone;
        setDataObj.phone = phone;
        setDataObj.isModify=true;
        setDataObj.oldPhone = phone;
      }
      this.setData(setDataObj)
    })
  },
  setphone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  surefn(){
    const obj=this.data;
    const phone = obj.phone;
    const oldPhone=obj.oldPhone;
    const isModify = obj.isModify;
    if(isModify){
      //编辑
      this.setData({
        isModify:false
      })
    }else{
      //如果没有修改就不做后端交互
      if(phone===oldPhone){
        console.log('没有变化');
        this.setData({
          isModify: true
        })
        return;
      }
      //确定
      const msg = this.phonereg(phone);//验证手机号
      if(!msg){
        //优秀没毛病
        this.addmondify({ phone, nickname: app.globalData.userInfo.nickName})
            .then(res=>{
              let resu=res.result;
              let msg = resu.msg;
              let type = resu.success?'success':'none';
              this.setData({
                isLoading:false
              })
              app.showToast(msg,()=>{
                if (type === 'success') {
                  this.setData({
                    isModify:true
                  })
                }
              },type);
            })
            .catch(err=>console.log(err));
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
  //新增或修改手机号码https
  addmondify(data){
    this.setData({
      isLoading:true
    })
    return wx.cloud.callFunction({
      name: 'handlePlayer',
      // 传递给云函数的event参数
      data: data
    })
  },
  //初始化去后端拿值
  getPhone(){
    this.setData({
      isLoading:true
    })
    return wx.cloud.callFunction({
      name:'getPhone'
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
  // onShareAppMessage: function () {

  // }
})