Page({
    data:{
      userInfo:{}, //用户信息
      sign:'暂无签名TAT'
    },
    toMineInfo(){
        wx.navigateTo({url:'../mine-person/mine-person'})
    },
    onLoad: function () {
      var that = this;
      wx.getUserInfo({
        success: function(res) {
           console.log(res)
           that.setData({
              userInfo:res.userInfo
           })
          console.log('获取到个人信息！：',that.data.userInfo)
        }
      })

    } //页面加载时触发
})
