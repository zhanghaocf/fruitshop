const app=getApp();
const temp={
  finishTab(e){
    let ths=this;
    wx.showModal({
      title: '提示',
      content: '主人确定本次的预购单已经完成了吗？？',
      success(res) {
        if (res.confirm) {
          temp.handlemenu(ths, e)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  handlemenu(ths,e){
    const dataset = e.target.dataset;
    const orderid = dataset.id;
    const name = dataset.name;
    console.log(name);
    app.commoncallFunction('finishorder', {
      orderid
    }, ths).then(res => {
      const { result: { stats: { updated } } } = res;
      ths.setData({
        isLoading: false
      });
      if (updated > 0) {
        //完成
        if (name==='ohistory'){
          app.globalData.event.emit('okTask', orderid);
        }
        app.showToast('恭喜你已成功完成订单', () => {
          ths.setData({
            type: 'history'
          })
        })
      } else {
        //失败
        app.showToast('主人遇到未知错误啦，快去联系管理员', null)
      }
    }).catch(err => {
      app.handleError(err, ths);
    })
  }
}
export default temp;