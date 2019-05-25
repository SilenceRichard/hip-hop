//index.js
//获取应用实例
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖

Page({
    data: {
        info: [{
            cover: '../../static/home.png',
            title: '标题',
            dance_type: 'popping',
            type: 'cypher',
            limit: '',
            now: '',
            time: '2019-5-11 00:00:00',
            location: '昌平',
            str: '',
            _id: '123'
        },
            {
                cover: '../../static/home.png',
                title: '标题',
                dance_type: 'popping',
                type: 'cypher',
                limit: '4/10',
                time: '2019-5-11 00:00:00',
                location: '昌平',
                str: '',
            },
            {
                cover: '../../static/home.png',
                title: '标题',
                dance_type: 'popping',
                type: 'cypher',
                limit: '4/10',
                time: '2019-5-11 00:00:00',
                location: '昌平',
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
        showWelcome: true, //欢迎动画标志
        flag: true, //淡入淡出动画加载标志
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

    enterMiniProgram: async function () {
        this.setData({
            flag: false
        })
        await setTimeout(() => {
            wx.pro.showTabBar().then(
                this.setData({
                    showWelcome: false
                }))
        }, 1 * 1000);
    }, //点击进入小程序首页
    goToAll() {
        wx.navigateTo({
            url: '../home-all/home-all',
        })
    },
    goToDetail(ev) {
        console.log("我是index里的ev-----------", ev)
        wx.navigateTo({url: '../home-appointInfo/home-appointInfo?id=' + ev.currentTarget.dataset.item._id})
    },

    onReady: async function () {
        console.log("进入onReady");
        let that = this;
        let res1 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getAdvertise'}});
        console.log("res1------", res1)


        let res2 = await wx.cloud.callFunction({name: 'home', data: {method: 'getInfo', type: 'getNewsInfo'}});
        console.log("res2-----", res2)
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
    }
})
