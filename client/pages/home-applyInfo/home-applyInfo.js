
Page({
  toMineInfo() {
    wx.navigateTo({ url: '../mine-person/mine-person' })
  },
  data: {
    t_length: 0,
    info:{},
    id:'',
    showModalFlag:false
  },
  onLoad(info){
      console.log("传过来-----",info)
      this.setData({
        id:info.id
      })
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
  showModal(e) {
    console.log(11111)
    this.setData({
      showModalFlag: true
    })
  },
  hideModal(e) {
    this.setData({
      showModalFlag: false
    })
    wx.navigateBack();
      
  },
  changeInfo(e){
    let obj = this.data.info;
    obj.apply = e.detail.value;
    this.setData({
      info: obj
    })
  },
  bindText: function (e) {
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      t_length: t_text
    })
  }
})