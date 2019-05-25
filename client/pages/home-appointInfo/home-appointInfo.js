import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();

Page({
  data: {
    info: {
      cover: '../../static/icon/hulk.png',
      title: 'popping',
      identify: '个人',
      dance_type:"popping",
      type:"cypher",
      date: '2019 5 12',
      now: '',
      limit: '10',
      content: '我要好好跳舞',
      condition:'你能好好跳舞吗',
      activeDate:'2019 5 12',
      time: '12:00',
      location:'北京邮电高中',
      avatarUrl:'../../static/icon/strange.png',
      authorName:'我叫王大可',
      _id:'',
      nickName: '王大可',
      role: '沙雕',
      sex: '男的一匹',
      city: '北京邮电幼儿园',
      danceType: 'jazz',
      danceAge: '6年',
      introduction: '肉松小贝里有肉松',
      _openid:''
    },
    info_:{},
    //info_,
    showModalFlag:false
  },

  onLoad(info){
    // console.log("参数传进来了------",info)已解决
    this.setData({
      "info._id":info.id
    })
    console.log("data.info._id------",this.data.info._id)
  },
  toApplyInfo() {
    var that = this;//闭包了
    let obj = that.data.info._id;
    wx.navigateTo({ url: '../home-applyInfo/home-applyInfo?id=' + obj })

    console.log("传到报名页面的obj是------",obj)
  },


  showModal(e) {
    console.log("showModal的返回值-----",e)
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
    let that = this;
    wx.cloud.callFunction({
      name: 'home',
      data: {
        method: "getAppointInfo",
        info: this.data.info._id
      },
      success: function (res) {
        console.log("第一次调用成功res:", res)
        console.log("下面查询openid：", res.result.checkResult[0]._openid)//发现_openid和openid查询结果一样
        var dance_type_ =[];
        res.result.checkResult[0].dance_type.forEach(function (element) {
          if (element.checked == true){
            dance_type_.push(element.name);
          }
        });
        res.result.checkResult[0].dance_type = dance_type_;
        //处理限制人数
        let arr = res.result.checkResult[0].applicant.filter((item)=>{
          if(item.state==0)
            return item
        })
        // console.log("处理舞种信息得到--------", res) //已解决
        // console.log("res.result.checkResult[0].applicant.length---",res.result.checkResult[0].applicant.length)
        console.log("arr是的---------",arr)
        that.setData({
          info: res.result.checkResult[0] ,
          "info.now" :arr.length
        })
        console.log("本地的openid",that.data.info._openid)

        console.log("下面查询openid：", res.result.checkResult[0].openid)
        //再次调用云函数
        wx.cloud.callFunction({
          name: 'mine',
          data: {
            method: "getUserInfo",
            openid: res.result.checkResult[0].openid  //openid =>  _openid
          },
          success: function (e) {
            console.log("第二次调用成功e:",e)      //result为null

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
