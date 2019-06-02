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
    apply:'', //申请信息
    sendInfoObj:{
      checkedId:'',
      state:'',
      id:''
    },
    applicantArr:[],//展示参与者信息
    showApplicant:false,
    setterInfo:{},//展示发起人信息
    showSetter:false, //展示发起人信息标志
    bgImage:app.globalData.bgSrc,
    showDelFlag:false
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
  goToPage(ev){
    console.log(ev.currentTarget.dataset.url)
    switch (ev.currentTarget.dataset.url) {
      case 'mine-person':wx.navigateTo({url:'../mine-person/mine-person'});break;
      case 'dance-settings':wx.switchTab({url:'../dance-settings/dance-settings'});break;
      case 'home-all':wx.navigateTo({url:'../home-all/home-all'});break;
    }
  },
  showModal(ev) {
    let that = this;
    let obj = {
      checkedId:ev.currentTarget.dataset.item._openid,
      state:ev.currentTarget.dataset.item.state,
      id:ev.currentTarget.dataset.item.dance_id
    }
    this.setData({
      sendInfoObj:obj
    })
    console.log(obj)
    wx.cloud.callFunction({
      name:'mine',
      data:{
        method:'getUserInfo',
        openid:ev.currentTarget.dataset.item._openid
      },
      success(res) {
       console.log(res)
        that.setData({
          userList:res.result.res,
          apply:ev.currentTarget.dataset.apply||''
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
        checkedId:that.data.sendInfoObj.checkedId,
        state:ev.currentTarget.dataset.state,
        id:that.data.sendInfoObj.id
      },
      success(){
        wx.showToast({
          type:'success',
          title:'操作成功！'
        })
        that.getSystemInfo();
        that.setData({
          showModalFlag:false
        })
      },
      fail(err){
        console.log(`err调用失败!${err}`)
      }
    })
  },
  showNotice(ev){
    let that = this;
    console.log(ev.currentTarget.dataset.item.applicant)
    let applicant = ev.currentTarget.dataset.item.applicant.map(item=>{
      if (item.state=='0'){
        return item._openid
      }
    })
    console.log(applicant)
    //获取参与者的信息
    wx.cloud.callFunction({
      name:'mine',
      data:{
        method:'getApplicantInfo',
        applicant:applicant
      },
      success(res){
        that.setData(
            {
              showApplicant:true,
              applicantArr:res.result.nameStr
            }
        )
        console.log(that.data.applicantArr)
      }
    })
  }, //展示成功发起的约局信息
  checkSetterInfo(ev){
    console.log(ev.currentTarget.dataset.item.contact)
    this.setData({
      setterInfo:{}
    })
    switch(ev.currentTarget.dataset.item.contact){
      case'手机号': this.setData({
        setterInfo:{
          contact:'phone',
          phone:ev.currentTarget.dataset.item.phone,
        },
        showSetter:true
      });break;
      case '微信':this.setData({
        setterInfo:{
          contact:'wx',
          QR_code:ev.currentTarget.dataset.item.QR_code,
        },
        showSetter:true
      });break;
      case '微信群聊':this.setData({
        setterInfo:{
          contact:'wxq',
          QR_code:ev.currentTarget.dataset.item.QR_code,
        },
        showSetter:true
      });break;
    }
    console.log(this.data.setterInfo)
  }, //查看发起人联系方式
  hideApplicant(){
    this.setData({
      showApplicant:false
    })
  },
  hideSetter(){
    this.setData({
      showSetter:false
    })
  },
  preview(ev){
    console.log(ev.currentTarget.dataset.src);
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [ev.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  }, //图片预览
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
    wx.showModal({
      title: '删除信息',
      content: '确认删除这条消息吗？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name: 'mine',
            data: {
              method: 'deleteMessage',
              delete_id:ev.currentTarget.dataset.item._id,
              openid: app.data.openid,  //阅读者（发起人）的openid
              apply_openid:app.data.openid // 阅读者（参与人） 这部分的请求存在问题
            },
            success(res) {
              wx.showToast({
                type:'success',
                title:'删除成功！'
              })
              that.getSystemInfo()
            },
            fail(err) {
              console.log(err)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  getSystemInfo(){
    console.log("嘻嘻嘻嘻嘻嘻进来了",app.data.openid)
    let that = this
    this.setData({
      hdList:[],
      systemList:[]
    })
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
        res.result.checkingApply.forEach(item=>{
          item.checkingFlag = true
        })
        let a=that.data.systemList.concat(res.result.myTeamedDance)
            .concat(res.result.myUpTimeDance).concat(res.result.checkingApply)
        a.map(item=>{
          if (item.teamedFlag){
            item.titleShow = `您的${item.title}约局已成功组队`
            return item
          }
          if (item.overtimeFlag){
            item.titleShow = `您的${item.title}约局已过期`
            return item
          }
          if (item.checkingFlag){
            item.titleShow = `您申请的${item.title}约局正在审核中`
            return item
          }
        })
        that.setData({
          systemList:a.reverse()
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
          hdList:b.reverse()
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
  },
  onShow(){
     this.getSystemInfo();
  }
})
