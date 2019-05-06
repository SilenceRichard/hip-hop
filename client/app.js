//app.js
import util from './utils/util'
import './utils/wxPromise.min.js'
import regeneratorRuntime from './utils/wxPromise.min.js' //引入async await语法糖
App({
  globalData: {
    appId: 'wx97862a48d9f616ba',  //全局数据，存储appId和appSecret
    appSecret: '648ffae028e7f847ec2ac82da62aa062',
    env: 'hip-hop-sever-d20da1' //云环境ID
  },
  data:{
    openid:'' //当前用户的openid
  },
  onLaunch: async function () {
    var that = this
   await wx.cloud.init({
      env: that.globalData.env,
      traceUser: true
    }) //初始化云函数
   await wx.hideTabBar();
   let res = await wx.pro.login();
   let res2 = await util.get('https://api.weixin.qq.com/sns/jscode2session',
       {appid:that.globalData.appId,
           secret:that.globalData.appSecret,
           js_code:res.code,
           grant_type:'authorization_code'
       });
      console.log("获取到用户的openid：",res2.data.openid);
      // console.log(that)
      //在app.js处无setData方法,因为app.js不关心视图层的数据，所以直接赋值即可
      // that.setData({
      //   openid:res.data.openid
      // })
      that.data.openid = res2.data.openid;
      // util.hideTabBar()
      //     .then(
      //         util.login().then(res=>{
      //           util.get('https://api.weixin.qq.com/sns/jscode2session',
      //               {appid:that.globalData.appId,
      //                 secret:that.globalData.appSecret,
      //                 js_code:res.code,
      //                 grant_type:'authorization_code'
      //               })
      //               .then(res =>{
      //                 console.log("获取到用户的openid：",res.data.openid);
      //                 // console.log(that)
      //                 //在app.js处无setData方法,因为app.js不关心视图层的数据，所以直接赋值即可
      //                 // that.setData({
      //                 //   openid:res.data.openid
      //                 // })
      //                 that.data.openid = res.data.openid;
      //               })
      //         }) // 在当前同步流程结束后，下一个时间片执行
      //     )

  }
})
