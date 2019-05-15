//index.js
//获取应用实例
const app = getApp();
Page({
    toAppointInfo() {
      wx.navigateTo({ url: '../home-appointInfo/appointInfo' })
    },
    data: {
      info: [{
        imgsrc: '../../static/icon/ironman.png',
        title: '标题',
        innerText1: '你已经加入了钢铁侠的约局',
        innerText2: '钢铁侠同意了你的报名申请',
        time: '2019-5-11 00:00:00',
        location: '昌平'
      },
        {
          imgsrc: '../../static/icon/cap.png',
          title: '标题',
          innerText1: '美国队长想要加入你的约局',
          innerText2: '哇！美国队长对你的约局感兴趣',
          time: '2019-5-11 00:00:00',
          location: '昌平'
        },
        {
          imgsrc: '../../static/icon/blackpathen.png',
          title: '标题',
          innerText1: '复仇者联盟已经组队成功',
          innerText2: '恭喜！您的约局复仇者联盟已经组队成功',
          time: '2019-5-11 00:00:00',
          location: '昌平'
        },
      ],
      
    },

    onReady: function() {
      var that = this; 
      wx.cloud.callFunction({
        name: 'mine',
        data: {
          methed: "getSystemInfo",//获取系统通知
          openid: app.data.openid,
        },
        success: function(res) {
          //后台规定参数返回形式
          //return{
          //checkResult: [{},{},{}]
          // }
          that.setData({
            info: res.result.checkResult
          })
        }
      })
    }
  }
)