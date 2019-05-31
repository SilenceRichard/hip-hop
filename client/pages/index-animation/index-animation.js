Page({
  data:{
    flag:false
  },
  toIndex(){
    console.log("success")
    this.setData({
      flag:true
    })
    let that = this;
    setTimeout(function () {
      wx.switchTab({ url: "../index/index",
        success(res) {
          that.setData(
              {
                flag:false
              }
          )
        }})
    },2000)
  },
})
