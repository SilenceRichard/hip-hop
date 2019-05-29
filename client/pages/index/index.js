//index.js
//获取应用实例
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp()
Page({
    data: {
        info: [{
            cover: '',
            title: '',
            dance_type: '',
            type: '',
            limit: '',
            now: '',
            time: '',
            location: '',
            str: '',
            _id: ''
        },
            {
                cover: '',
                title: '',
                dance_type: '',
                type: '',
                limit: '',
                time: '',
                location: '',
                str: '',
            },
            {
                cover: '',
                title: '',
                dance_type: '',
                type: '',
                limit: '',
                time: '',
                location: '',
                str: '',
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
        // showWelcome: true, //欢迎动画标志
        // flag: true, //淡入淡出动画加载标志
        page: 1, //当前页码
        timer:null, //防抖定时器
        bgImage:'' //背景图片路径
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
    // enterMiniProgram: async function () {
    //     this.setData({
    //         flag: false
    //     })
    //     await setTimeout(() => {
    //         wx.pro.showTabBar().then(
    //             this.setData({
    //                 showWelcome: false
    //             }))
    //     }, 1 * 1000);
    // }, //点击进入小程序首页
    goToAll() {
        wx.navigateTo({
            url: '../home-all/home-all',
        })
    },
    goToDetail(ev) {
        console.log("我是index里的ev-----------", ev)
        wx.navigateTo({url: '../home-appointInfo/home-appointInfo?id=' + ev.currentTarget.dataset.item._id})
    },
    async scrollTopRefresh(){
        if (this.data.page-1!=0){
            this.setData({
                page:this.data.page-1
            })
            let res2 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getNewsInfo',page:this.data.page}});
           console.log("res2----", res2)
            //处理人数限制
            res2.result.checkResult = res2.result.checkResult.map((item) => {
                let arr = item.applicant.filter((val) => {
                    if (val.state == 0)
                        return val
                })
                console.log("res2----",res2)
                item.now = arr.length
                return item
            })
            //处理舞种信息
            res2.result.checkResult.forEach(item => {
                item.str = ''
                item.dance_type.forEach(val => {
                    if (val.checked == true) {
                        item.str = item.str + val.name + ',';
                    }
                })
            })
            res2.result.checkResult.forEach(item => {
                item.str = item.str.slice(0, -1)
            })
            this.setData({
                info: res2.result.checkResult
            })
        }else {
            console.log(`再往上没有了！`)
        }
    }, //滚动盒子上拉加载
    // async scrollBottomRefresh(){
    //     let that = this;
    //    // clearTimeout(this.data.timer);//清除页面定时器
    //         let res2 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getNewsInfo',page:that.data.page+1}});
    //         console.log(`查询结果${res2.result.checkResult}`)
    //         if (res2.result.checkResult!=0){
    //             //处理人数限制
    //             res2.result.checkResult = res2.result.checkResult.map((item) => {
    //                 let arr = item.applicant.filter((val) => {
    //                     if (val.state == 0)
    //                         return val
    //                 })
    //                 item.now = arr.length
    //                 return item
    //             })
    //             //处理舞种信息
    //             res2.result.checkResult.forEach(item => {
    //                 item.str = ''
    //                 item.dance_type.forEach(val => {
    //                     if (val.checked == true) {
    //                         item.str = item.str + val.name + ',';
    //                     }
    //                 })
    //             })
    //             res2.result.checkResult.forEach(item => {
    //                 item.str = item.str.slice(0, -1)
    //             })
    //             that.setData({        <swiper-item wx:for="{{swiperList}}" wx:key class="{{cardCur==index?'cur':''}}">
    //                 info: res2.result.checkResult,
    //                 page: that.data.page+1
    //             })
    //         }else {
    //             console.log(`没有更多了！`)
    //         }
    // },//滚动盒子下拉加载！ //todo 真机调试时一直触发该事件 换种下拉的方式了。。
  onShow: async function () {
    let that = this;
    this.setData({ bgImage: app.globalData.bgSrc })
    let res1 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getAdvertise' } });
    // console.log("res1------", res1)
    let res2 = await wx.cloud.callFunction({ name: 'home', data: { method: 'getInfo', type: 'getNewsInfo' } });
    // console.log("res2-----", res2)
    //处理人数限制
    res2.result.checkResult = res2.result.checkResult.map((item) => {
      let arr = item.applicant.filter((val) => {
        if (val.state == 0)
          return val
      })
      item.now = arr.length
      return item
    })
    //处理舞种信息
    res2.result.checkResult.forEach(item => {
      item.str = ''
      item.dance_type.forEach(val => {
        if (val.checked == true) {
          item.str = item.str + val.name + ',';
        }
      })
    })
    res2.result.checkResult.forEach(item => {
      item.str = item.str.slice(0, -1)
    })
    that.setData({
      info: res2.result.checkResult
    })
  },
    onReady: async function () {
        let that = this;
        this.setData({bgImage:app.globalData.bgSrc})
        let res1 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getAdvertise'}});
        // console.log("res1------", res1)
        let res2 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getNewsInfo'}});
        // console.log("res2-----", res2)
        //处理人数限制
        res2.result.checkResult = res2.result.checkResult.map((item) => {
            console.log(item.applicant)
            if (item.applicant!=undefined){
                let arr = item.applicant.filter((val) => {
                    if (val.state == 0)
                        return val
                })
                item.now = arr.length
                return item
            }
        })
        //处理舞种信息
        res2.result.checkResult.forEach(item => {
            item.str = ''
            item.dance_type.forEach(val => {
                if (val.checked == true) {
                    item.str = item.str + val.name + ',';
                }
            })
        })
        res2.result.checkResult.forEach(item => {
            item.str = item.str.slice(0, -1)
        })
        that.setData({
            info: res2.result.checkResult
        })
    },
    // onReachBottom:async function() {
    //     // 下拉触底，先判断是否有请求正在进行中
    //     // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    //     let res = await wx.cloud.callFunction({name:'home',data:{method:'getInfo',type:'getNewsInfo',page:2}})
    //     console.log(res)
    // }, //执行上拉加载
    // onPullDownRefresh: async function(){
    //     console.log("进入onReady");
    //     let that = this;
    //     let res1 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getAdvertise'}});
    //     console.log("res1------", res1)
    //
    //
    //     let res2 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getNewsInfo'}});
    //     //停止下拉动画
    //     wx.stopPullDownRefresh();
    //     console.log("res2-----", res2)
    //     //处理人数限制
    //     res2.result.checkResult = res2.result.checkResult.map((item) => {
    //         let arr = item.applicant.filter((val) => {
    //             if (val.state == 0)
    //                 return val
    //         })
    //         item.now = arr.length
    //         return item
    //     })
    //     //处理舞种信息
    //     res2.result.checkResult.forEach(item => {
    //         item.str = ''
    //         item.dance_type.forEach(val => {
    //             if (val.checked == true) {
    //                 item.str = item.str + val.name + ',';
    //             }
    //         })
    //     })
    //     res2.result.checkResult.forEach(item => {
    //         item.str = item.str.slice(0, -1)
    //     })
    //     that.setData({
    //         info: res2.result.checkResult
    //     })
    // } //下拉刷新
})
