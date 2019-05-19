import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
var app = getApp();
Page({
    data:{
        myJoined:[],
        mySetted:[]
    },
    onReady:async function () {
      let res =await wx.cloud.callFunction({
          name:"mine",
          data:{
              method:"getMyAppoint",
              openid:app.data.openid
          }
      })
      console.log(res)
    }
})
