//index.js
//获取应用实例
import util from '../../utils/util'
Page({
  data: {
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showWelcome:true //欢迎动画标志
  },
  onReady: function () {
    //注释这里使用了回调风格的写法
    // wx.hideTabBar({
    //   complete(res) {
    //     setTimeout(function () {
    //       that.setData({
    //         showWelcome:false
    //       })
    //       wx.showTabBar({
    //         complete(res) {
    //         }
    //       }) //显示底部导航
    //     },2*1000)
    //   }
    // })
    //以下是Promise风格的代码
    setTimeout(()=> {
      this.setData({
        showWelcome:false
      })
      util.showTabBar() //显示app.js中隐藏的底部导航栏
    },2*1000)

  }
})
