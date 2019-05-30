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
    info: [
    ],
    hotList:[],
    historyList:[],
    keyword:'',
    dropDownFlag: false,
    searchFlag:false,
    searchKeyFlag:false,
    bgImage:app.globalData.bgSrc,
    refreshNumber:1,
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
    wx.nextTick(async ()=>{
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
    })
  },

  activeDropDown1() {
    var that = this;
    console.log("程序进来了，按时间排序");
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
            console.log("返回时间查询结果：", res.result.checkResult);
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
    this.setData({
      refreshNumber:1
    })
    console.log("下拉刷新,refreshNumber变为", this.data.refreshNumber);
    let that = this;
    wx.cloud.callFunction({
      name: 'home',
      data: {
        method: 'getInfo',//获取全部约局资讯
        type: 'All',
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
  },//下拉刷新



  onShow: function () {
    console.log("页面进来啦-------")//没问题
    var that = this;
    this.setData({
      loadingFlag: false
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
          res.result.checkResult = res.result.checkResult.map((item) => {
            let arr = item.applicant.filter((val) => {
              if (val.state == 0)
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
          console.log("这是返回的全部约局资讯------", res)
          console.log("info", that.data.info)
        },
        fail: function (err) {
          console.log("???", err)
        }
      })
  },

  onReady: function () {
    console.log("页面进来啦-------")//没问题
    wx.nextTick(()=>{
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
              res.result.checkResult = res.result.checkResult.map((item) => {
                let arr = item.applicant.filter((val) => {
                  if (val.state == 0)
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
              wx.nextTick(()=>{
                that.setData({
                  info: res.result.checkResult
                })
              })

              console.log("这是返回的全部约局资讯------", res)
              console.log("info", that.data.info)
            },
            fail: function (err) {
              console.log("???", err)
            }
          })
    })
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
  // onReachBottom: function () {
  //   this.data.refreshNumber++;
  //   console.log("触发底部,refreshNumber变为", this.data.refreshNumber);
  //   var that = this;
  //   wx.cloud.callFunction(
  //     {
  //       name: 'home',
  //       data: {
  //         method: 'getInfo',//获取全部约局资讯
  //         type: 'All',
  //         page: this.data.refreshNumber,
  //       },
  //       success: function (res) {
  //         //处理人数限制
  //         res.result.checkResult = res.result.checkResult.map((item) => {
  //           let arr = item.applicant.filter((val) => {
  //             if (val.state == 0)
  //               return val
  //           })
  //           item.now = arr.length
  //           return item
  //         })
  //         //处理舞种信息
  //         res.result.checkResult.forEach(item => {
  //           item.str = ''
  //           item.dance_type.forEach(val => {
  //             if (val.checked == true) {
  //               item.str = item.str + val.name + ',';
  //             }
  //           })
  //         })
  //         res.result.checkResult.forEach(item => {
  //           item.str = item.str.slice(0, -1)
  //         })
  //         let newA = that.data.info.concat(res.result.checkResult);
  //         that.setData({
  //           info: newA
  //         })
  //         console.log("这是刷新返回的资讯------", res.result.checkResult)
  //         console.log("这是拼接后的资讯------", newA)
  //       },
  //       fail: function (err) {
  //         console.log("刷新失败", err)
  //       }
  //     })
  // },


  // reachBottom(e){
  //   console.log("触发reachBottom!!!!!!!!!!!!!!", e);
  // },
  touchStart(e) {
    //console.log("触发touchStart", e.changedTouches[0]);
    this.setData({
      "touch.x": e.changedTouches[0].clientX,
      "touch.y": e.changedTouches[0].clientY
    });
  },
  touchEnd(e) {
    //console.log("触发touchEnd", e.changedTouches[0]);
    let x = e.changedTouches[0].clientX;
    let y = e.changedTouches[0].clientY;
    let option = util.getTouchData(x,y,this.data.touch.x,this.data.touch.y);
    if (option === 'pushup'){
      this.data.refreshNumber++;
      console.log("触发上拉加载,refreshNumber变为", this.data.refreshNumber);
      var that = this;
      wx.cloud.callFunction({
        name: 'home',
        data: {
          method: 'getInfo',//获取全部约局资讯
          type: 'All',
          page: this.data.refreshNumber,
        },
        success: function (res) {
          //处理人数限制
          res.result.checkResult = res.result.checkResult.map((item) => {
            let arr = item.applicant.filter((val) => {
              if (val.state == 0)
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
          let newA = that.data.info.concat(res.result.checkResult);
          that.setData({
            info: newA
          })
          console.log("这是返回的资讯------", res.result.checkResult)
          console.log("这是拼接后的资讯------", newA)
        },
        fail: function (err) {
          console.log("刷新失败", err)
        }
      })
    }
  },
})

