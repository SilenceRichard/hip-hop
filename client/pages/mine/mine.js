Page({
    data:{
      userInfo:{}, //用户信息
      sign:'暂无签名TAT'
    },
    onLoad: function () {
      var that = this;
      wx.getUserInfo({
        success: function(res) {
           that.setData({
              userInfo:res.userInfo
           })
          console.log('获取到个人信息！：',that.data.userInfo)
        }
      })

    } //页面加载时触发
})
