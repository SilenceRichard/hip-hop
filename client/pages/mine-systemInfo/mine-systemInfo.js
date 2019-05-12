//index.js
//获取应用实例
Page({
    toAppointInfo() {
      wx.navigateTo({ url: '../appointInfo/appointInfo' })
    },
    data: {
      info: [{
        imgsrc: '../../static/home.png',
        title: '标题',
        innerText1: 'popping',
        innerText2: 'cypher',
        limit_now: '4',
        limit: '10',
        time: '2019-5-11 00:00:00',
        location: '昌平'
      },
        {
          imgsrc: '../../static/home.png',
          title: '标题',
          innerText1: 'popping',
          innerText2: 'cypher',
          limit_now: '4',
          limit: '10',
          time: '2019-5-11 00:00:00',
          location: '昌平'
        },
        {
          imgsrc: '../../static/home.png',
          title: '标题',
          innerText1: 'popping',
          innerText2: 'cypher',
          limit_now: '4',
          limit: '10',
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
          methed: "getSystemInfo"//获取系统通知
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