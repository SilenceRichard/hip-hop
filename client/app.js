//app.js
App({
  data: {
    appId: 'wx97862a48d9f616ba',  //全局数据，存储appId和appSecret
    appSecret: '648ffae028e7f847ec2ac82da62aa062',
    env: 'hip-hop-sever-d20da1' //云环境ID
  },
  onLaunch: function () {
    wx.cloud.init({
      env: this.data.env,
      traceUser: true
    }) //初始化云函数
    // 展示本地存储能力

  }
})
