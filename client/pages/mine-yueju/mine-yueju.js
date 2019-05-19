import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
var app = getApp();
Page({
    data:{
        myJoined:[],
        mySetted:[]
    },
    onReady:async function () {
        console.log("请求参数:",{
            method:"getMyAppoint",
            openid:app.data.openid
        })
      let res =await wx.cloud.callFunction({
          name:"mine",
          data:{
              method:"getMyAppoint",
              openid:app.data.openid
          }
      })
      res.result.joinedDance.map(item =>{
           let a =[]; //处理舞种
          item.dance_type.map(val=>{
             if (val.checked){
                 a.push(val.name)
             }
          })
          item.dance_type_show = a;
          return item
      })
      this.setData({
          myJoined:res.result.joinedDance
      })
    }
})
