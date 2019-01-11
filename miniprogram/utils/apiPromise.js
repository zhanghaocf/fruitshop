import Promise from './es6_promise.js'
function checkSession(){
  return new Promise((res,rej)=>{
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        res("未过期");
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        rej("已过期");
      }
    })
  })
}
function getStorage(key){
  return new Promise((res,rej)=>{
    wx.getStorage({
      key:key,
      success(result) {
        res(result);
      },
      fail(err){
        rej(err);
      }
    })
  })
}
function setStorage(key,value){
  return new Promise((res,rej)=>{
    wx.setStorage({
      key: key,
      data: value,
      success(result){
        res(result);
      },
      fail(err){
        rej(err);
      }
    })
  })
}
function login(){
  return new Promise((res,rej)=>{
    wx.login({
      success(result){
        res(result);
      },
      fail(err){
        rej(err);
      }
    })
  })
}
function getSetting(){
  return new Promise((res,rej)=>{
    wx.getSetting({
      success(result) {
        res(result.authSetting);
      },
      fail(err) {
        rej(err);
      }
    })
  })
}
function getUserInfo(){
  return new Promise((res, rej) => {
    wx.getUserInfo({
      success(result) {
        res(result);
      },
      fail(err) {
        rej(err);
      }
    })
  })
}
module.exports = {
  checkSession: checkSession,
  getStorage: getStorage,
  setStorage: setStorage,
  login: login,
  getSetting: getSetting,
  getUserInfo: getUserInfo
}