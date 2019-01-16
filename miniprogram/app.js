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
      userInfo:null,
      singleclick:false
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
  showToast(message,callback,type){
    callback = !callback?()=>{}:callback;
    type=!type?'none':type;
    message=typeof message==='string'?message:JSON.stringify(message);
    wx.showToast({
      title: message,
      icon: type,
      success(){
        setTimeout(callback,1000);
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
    message=typeof message==='string'?message:'数据出错';
    page.setData({
      isLoading: false
    });
    this.showToast(message);
  },
  //判断是否需要去登录
  handleNeedLogin(){
    if (!this.globalData.userInfo && !this.globalData.singleclick){
      this.globalData.singleclick=true;
      this.showToast('请先去登录',()=>{
        wx.switchTab({
          url: '/pages/me/me',
        });
        this.globalData.singleclick=false;
      })
      return false;
    } else if (!this.globalData.userInfo && this.globalData.singleclick){
      return false;
    }
    return true;
  },
  //统一与后端交互的接口
  commoncallFunction(behindType,data,page=null){
    if(!!page){
      page.setData({
        isLoading: true
      });
    }
    return wx.cloud.callFunction({
        name:'allcan',
        data:{
          behindType,
          ...data
        }
    })
  }
})
