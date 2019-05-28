import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();

Page({
  data: {
    bgImage: app.globalData.bg2,
    info: {
      cover: '',
      title: '',
      identify: '',
      dance_type:"",
      type:"",
      date: '',
      now: '',
      limit: '',
      content: '',
      condition:'',
      activeDate:'',
      time: '',
      location:'',
      avatarUrl:'',
      authorName:'',
      _id:'',
      nickName: '',
      role: '',
      sex: '',
      city: '',
      danceType: '',
      danceAge: '',
      introduction: '',
      _openid:''
    },
    info_:{
      
    },
    //info_,
    loadingFlag:false,
    showModalFlag:false,
   
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
    var that = this;
    console.log("showModal的返回值-----",e)
    that.setData({
      showModalFlag:true
    })
    // wx.cloud.callFunction({
    //   name: 'home',
    //   data: {
    //     method: "getFounderInfo",
    //     info: id
    //   },
    //   success: function (res) {
    //     console.log("id------", id)
    //     console.log("传回来的是--------", res)
    //     that.setData({
    //       info: res.result
    //     })
    //   }
    // })
  },
  hideModal(e) {
    var that = this
    that.setData({
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
    this.setData({
      loadingFlag: true
    })
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
          "info.now" :arr.length,
           loadingFlag: false
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
