import apiPromise from './utils/apiPromise.js'
//app.js
App({
  onLaunch: function () {
    //当版本更新阻止用户在冷更新时还继续用上个版本的东西
    this.updateTest();
    //检测是否已经授权用户信息
    this.getSetting()
        .then((res)=>{
          if (res['scope.userInfo']){
            return this.getUserInfo();
          }else{
             throw new Error('没有授权');
          }
        })
        .then(res=>{
            console.log(res);
            this.globalData.userInfo = res.userInfo;
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          })
        .catch(err=>console.log(err));
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo:null
    }
    
  },
  //检测是否已经授权用户信息
  getSetting(){
    return apiPromise.getSetting();
  },
  //获取用户信息(不带秘钥的那种)
  getUserInfo(){
    return apiPromise.getUserInfo();
  },
  showToast(message,callback){
    callback = !callback?()=>{}:callback;
    message=typeof message==='string'?message:JSON.stringify(message);
    wx.showToast({
      title: message,
      icon:'none',
      success(){
        callback();
      }
    })
  },
  //发布新版本时检测用户页面是否需要重启
  updateTest: function () {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    });
    updateManager.onUpdateFailed(()=>{
      this.showToast('新版本下载失败,请重新获取该小程序')
    })
  },
  //处理fail的统一方法
  handleError(message, page) {
    page.setData({
      isLoading: false
    });
    this.showToast(message);
  },
})
