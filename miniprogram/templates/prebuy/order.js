const app=getApp();
const temp={
  finishTab(){
    app.showToast('恭喜你已成功完成订单',()=>{
      this.setData({
        type:'history'
      })
    })
  }
}
export default temp;