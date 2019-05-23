// pages/home-all/home-all.js
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ name: '综合', flag: false }, { name: '个人', flag: false }, { name: '官方', flag: false }],
    info: [{
      cover: '../../static/home.png',
      title: '标题',
      dance_type: 'popping',
      type: 'cypher',
      limit: '4/10',
      time: '2019-5-11 00:00:00',
      location:'',
      str: ''
    },
      {
        cover: '../../static/home.png',
        title: '标题',
        dance_type: 'popping',
        type: 'cypher',
        limit: '4/10',
        time: '2019-5-11 00:00:00',
        location: '昌平',
        str: ''
      },
      {
        cover: '../../static/home.png',
        title: '标题',
        dance_type: 'popping',
        type: 'cypher',
        limit: '4/10',
        time: '2019-5-11 00:00:00',
        location: '昌平',
        str: ''
      },
    ],
    hotList:['111','222','333','111111','111111'],
    historyList:['111','222','333','111111','111111'],
    keyword:'',
    dropDownFlag: false,
    searchFlag:false,
    searchKeyFlag:false
  },



clickTag(ev){
  console.log("进入clickTag",ev)
  this.setData({
    keyword: ev.target.dataset.item
  })
  console.log("此时搜索的keyword------",this.data.keyword)
},

inputKeyword(ev){
  console.log("进入inputKeyword",ev)
  this.setData({
    keyword : ev.detail.value
  })
  console.log(this.data.keyword)
},

search() {
  let that = this;
  this.setData({
    searchFlag:false,
    searchKeyFlag:true
  })
  console.log("进入search,传入的是", this.data.keyword);
  wx.cloud.callFunction({
    name:"home",
    data:{
      method:"getInfo",
      type:"keyword",
      info:this.data.keyword,
      openid:app.data.openid
    },

    success(res){
      //console.log("传入的是", this.data.keyword)
      console.log("返回搜索",res)
      that.setData({
        info: res.result.checkResult
      })
    },
    fail(err){
      console.log(`getInfo错误：${err}`)
    }
  })
},

cancel(){
  this.setData({
    searchFlag:false,
    searchKeyFlag:false
  })
  wx.cloud.callFunction({
    name: "home",
    data: {
      method: "getInfo",
      type: "All"
    }
  })
},

activeSearch:async function(){
  this.setData({
    searchFlag : true
  })
  let res1 = await wx.cloud.callFunction({ name: "home", data: { method:"getInfo", type:"hot",openid:app.data.openid}});
  console.log("返回热门搜索-------------", res1);
  this.setData({hotList : res1.result.checkResult});
  // console.log("hotList :", this.data.hotList);
  // console.log("发送的参数：",app.data.openid)
  let res2 = await wx.cloud.callFunction({ name: "home", data: { method:"getInfo", type:"history",openid:app.data.openid}});
  // console.log("返回历史搜索-------------", res2);
  this.setData({historyList : res2.result.checkResult});
},

activeDropDown1() {
  var that = this;
  // console.log("程序进来啦-----")
  that.setData({
    dropDownFlag: false
  }),
      wx.cloud.callFunction(
          {
            name: "home",
            data: {
              method: "getInfo",
              type: "time"
            },
            success: function (res) {
              //后台规定参数返回形式
              //return{
              //checkResult: [{},{},{}]
              // }
              res.result.checkResult.forEach(item => {
                item.str = ''
                item.dance_type.forEach(val => {
                  // var a=0;
                  // if (val.checked == true && a == 0){
                  //     item.str= val.name;
                  //     a++;
                  // }
                  // else if(val.checked == true){
                  //     item.str=item.str+ ','+ val.name;
                  //     a++;
                  // }
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

              // let obj = that.data.info;
              // obj.imgsrc = res.imgsrc;
              // obj.title  = res.title ;
              // obj.innerText1 = res.innerText1;
              // obj.innerText2 = res.innerText2;
              // obj.limit_now  = res.limit_now;
              // obj.limit      = res.limit;
              // obj.time      = res.time;
              // obj.location      = res.location;
            }
          }
      )
},
activeDropDown2() {
  console.log("程序进来了，按距离排序");
  var that = this;
  that.setData({
    dropDownFlag: false
  })
  wx.getLocation({
    success(res) {
      console.log("获取用户纬度经度：", res.latitude, res.longitude);
      wx.cloud.callFunction(
          {
            name: "home",
            data: {
              method: "getInfo",
              type: 'location',
              userLocation: { latitude: Number(res.latitude), longtitude: Number(res.longitude)}
            },
            success: function (res_) {
              console.log("按距离排序返回res_", res_)
              res_.result.checkResult.forEach(item => {
                item.str = ''
                item.dance_type.forEach(val => {
                  if (val.checked == true) {
                    item.str = item.str + val.name + ',';
                  }
                })
              })
              res_.result.checkResult.forEach(item => {
                item.str = item.str.slice(0, -1)
              }),

                  that.setData({
                    info: res_.result.checkResult
                  })
              console.log(res_)
            }
          }
      )
    }
  })
},

activeList(ev) {
  // console.log(ev.currentTarget.dataset.item)
  // ev.currentTarget.dataset.item.flag = true;
  let arr = this.data.list;
  var that = this;
  for (var j = 0; j < arr.length; j++) {
    arr[j].flag = false;
  }
  this.setData({
    list: arr
  })
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name == ev.currentTarget.dataset.item.name) {
      arr[i].flag = true;
      that.setData({
            list: arr
          }

      )
    }
  }
  if (ev.currentTarget.dataset.item.name == "综合") {
    that.setData({
      dropDownFlag: true
    })
  }
  else if (ev.currentTarget.dataset.item.name == "个人") {
    that.setData({
      dropDownFlag: false
    });
    wx.cloud.callFunction({
      name: "home",
      data: {
        method: 'getInfo',
        type: 'getByIndividual',
        location: app.data.location
      },
      success(res) {
        // console.log("按个人查询返回res",res);
        res.result.checkResult.forEach(item => {
          item.str = ''
          item.dance_type.forEach(val => {
            if (val.checked == true) {
              item.str = item.str + val.name + ',';
            }
          })
        })
        res.result.checkResult.forEach(item => {
          item.str = item.str.slice(0, -1)
        }),

            that.setData({
              info: res.result.checkResult
            })
        console.log(res)
      }
    })
  }
  else {
    that.setData({
      dropDownFlag: false
    });
    wx.cloud.callFunction({
      name: "home",
      data: {
        method: 'getInfo',
        type: 'getByOfficial'
      },
      success(res) {
        // console.log("按官方查询返回res", res);
        res.result.checkResult.forEach(item => {
          item.str = ''
          item.dance_type.forEach(val => {
            if (val.checked == true) {
              item.str = item.str + val.name + ',';
            }
          })
        })
        res.result.checkResult.forEach(item => {
          item.str = item.str.slice(0, -1)
        }),

            that.setData({
              info: res.result.checkResult
            })
        console.log(res)
      }
    })
  }
},

goToDetail(ev){
  console.log("这是ev---------",ev)
  wx.navigateTo({url:"../home-appointInfo/home-appointInfo?id="+ev.currentTarget.dataset.item._id})
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {

},

/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {
  // console.log("页面进来啦-------") 没问题
  var that = this;
  wx.cloud.callFunction(
      {
        name: 'home',
        data: {
          method: 'getInfo',//获取全部约局资讯
          type: 'All'
        },
        success: function (res) {
          //后台规定参数返回形式
          //return{
          //checkResult: [{},{},{}]
          // }
          res.result.checkResult.forEach(item => {
            item.str = ''
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
          console.log("这是返回的全部约局资讯------",res)
          // let obj = that.data.info;
          // obj.imgsrc = res.imgsrc;
          // obj.title  = res.title ;
          // obj.innerText1 = res.innerText1;
          // obj.innerText2 = res.innerText2;
          // obj.limit_now  = res.limit_now;
          // obj.limit      = res.limit;
          // obj.time      = res.time;
          // obj.location      = res.location;
        }

      })
},

/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {

},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {

},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {

},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {

},

/**
 * 页面上拉触底事件的处理函数
 */
onReachBottom: function () {

},

/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {

}
})

