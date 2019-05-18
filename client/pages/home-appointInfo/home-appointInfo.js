
Page({
    data: {
        info: {
            imgsrc: '../../static/icon/hulk.png',
            title: '标题',
            innerText1: 'popping',
            innerText2: '个人',
            innerText12:"popping",
            innerText13:"cypher",
            time: '2019 5 12',
            limit_now: '4',
            limit: '10',
            activeInfo: '我要好好跳舞',
            joinInfo:'你能好好跳舞吗',
            activeTime:'2019 5 12',
            activeLocation:'北京邮电高中',
            head:'../../static/icon/strange.png',
            name:'我叫王大可',
            id:''
        }
    },

    onLoad(info){
        console.log("参数传进来了------",info)
        this.setData({
          "info.id":info.id
        })
      //  已解决 console.log("data.info------",this.data.info)
    },

    toApplyInfo(){
      let obj = this.data.info.id;
      wx.navigateTo({ url: '../home-applyInfo/home-applyInfo?id='+obj})
    },

    onReady: function () {
        var that = this;
        wx.cloud.callFunction({
            name: 'home',
            data: {
                methed: "getAppointInfo",
                info:id
            },
            success: function (res) {
                console.log("传回来的是--------",res)
                that.setData({
                    info: res.result.checkResult
                })
            }
        })
    }
})
