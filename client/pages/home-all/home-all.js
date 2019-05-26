// pages/home-all/home-all.js
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js'
const app = getApp();
Page({
    loadingFlag: false,
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
      limit: '',
      time: '2019-5-11 00:00:00',
      location:'',
      str: '',
      now:''
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
    searchKeyFlag:false,
    bgImage:app.globalData.bgSrc
  },

  Back() {
        var that = this;
        this.setData({
            searchFlag: false,
            searchKeyFlag: false
        })
        wx.cloud.callFunction({
            name: "home",
            data: {
                method: "getInfo",
                type: "All"
            },
            success: function (res) {
                //处理人数限制
                res.result.checkResult= res.result.checkResult.map((item)=>{
                    let arr = item.applicant.filter((val)=>{
                        if(val.state==0)
                            return val
                    })
                    item.now = arr.length
                    return item
                })
                //处理舞种信息
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
                })

                that.setData({
                    info: res.result.checkResult
                })
                console.log("这是返回的全部约局资讯------",res)
                console.log("info",that.data.info)
            }
        })
    },

clickTag(ev){
  console.log("进入clickTag",ev)
  this.setData({
    keyword: ev.target.dataset.item
  })
  console.log("此时搜索的keyword------",this.data.keyword)
},

inputKeyword(ev){
    var that = this;
  console.log("进入inputKeyword",ev)
  this.setData({
    keyword : ev.detail.value
  })
  // if(searchKeyFlag==true)
  // {
  //   that.setData({
  //     theFlag : true
  //   })
  // }
  console.log(this.data.keyword)
},

search() {
  let that = this;
    this.setData({
        searchFlag:false,
        searchKeyFlag:true
    })
  if(this.data.keyword != '')
  {
      console.log("进入search,传入的是", this.data.keyword);
      wx.cloud.callFunction({
          name:"home",
          data:{
              method:"getInfo",
              type:"keyword",
              info:this.data.keyword,
              openid:app.data.openid
          },

          success: function (res) {
              //处理人数限制
              res.result.checkResult= res.result.checkResult.map((item)=>{
                  let arr = item.applicant.filter((val)=>{
                      if(val.state==0)
                          return val
                  })
                  item.now = arr.length
                  return item
              })
              //处理舞种信息
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
              })

              that.setData({
                  info: res.result.checkResult
              })
              console.log("这是返回的全部约局资讯------",res)
              console.log("info",that.data.info)
          },
          fail(err){
              console.log(`getInfo错误：${err}`)
          }
      })
  }
  else{
      this.setData({
          searchFlag: false,
          searchKeyFlag: false
      })
      wx.cloud.callFunction({
          name: "home",
          data: {
              method: "getInfo",
              type: "All"
          },
          success: function (res) {
              //处理人数限制
              res.result.checkResult= res.result.checkResult.map((item)=>{
                  let arr = item.applicant.filter((val)=>{
                      if(val.state==0)
                          return val
                  })
                  item.now = arr.length
                  return item
              })
              //处理舞种信息
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
              })

              that.setData({
                  info: res.result.checkResult
              })
              console.log("这是返回的全部约局资讯------",res)
              console.log("info",that.data.info)
          }
      })
  }

},

cancel() {
    var that = this;
  this.setData({
    searchFlag: false,
    searchKeyFlag: false
  })
  wx.cloud.callFunction({
    name: "home",
    data: {
      method: "getInfo",
      type: "All"
    },
      success: function (res) {
          //处理人数限制
          res.result.checkResult= res.result.checkResult.map((item)=>{
              let arr = item.applicant.filter((val)=>{
                  if(val.state==0)
                      return val
              })
              item.now = arr.length
              return item
          })
          //处理舞种信息
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
          })

          that.setData({
              info: res.result.checkResult
          })
          console.log("这是返回的全部约局资讯------",res)
          console.log("info",that.data.info)
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
  this.setData({historyList : res2.result.checkResult.reverse()});
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
                  //处理人数限制
                  res.result.checkResult= res.result.checkResult.map((item)=>{
                      let arr = item.applicant.filter((val)=>{
                          if(val.state==0)
                              return val
                      })
                      item.now = arr.length
                      return item
                  })
                  //处理舞种信息
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
                  })

                  that.setData({
                      info: res.result.checkResult
                  })
                  console.log("这是返回的全部约局资讯------",res)
                  console.log("info",that.data.info)
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
              userLocation: { latitude: Number(res.latitude), longitude: Number(res.longitude)}
            },
              success: function (res) {
                  //处理人数限制
                  res.result.checkResult= res.result.checkResult.map((item)=>{
                      let arr = item.applicant.filter((val)=>{
                          if(val.state==0)
                              return val
                      })
                      item.now = arr.length
                      return item
                  })
                  //处理舞种信息
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
                  })

                  that.setData({
                      info: res.result.checkResult
                  })
                  console.log("这是返回的全部约局资讯------",res)
                  console.log("info",that.data.info)
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
  if (ev.currentTarget.dataset.item.name == "综合" ) {
      if(that.data.dropDownFlag == false)
    that.setData({
      dropDownFlag: true
    })
      else{
          wx.cloud.callFunction({
              name: "home",
              data: {
                  method: 'getInfo',
                  type: 'All',
              },
              success: function (res) {
                  that.setData({
                      dropDownFlag : false
                  })
                  //处理人数限制
                  res.result.checkResult= res.result.checkResult.map((item)=>{
                      let arr = item.applicant.filter((val)=>{
                          if(val.state==0)
                              return val
                      })
                      item.now = arr.length
                      return item
                  })
                  //处理舞种信息
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
                  })

                  that.setData({
                      info: res.result.checkResult
                  })
                  console.log("这是返回的全部约局资讯------",res)
                  console.log("info",that.data.info)
              }
          })
      }
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
        success: function (res) {
            //处理人数限制
            res.result.checkResult= res.result.checkResult.map((item)=>{
                let arr = item.applicant.filter((val)=>{
                    if(val.state==0)
                        return val
                })
                item.now = arr.length
                return item
            })
            //处理舞种信息
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
            })

            that.setData({
                info: res.result.checkResult
            })
            console.log("这是返回的全部约局资讯------",res)
            console.log("info",that.data.info)
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
        success: function (res) {
            //处理人数限制
            res.result.checkResult= res.result.checkResult.map((item)=>{
                let arr = item.applicant.filter((val)=>{
                    if(val.state==0)
                        return val
                })
                item.now = arr.length
                return item
            })
            //处理舞种信息
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
            })

            that.setData({
                info: res.result.checkResult
            })
            console.log("这是返回的全部约局资讯------",res)
            console.log("info",that.data.info)
        }
    })
  }
},

goToDetail(ev){
  console.log("这是ev---------",ev)
  wx.navigateTo({url:"../home-appointInfo/home-appointInfo?id="+ev.currentTarget.dataset.item._id})
},

onPullDownRefresh(){
  let that = this;
  console.log("下拉刷新----")
  wx.cloud.callFunction({
      name: 'home',
      data: {
          method: 'getInfo',//获取全部约局资讯
          type: 'All'
      },
      success: function (res) {
          console.log("下拉刷新成功了",res)
          //处理人数限制
          res.result.checkResult= res.result.checkResult.map((item)=>{
              let arr = item.applicant.filter((val)=>{
                  if(val.state==0)
                      return val
              })
              item.now = arr.length
              return item
          })
          //处理舞种信息
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
          })

          that.setData({
              info: res.result.checkResult,
              dropDownFlag: false,
              searchFlag:false,
              searchKeyFlag:false
          })
          that.data.list.forEach((item)=>{
              item.flag = false
          })
          that.setData({
              list:that.data.list
          })
          wx.stopPullDownRefresh()
      }
  })
},



onReady: function () {
  console.log("页面进来啦-------")//没问题
  var that = this;
    this.setData({
        loadingFlag: true
    })
  wx.cloud.callFunction(
      {
        name: 'home',
        data: {
          method: 'getInfo',//获取全部约局资讯
          type: 'All'
        },
        success: function (res) {
            //处理人数限制
            res.result.checkResult= res.result.checkResult.map((item)=>{
                let arr = item.applicant.filter((val)=>{
                    if(val.state==0)
                        return val
                })
                item.now = arr.length
                return item
            })
            //处理舞种信息
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
          })
            that.setData({
                info: res.result.checkResult,
                loadingFlag: false
            })
              that.setData({
                info: res.result.checkResult
              })
          console.log("这是返回的全部约局资讯------",res)
            console.log("info",that.data.info)
        },
        fail: function (err) {
            console.log("???",err)
        }
      })
},


onShow: function () {

},


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

