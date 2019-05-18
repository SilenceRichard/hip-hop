
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
            activeDate:'2019 5 12',
            activeTime: '12:00',
            activeLocation:'北京邮电高中',
            head:'../../static/icon/strange.png',
            name:'我叫王大可',
            id:'',
            nickName: '王大可',
            indentity: '沙雕',
            sex: '男的一匹',
            location: '北京邮电幼儿园',
            danceType: 'jazz',
            danceAge: '6年',
            sigh: '肉松小贝里有肉松'
        },
        showModalFlag:false
    },

    onLoad(info){
        console.log("参数传进来了------",info)
        this.setData({
          "info.id":info.id
        })
      //  已解决 console.log("data.info------",this.data.info)
    },
    toApplyInfo() {
    let obj = this.data.info.id;
    wx.navigateTo({ url: '../home-applyInfo/home-applyInfo?id=' + obj })
  },

  
  showModal(e) {
    console.log(11111)
    this.setData({
      showModalFlag:true
    })
  },
  hideModal(e) {
    this.setData({
      showModalFlag:false
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items
    })
  },

   
    onReady: function () {
        var that = this;
        wx.cloud.callFunction({
            name: 'home',
            data: {
                method: "getAppointInfo",
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
