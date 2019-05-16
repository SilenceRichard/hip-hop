// pages/appointInfo/appointInfo.js
Page({
  toApplyInfo() {
    wx.navigateTo({ url: '../home-applyInfo/home-applyInfo' })
  },
  data: {
    info: {
      imgsrc: '../../static/icon/hulk.png',
      title: '标题',
      innerText1: 'popping',
      innerText2: 'battle',
      time: '2019 5 12',
      limit_now: '4',
      limit: '10',
      activeInfo: '我要好好跳舞',
      joinInfo: '你能好好跳舞吗',
      activeTime: '2019 5 12',
      activeLocation: '北京邮电高中',
      head: '../../static/icon/strange.png',
      name: '我叫王大可',
      id: ''
    }
  },
  onLoad(info) {
    console.log("参数传进来了------", info)
    this.setData({
      id: info.id
    })
  },
  onReady: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'home',
      data: {
        methed: "getAppointInfo",
        info: id
      },
      success: function (res) {
        console.log("传回来的是--------", res)
        that.setData({
          info: res.result.checkResult
        })
      }
    })
  }
})