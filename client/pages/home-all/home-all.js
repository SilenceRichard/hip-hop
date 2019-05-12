// pages/home-all/home-all.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[{name:'综合',flag:false},{name:'个人',flag:false},{name:'官方',flag:false}],
      info:[{
              imgsrc:'../../static/home.png',
              title:'标题',
              innerText1:'popping',
              innerText2:'cypher',
              limit_now:'4',
              limit:'10',
              time:'2019-5-11 00:00:00',
              location:'昌平'
            },
        {
          imgsrc:'../../static/home.png',
          title:'标题',
          innerText1:'popping',
          innerText2:'cypher',
          limit_now:'4',
          limit:'10',
          time:'2019-5-11 00:00:00',
          location:'昌平'
        },
        {
          imgsrc:'../../static/home.png',
          title:'标题',
          innerText1:'popping',
          innerText2:'cypher',
          limit_now:'4',
          limit:'10',
          time:'2019-5-11 00:00:00',
          location:'昌平'
        },
      ],
      dropDownFlag:false
  },

  activeDropDown1(){
      var that = this;
      wx.cloud.callFunction(
            {
                name:"home",
                data:{
                    method:"getInfo",
                    type:time
                },
                success:function(res){
                    that.setData({
                        Info:res.result.checkResult
                    })
                }
            }
            )
  },
    activeDropDown2(){
    wx.cloud.callFunction(
        {
            name:"home",
            data:{
                method:"getInfo",
                type:'location'
            },
            success:function(res){
                that.setData({
                    Info:res.result.checkResult
                })
            }
        }
    )
},

  activeList(ev){
    // console.log(ev.currentTarget.dataset.item)
    // ev.currentTarget.dataset.item.flag = true;
    let arr = this.data.list;
    for (var j = 0; j < arr.length; j++) {
       arr[j].flag = false;
    }
    this.setData({
      list:arr
    })
    for (var i = 0 ; i<arr.length; i++){
      if (arr[i].name == ev.currentTarget.dataset.item.name)
      {
        arr[i].flag = true;
        this.setData({
            list:arr
        }

        )
      }
    }
    if( ev.currentTarget.dataset.item.name == "综合"){
        this.setData({
            dropDownFlag:true
        })
    }
    else if(ev.currentTarget.dataset.item.name == "个人"){
        this.setData({
            dropDownFlag:false
        });
        wx.cloud.callFunction({
            name:"home",
            data:{
                method : 'getInfo',
                type : 'getByIndividual'
            },
            success:function(res){
                that.setData({
                    Info :res.result.checkResult
                })
            }
        })
    }
    else{
        this.setData({
            dropDownFlag:false
        });
        wx.cloud.callFunction({
            name:"home",
            data:{
                method : 'getInfo',
                type : 'getByOfficial'
            },
            success:function(res){
                that.setData({
                    Info :res.result.checkResult
                })
            }
        })
    }
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
     var that = this;
    wx.cloud.callFunction(
        {
            name:'home',
            data:{
                method:'getInfo',//获取全部约局资讯
                type:'All'
            },
            success:function(res){
                //后台规定参数返回形式
                //return{
                     //checkResult: [{},{},{}]
                // }
                 that.setData({
                     info:res.result.checkResult
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
