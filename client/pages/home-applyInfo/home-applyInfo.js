const app = getApp();
Page({
  toMineInfo() {
    wx.navigateTo({ url: '../mine-person/mine-person' })
  },
  data: {
    t_length: 0,
    info:{
      id:'',
      status:''
    },
    // id:'',
    showModalFlag:false,
    bgImage: app.globalData.bgSrc
  },
  onLoad(info){
      console.log("传过来-----",info)
      this.setData({
        "info.id":info.id
      })
  },

  sendApply(){
    let that = this;//不能定义在回调里
    console.log("请求参数:",this.data.info);
    console.log("app.data.openid",app.data.openid)
    wx.cloud.callFunction({
      name:"home",
      data:{
        method:"sendInfo",
        info:this.data.info,
        openid: app.data.openid
      },

      success(res){
        console.log(res)
        that.setData({
          showModalFlag: true,
          status : res.result.status
        })
      },
      fail(err){
        console.log("云函数写错啦--",err)
      }
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
    var t_text = e.detail.value.length;
    // console.log(t_text)
    this.setData({
      info: obj,
      t_length: t_text
    })
  }
})