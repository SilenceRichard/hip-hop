//index.js
//获取应用实例
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖

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
    showWelcome:true, //欢迎动画标志
    flag:true, //淡入淡出动画加载标志
  },
  enterMiniProgram:async function(){
   this.setData({
     flag:false
   })
   await setTimeout(()=>{
     wx.pro.showTabBar().then(
         this.setData({
       showWelcome:false
     }))
   },1*1000);
  }, //点击进入小程序首页
  goToAll(){
      wx.navigateTo({
        url: '../home-all/home-all',
      })
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
    // 演示 wxPromise 的能力
  }
})
