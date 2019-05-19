
Page({
    data: {
        info: {
            cover: '../../static/icon/hulk.png',
            title: 'popping',
            identify: '个人',
            dance_type:"popping",
            type:"cypher",
            time: '2019 5 12',
            limit: '4',
            limit_set: '10',
            content: '我要好好跳舞',
            condition:'你能好好跳舞吗',
            activeDate:'2019 5 12',
            time: '12:00',
            location:'北京邮电高中',
            avatarUrl:'../../static/icon/strange.png',
            name:'我叫王大可',
            id:'',
            nickName: '王大可',
            role: '沙雕',
            sex: '男的一匹',
            city: '北京邮电幼儿园',
            danceType: 'jazz',
            danceAge: '6年',
            introduction: '肉松小贝里有肉松'
        },
        info_:{},
        //info_,
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
    wx.cloud.callFunction({
      name: 'home',
      data: {
        method: "getFounderInfo",
        info: id
      },
      success: function (res) {
        console.log("传回来的是--------", res)
        that.setData({
          info: res.result.checkResult
        })
      }
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
      // console.log("id是-----",this.data.info.id)
        var that = this;
        wx.cloud.callFunction({
            name: 'home',
            data: {
                method: "getAppointInfo",
                info: this.data.info.id
            },
            success: function (res) {
                console.log("传回来的是--------",res)

                //处理舞种信息
                var dance_type_ =[];
                res.result.checkResult[0].dance_type.forEach(function (element) {
                  if (element.checked == true){
                    dance_type_.push(element.name);
                  }
                });
                res.result.checkResult[0].dance_type = dance_type_;

                that.setData({
                    info: res.result.checkResult[0]
                })

                //console.log("下面查询openid：", res.result.checkResult[0].openid);
                //再次调用云函数
                wx.cloud.callFunction({
                  name: 'mine',
                  data: {
                    method: "getUserInfo",
                    openid: res.result.checkResult[0].openid
                  },
                  success: function (e) {
                    console.log("第二次传回来的res--------",e)

                    //处理舞种信息
                    var dance_type_ = [];
                    e.result.res.danceType.forEach(function (element) {
                      if (element.checked == true) {
                        dance_type_.push(element.name);
                      }
                    });
                    e.result.res.danceType = dance_type_;

                    that.setData({
                      info_: e.result.res
                    })
                  }
                })
            }
        })
    }
})