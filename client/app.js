//app.js
import util from './utils/util'
import './utils/wxPromise.min.js'
import regeneratorRuntime from './utils/wxPromise.min.js' //引入async await语法糖
App({
  globalData: {
    appId: 'wx9e8ef0042efc3a09',  //全局数据，存储appId和appSecret
    appSecret: '89ec0dddb75a4e9d347b0a94408b9efb',
    env: 'suki-749826', //云环境ID
    bgSrc: 'cloud://suki-749826.7375-suki/bg1.jpg' //背景图云路径
  },
  data:{
    openid:'' ,//当前用户的openid
    location:''
  },
  onLaunch: async function () {
    var that = this
   await wx.cloud.init({
      env: that.globalData.env,
      traceUser: true
    }) //初始化云函数
  //  await wx.hideTabBar();
   let res = await wx.cloud.callFunction({
       name:"login"
   })
      console.log("获取到用户的openid：",res.result.openid);

   // let res = await wx.pro.login();
   // let res2 = await util.get('https://api.weixin.qq.com/sns/jscode2session',
   //     {appid:that.globalData.appId,
   //         secret:that.globalData.appSecret,
   //         js_code:res.code,
   //         grant_type:'authorization_code'
   //     });
   //    console.log("获取到用户的openid：",res2.data.openid);
      // console.log(that)
      //在app.js处无setData方法,因为app.js不关心视图层的数据，所以直接赋值即可
      // that.setData({
      //   openid:res.data.openid
      // })
      that.data.openid = res.result.openid;

         wx.getSetting({
             success(res){
                 if (!res.authSetting['scope.userLocation']) {
                     wx.authorize({
                         scope: 'scope.userLocation',
                         success() {
                             // 用户已经同意小程序获取位置，后续调用 wx.getLocation 接口不会弹窗询问
                             wx.getLocation({
                                 success(res1){
                                     // console.log("这是res1--------",res1)
                                     // location = res1.data.location;
                                     that.data.location = res1
                                     console.log("这是res1--------",res1)
                                     console.log("本地的数据是-----",that.data.location)
                                 }
                             })
                         }
                     })
                 }
             }
         })




      // that.data.location = res.result
  }
})
