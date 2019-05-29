Page({
  data:{
    bgImg:'cloud://suki-749826.7375-suki/bg.jpg'
  },
  toIndex(){
    console.log("success")
    wx.redirectTo({ url: "../index/index" })
  },
})