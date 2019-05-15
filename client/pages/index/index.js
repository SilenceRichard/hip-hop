//index.js
//获取应用实例
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖

Page({
    data: {
        info:[{
            cover:'../../static/home.png',
            title:'标题',
            dance_type:'popping',
            type:'cypher',
            limit:'4/10',
            time:'2019-5-11 00:00:00',
            location:'昌平',
            str:'',
        },
            {
                cover:'../../static/home.png',
                title:'标题',
                dance_type:'popping',
                type:'cypher',
                limit:'4/10',
                time:'2019-5-11 00:00:00',
                location:'昌平',
                str:'',
            },
            {
               cover:'../../static/home.png',
                title:'标题',
                dance_type:'popping',
                type:'cypher',
                limit:'4/10',
                time:'2019-5-11 00:00:00',
                location:'昌平',
                str:'',
            },
        ],

        swiperList: [{
            id: 0,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
        }, {
            id: 1,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
        }, {
            id: 2,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
        }, {
            id: 3,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
        }, {
            id: 4,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
        }
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        showWelcome:true, //欢迎动画标志
        flag:true, //淡入淡出动画加载标志
    },



    DotStyle(e) {
        this.setData({
            DotStyle: e.detail.value
        })
    },
    // cardSwiper
    cardSwiper(e) {
        this.setData({
            cardCur: e.detail.current
        })
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
        var that = this;
        wx.cloud.callFunction(
            {
                name:'home',
                data:{
                    method:'getNewsInfo',//获取点击率最高的五条资讯
                },
                success: function (res) {
                    console.log(res)
                    res.result.checkResult.forEach(item => {
                        item.str = '';
                        item.dance_type.forEach(val => {
                            if (val.checked == true) {
                                item.str = item.str + val.name + ',';
                            }
                        })
                    })
                    res.result.checkResult.forEach(item => {
                        item.str = item.str.slice(0, -1)
                    }),

                        // this,that,傻傻分不清楚
                        that.setData({
                            info: res.result.checkResult
                        })
                    console.log(res)
                }

            })
        // 注释这里使用了回调风格的写法
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
