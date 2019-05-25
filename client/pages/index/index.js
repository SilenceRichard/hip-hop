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
            _id:'123'
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
            url: 'cloud://suki-749826.7375-suki/xw.jpg',
        }, {
            id: 1,
            type: 'image',
            url: 'cloud://suki-749826.7375-suki/xt.jpg',
        }, {
            id: 2,
            type: 'image',
            url: 'cloud://suki-749826.7375-suki/xh.jpg'
        }, {
            id: 3,
            type: 'image',
            url: 'cloud://suki-749826.7375-suki/dake.jpg'
        }, {
            id: 4,
            type: 'image',
            url: 'cloud://suki-749826.7375-suki/bage.jpg'
        }
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        showWelcome:true, //欢迎动画标志
        flag:true, //淡入淡出动画加载标志
    },
    loadingFlag: false,


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
    goToDetail(ev){
        console.log("我是index里的ev-----------",ev)
        wx.navigateTo({ url: '../home-appointInfo/home-appointInfo?id='+ev.currentTarget.dataset.item._id })
    },

    onReady: async function () {
        console.log("进入onReady");
        let that =this;

        // console.log("result1.result.checkResult[0].image:", result1.result.checkResult[0].image);
        //console.log("this.data.swiperList[0].url:", this.data.swiperList[0].url);
        // that.setData({
        //    'swiperList[0].url': result1.result.checkResult[0].image,
        //    'swiperList[1].url': result1.result.checkResult[1].image,
        //    'swiperList[2].url': result1.result.checkResult[2].image,
        //    'swiperList[3].url': result1.result.checkResult[3].image,
        //    'swiperList[4].url': result1.result.checkResult[4].image,
        // });


        
        this.setData({
            loadingFlag: true
        })
        let result1 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getAdvertise' } });
        let result2 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getNewsInfo' } });
        console.log("result2:----", result2);

        success:  {
            this.setData({ info: result2.result.checkResult })
            this.setData({ loadingFlag:false})
        }
    },
  onPullDownRefresh: async function() {
    var that = this;
    console.log("下拉刷新----")
    let result1 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getAdvertise' } });
    let result2 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getNewsInfo' } });
      success: {
        console.log("下拉刷新成功了", )
        this.setData({ 
          info: result1.result.checkResult,
          info: result2.result.checkResult 
          })
          wx.stopPullDownRefresh()
      }

  }

})
