// pages/applyInfo/applyInfo.js
Page({
  toMineInfo() {
    wx.navigateTo({ url: '../mine-person/mine-person' })
  },
  data: {
    info:{}
  },

  sendApply(){
    wx.cloud.callFunction({
      name:"home",
      data:{
        method:"sendInfo",
        info:this.data.info,
        openid: app.data.openid
      },
      success(res){
        console.log(res)
      }
    })
  },
  changeInfo(){
    this.setData({
      info: apply
    })
  }
})
