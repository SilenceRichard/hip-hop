import  util from '../../utils/util'
const app = getApp();
Page({
  data: {
    TabCur:0,
    tabList:[{name:"系统消息",type:"xt"},{name:"互动消息",type:"hd"}],
    // 下面是系统通知页列表
    systemList:[],//系统消息
    hdList:[], //互动消息
    flag:true, //系统消息或互动消息的标志
    showModalFlag : false,
    userList:{},
  },
  goTo(ev){
    console.log(ev)
    if (ev.currentTarget.dataset.type=="xt"){
      this.setData({
        TabCur:ev.currentTarget.dataset.id,
        flag:true
      })
    }
    else if(ev.currentTarget.dataset.type=="hd"){
      this.setData({
        TabCur:ev.currentTarget.dataset.id,
        flag:false
      })
    }
  },
  showModal(ev) {
    let that = this;
    console.log("对getMineInfo发起了调用,请求参数",ev.currentTarget.dataset.item._openid)
    wx.cloud.callFunction({
      name:'mine',
      data:{
        method:'getMineInfo',
        openid:ev.currentTarget.dataset.item._openid
      },
      success(res) {
       console.log(res)
        that.setData({
          userList:res.result.res
        })
      },
      fail(err){
        console.log(err)
      }
    })
    this.setData({
      showModalFlag:true
    })
  },
  hideModal() {
    this.setData({
      showModalFlag:false
    })
  },
  sendInfo(ev){
    let that = this;
    wx.cloud.callFunction({
      name:'mine',
      data:{
        method:'exam',
        checkedId:ev.currentTarget.dataset.item._openid,
        state:ev.currentTarget.dataset.state,
        id:ev.currentTarget.dataset.item.dance_id
      },
      success(){
        that.setData({
          showModalFlag:false
        })
      }
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
  delete(ev){
    let that = this;
    console.log("删除！", ev)
    wx.cloud.callFunction({
      name: 'mine',
      data: {
        method: 'deleteMessage',
        _id:ev.currentTarget.dataset.item.dance_id,
        openid: app.data.openid,
        _openid:ev.currentTarget.dataset.item._openid
      },
      success(res) {
        console.log(res)
        that.setData({
          userList: res.result.res
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  onReady(){
    console.log("嘻嘻嘻嘻嘻嘻进来了",app.data.openid)
    let that = this
    wx.cloud.callFunction({
      name : "mine",
      data:{
        method:'getSystemInfo',
        openid : app.data.openid
      },
      success(res){
        console.log("返回来的是-------------",res.result)
        res.result.myTeamedDance.forEach(item =>{
          item.teamedFlag = true
        })
        res.result.myUpTimeDance.forEach(item =>{
          item.overtimeFlag = true
        })
        let a=that.data.systemList.concat(res.result.myTeamedDance)
                                  .concat(res.result.myUpTimeDance)
        a.map(item=>{
          if (item.teamedFlag){
            item.titleShow = `您的${item.title}约局已成功组队`
            return item
          }
          if (item.overtimeFlag){
            item.titleShow = `您的${item.title}约局已过期`
            return item
          }
        })
        that.setData({
          systemList:a
        })
        console.log("系统消息",that.data.systemList)
        res.result.uncheckedApply.forEach(item =>{
          item.uncheckedFlag = true
        })
        res.result.checkedApply.forEach(item =>{
          item.passFlag = true
        })
        res.result.checkedApply2.forEach(item =>{
          item.unpassFlag = true
        })
        let b=that.data.hdList.concat(res.result.uncheckedApply)
                        .concat(res.result.checkedApply)
                        .concat(res.result.checkedApply2)
        b.map(item=>{
            let obj = item;
            if (obj.uncheckedFlag){
              obj.titleShow=`你收到一个加入请求！`
              return obj
            }
            if (obj.passFlag){
              obj.titleShow=`你已成功加入${item.title}的约局`
            }
            if (obj.unpassFlag){
              obj.titleShow=`你的${item.title}约局申请已被拒绝`
            }
            return obj
        })
        that.setData({
          hdList:b
        })
        console.log("互动消息：",that.data.hdList)
        // res.result中返回了三个数组，分别遍历三个数组，给数组里每一个对象增加一个标志
        // res.result.myApply.forEach((item)=>{
        //    item.applyFlag = true;
        // })
        // res.result.checkedApply.forEach((item)=>{
        //   item.resultFlag = true;
        // })
        // res.result.checkedApply2.forEach((item)=>{
        //   item.resultFlag = true;
        // })
        // let arr = res.result.myApply.concat(res.result.checkedApply).concat(res.result.checkedApply2);//拼接数组
        // arr.forEach((item)=>{                    //遍历该大数组，给本地info.title赋值
        //   if(applyFlag == true)
        //   {
        //     this.setData({
        //       'infoList.title': '你收到一个报名申请'
        //     })
        //     if(resultFlag == true){
        //       this.setData({
        //         'infoList.title' : '报名结果通知'
        //       })
        //     }
        //   }
        // })
      },
      fail(err){
        console.log("走不走？",err)
    }
    })
  }

})
