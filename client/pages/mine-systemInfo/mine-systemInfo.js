const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    // 下面是系统通知页列表
    infoList:[
      {
        title:'',
        content:'这是申请内容这是申请内容这是申请内容这是申请内容这是申请内容这是申请内容这是申请内容这是申请内容这是申请内容',
        time:'5/15 23:00',
        checkNum:'',
        infoTitle:'标题啊'
      },
      {
        title:'',
        content:'',
        time:'',
        checkNum:'',
        infoTitle:'标题啊'
      },
      {
        title:'',
        content:'',
        time:'',
        checkNum:'',
        infoTitle:'标题啊'
      },
      {
        title:'',
        content:'',
        time:'',
        checkNum:'',
        infoTitle:'标题啊'
      }
    ],
    showModalFlag : false
  },
  showModal(ev) {
    console.log("ev------------",ev)
    this.setData({
      showModalFlag:true
    })
  },
  hideModal() {
    this.setData({
      showModalFlag:false
    })
  },

  // ListTouch触摸开始√
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向√
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动√
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection =='left'){
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  onReady(){
    console.log("嘻嘻嘻嘻嘻嘻进来了",app.data.openid)

    wx.cloud.callFunction({
      name : "mine",
      data:{
        method:'getSystemInfo',
        openid : 'wx34139989263b3718'
      },
      success(res){
        console.log("返回来的是-------------",res)

        // res.result中返回了三个数组，分别遍历三个数组，给数组里每一个对象增加一个标志
        res.result.myApply.forEach((item)=>{
           item.applyFlag = true;
        })
        res.result.checkedApply.forEach((item)=>{
          item.resultFlag = true;
        })
        res.result.checkedApply2.forEach((item)=>{
          item.resultFlag = true;
        })
        let arr = res.result.myApply.concat(res.result.checkedApply).concat(res.result.checkedApply2);//拼接数组
        arr.forEach((item)=>{                    //遍历该大数组，给本地info.title赋值
          if(applyFlag == true)
          {
            this.setData({
              'infoList.title': '你收到一个报名申请'
            })
            if(resultFlag == true){
              this.setData({
                'infoList.title' : '报名结果通知'
              })
            }
          }
        })
      }
    })
    // for(var i=0;i<res.result.length;i++)
    // {
    //   if(res.result == myApply)
    //   {
    //     var applyFlag = true;
    //   }
    //   if(res.result == checkedApply || res.result == checkedApply2)
    //   {
    //     var resultFlag = true;
    //   }
    //   let arr = a.concat(b).concat(c);
    //   arr.forEach(
    //       {
    //         if(applyFLag == true)
    //       }
    //   )
    // }
  }

})