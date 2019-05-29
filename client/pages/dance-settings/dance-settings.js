// pages/dance-settings/dance-settings.js
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js'
const app = getApp();
Page({
  data: {
    step:0, //记录填报表单的步骤数
    info:{
      location:{
        name:'',
        address:'',
        latitude:'',
        longitude:'',
        contact:'',
      },
      clicktime:0,
      identify:'',
      type:'',
      cover:'',
      title:'',
      content:'',
      limit:'',//展示的限制人数
      condition:'',
      contact:'',
      QR_code:'',
      phone:''
    },//存入数据库的约局信息对象
    cover_num:0,
    QR_num :0,
    num:0,//numLimit数组中第num个元素
    numLimit:[],
    showModalFlag: false,
    checkboxItems: [
      {name: 'Hiphop', value: 'Hiphop', checked: false},
      {name: 'Popping', value: 'Popping',checked: false},
      {name: 'Locking', value: 'Locking',checked: false},
      {name: 'Breaking', value: 'Breaking',checked: false},
      {name: 'Waacking', value: 'Waacking',checked: false},
      {name: 'House', value: 'House',checked: false},
      {name: 'Jazz', value: 'Jazz',checked: false},
      {name: 'Urban', value: 'Urban',checked: false},
      {name: 'Krumping', value: 'Krumping',checked: false},
      {name: 'Reggae', value: 'Reggae',checked: false},
      {name: '不限', value: '不限',checked: false},
    ],//记录舞种信息
    contactItems:[{name:'手机号',flag:false},{name:'微信',flag:false},{name:'微信群聊',flag:false}], //联系方式
    timestamp:{
      date:util.formatDate(new Date()),
      time:"00:00"
    },//时间戳
    contactName:'', //当前选择联系方式项
    basicsList: [
        {
          icon: 'emoji',
          name: '活动类型'
        },
        {
          icon: 'emoji',
          name: '活动形式'
        },
        {
        icon: 'emoji',
        name: '舞种'
        },
        {
        icon: 'emoji',
        name: '详情'
        },
        {
        icon: 'emoji',
        name: '联系方式'
        }],
    basics: 0, //步骤数
    topTip:false,
    tips:[
      {step:0,tips:"(#`O′)你还没选活动形式！"},
      {step:1,tips:"(#`O′)你还没选活动形式！"},
      {step:2,tips:"(#`O′)至少选择一个舞种哟！"},
      {step:3,tips:"(#`O′)这个表单都是必填项哟！请选择地图上有名字的约局地点"},
      {step:4,tips:"(#`O′)请选择一种联络方式并留下信息~~"}
    ],
    touch:{
      x:'',
      y:''
    },
    bgImage:app.globalData.bgSrc
  },
  lastInfo(e){
      this.setData({
          step:this.data.step-1,
          basics:this.data.basics-1,
          topTip:false
      })
  },
  async setInfo(ev){//点击事件
    console.log("已点击");
    let that = this;
    let obj = this.data.info;//信息中间量
    if (this.data.step == 0){//如果是第一步
      obj.identify = ev.target.dataset.identify; //身份
      this.setData({
        info:obj,//由中间量导入数据到info
        step:this.data.step+1,//更新step
        basics:this.data.basics+1,
        topTip:false
      })
    }
    else if (this.data.step == 1) {//如果是第二步
      obj.type = ev.target.dataset.type; //活动形式
      this.setData({
        info:obj,//由中间数据到info量导入
        step:this.data.step+1,//更新step
        basics:this.data.basics+1,
        topTip:false
      })
    }
   else if (this.data.step == 2){//如果是第三步
        var chooseFlag = false;
        let t=0
        this.data.checkboxItems.forEach(item =>{
          if (item.checked) {
              chooseFlag = true;
              t++
          }
          if(t>3)
          {

          }
        })
        obj.dance_type = this.data.checkboxItems;
        if (chooseFlag){
          this.setData({
            info:obj,//由中间量导入数据到info
            step:this.data.step+1,//更新step
            basics:this.data.basics+1,
            topTip:false
          })
        }else {
          this.setData({
            topTip:true
          })
        }
    }//舞种
   else if (this.data.step == 3) {//如果是第四步
      let formFlag = true

      for (let i in  this.data.info)
        {
          if (i==='location'){
            if (this.data.info[i].name === '') {
              this.setData({
                topTip:true
              })
              formFlag = false
            }
          }else if (i!='contact'&&i!='QR_code'&&i!='phone') {
            if (this.data.info[i]=== '') {
              this.setData({
                topTip:true
              })
              formFlag = false
            }
          }
        }
      if (formFlag){
        obj.time = `${this.data.timestamp.date} ${this.data.timestamp.time}`//一系列信息
        this.setData({
          info:obj,//由中间量导入数据到info
          step:this.data.step+1,//更新step
          basics:this.data.basics+1,
          topTip:false
        })
      }
    }
   else if (this.data.step == 4){//如果是第五步
       if(this.data.info.contact ===''&&this.data.info.QR_code===''&&this.data.info.phone===''){
           this.setData({
               topTip:true
           })
       }else{
          let userInfo = await wx.cloud.callFunction({name: "mine",data:{method:'getUserInfo',openid:app.data.openid}})
          let authorName =userInfo.result.res.nickName;
          obj.authorName = authorName
           this.setData({
               info:obj,//由中间量导入数据到info
               step:this.data.step,//更新step
               basics:this.data.basics+1,
               topTip:false
             })
         console.log("传入云端数据：",this.data.info);
           await wx.cloud.callFunction({
               name:"dance",
               data: {
                 method: 'danceSettings',
                 info: this.data.info,
                 openid: app.data.openid
               },
               success(){
               that.setData({
                 showModalFlag: true
               })
             }
           })

       }
    }//上传至云端
  },
  hideModal(e) {
    let obj= {
    step:0, //记录填报表单的步骤数
    info:{
      location:{
        name:'',
        address:'',
        latitude:'',
        longitude:'',
        contact:'',
      },
      clicktime:0,
      identify:'',
      type:'',
      cover:'',
      title:'',
      content:'',
      limit:1,
      condition:'',
      contact:'',
      QR_code:'',
      phone:''
    },//存入数据库的约局信息对象
    showModalFlag: false,
    checkboxItems: [
      {name: 'Hiphop', value: 'Hiphop', checked: false},
      {name: 'Popping', value: 'Popping',checked: false},
      {name: 'Locking', value: 'Locking',checked: false},
      {name: 'Breaking', value: 'Breaking',checked: false},
      {name: 'Waacking', value: 'Waacking',checked: false},
      {name: 'House', value: 'House',checked: false},
      {name: 'Jazz', value: 'Jazz',checked: false},
      {name: 'Urban', value: 'Urban',checked: false},
      {name: 'Krumping', value: 'Krumping',checked: false},
      {name: 'Reggae', value: 'Reggae',checked: false},
      {name: '不限', value: '不限',checked: false},
    ],//记录舞种信息
    contactItems:[{name:'手机号',flag:false},{name:'微信',flag:false},{name:'微信群聊',flag:false}], //联系方式
    timestamp:{
      date:util.formatDate(new Date()),
      time:"00:00"
    },//时间戳
    contactName:'', //当前选择联系方式项
    basicsList: [
        {
          icon: 'emoji',
          name: '活动类型'
        },
        {
          icon: 'emoji',
          name: '活动形式'
        },
        {
        icon: 'emoji',
        name: '舞种'
        },
        {
        icon: 'emoji',
        name: '详情'
        },
        {
        icon: 'emoji',
        name: '联系方式'
        }],
    basics: 0, //步骤数
    topTip:false,
    tips:[
      {step:0,tips:"(#`O′)你还没选活动形式！"},
      {step:1,tips:"(#`O′)你还没选活动形式！"},
      {step:2,tips:"(#`O′)至少选择一个舞种哟！"},
      {step:3,tips:"(#`O′)这个表单都是必填项哟！请选择地图上有名字的约局地点"},
      {step:4,tips:"(#`O′)请选择一种联络方式并留下信息~~"}
    ],
    touch:{
      x:'',
      y:''
    },
    }
      this.setData({
        showModalFlag: false,
        step: 0,
        basics: 0,
        info: { obj },
        cover_num :0,
        QR_num: 0,
        num: 0,//numLimit数组中第num个元素
        numLimit: [],
        showModalFlag: false,
        checkboxItems: [
          { name: 'Hiphop', value: 'Hiphop', checked: false },
          { name: 'Popping', value: 'Popping', checked: false },
          { name: 'Locking', value: 'Locking', checked: false },
          { name: 'Breaking', value: 'Breaking', checked: false },
          { name: 'Waacking', value: 'Waacking', checked: false },
          { name: 'House', value: 'House', checked: false },
          { name: 'Jazz', value: 'Jazz', checked: false },
          { name: 'Urban', value: 'Urban', checked: false },
          { name: 'Krumping', value: 'Krumping', checked: false },
          { name: 'Reggae', value: 'Reggae', checked: false },
          { name: '不限', value: '不限', checked: false },
        ],//记录舞种信息
        contactItems: [{ name: '手机号', flag: false }, { name: '微信', flag: false }, { name: '微信群聊', flag: false }], //联系方式
        timestamp: {
          date: util.formatDate(new Date()),
          time: "00:00"
        },//时间戳
        contactName: '', //当前选择联系方式项
      }),
      wx.navigateTo({ url: "../index/index" })
  },
  
    
  bindDateChange(ev){
    if (ev.currentTarget.dataset.type == 'date'){
      let timeobj= this.data.timestamp;
      timeobj.date = ev.detail.value;
      this.setData({
        timestamp:timeobj  //日期选择
      })
    }else {
      let timeobj= this.data.timestamp;
      timeobj.time = ev.detail.value;
      this.setData({
        timestamp:timeobj //时间选择
      })
    }
  },//日期选择(这里的触发事件是bindchange)
  bindNumChange(e){
      console.log("触发了picker----------",e)
      this.setData({
           num:e.detail.value,
          "info.limit":Number(e.detail.value)+1
      })
       console.log("limit------",this.data.info.limit)
  },//限制人数选择


  ChooseImage() {
      var that = this;
        wx.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (chooseResult) => {
                if (this.data.info.cover == '') {
                    console.log("chooseResult----",chooseResult)
                    wx.cloud.uploadFile({
                        cloudPath: util.uuid()+'my-photo.png',
                        filePath: chooseResult.tempFilePaths[0],
                        success: res => {
                            that.setData({
                                "info.cover":res.fileID,//云存储图片路径
                                cover_num:that.data.cover_num+1
                            });
                            console.log("this.data.info.cover",that.data.info.cover)
                        },
                    })
                }
            }
        });
    },
  chooseImageQR() {
        var that = this;
        wx.chooseImage({
            count: 1, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (chooseResult) => {
                if (this.data.QR_num == 0) {
                    console.log("chooseResult----",chooseResult)
                    wx.cloud.uploadFile({
                        cloudPath: util.uuid()+'my-photo.png',
                        filePath: chooseResult.tempFilePaths[0],
                        success: res => {
                            that.setData({
                                "info.QR_code":res.fileID,//云存储图片路径
                                QR_num:that.data.QR_num+1
                            });
                            console.log("info.QR_code:",this.data.info.QR_code)
                        },
                    })
                }
            }
        });
    },
  ViewImage(e) {
        wx.previewImage({
            urls: this.data.info.cover,
            current: e.currentTarget.dataset.url
        });
    },//预览封面图
  ViewQRImage(e) {
        wx.previewImage({
            urls: this.data.info.QR_code,
            current: e.currentTarget.dataset.url
        });
    },//预览二维码
  DelImg(e) {
        wx.showModal({
            title: '删除图片',
            content: '确定要删除这张图片？',
            cancelText: '否',
            confirmText: '是',
            success: res => {
                if(res.confirm){
                    this.setData({
                        "info.cover":'',
                        cover_num:this.data.cover_num-1
                    })
                }
                // if (res.confirm) {
                //     this.data.info.cover.splice(e.currentTarget.dataset.index, 1);
                //     this.setData({
                //         cover: this.data.cover
                //     })
                // }
            }
        })
    },//删除所选封面图
  DelQRImg(e) {
        wx.showModal({
            title: '删除图片',
            content: '确定要删除这张图片？',
            cancelText: '否',
            confirmText: '是',
            success: res => {
                if(res.confirm){
                    this.setData({
                        "info.QR_code":'',
                        QR_num:this.data.QR_num - 1
                    })
                }
                // if (res.confirm) {
                //     this.data.info.cover.splice(e.currentTarget.dataset.index, 1);
                //     this.setData({
                //         cover: this.data.cover
                //     })
                // }
            }
        })
    },//删除所选二维码
  chooseLocation() {
    let that = this;
    let obj = this.data.info;
    wx.chooseLocation({
      success(res){
          obj.location = {
            name:res.name,
            address:res.address,
            latitude:res.latitude,
            longitude:res.longitude,
          }
        console.log("res", res);
          that.setData({
            info:obj
          })
      }
    })
  },
  checkboxChange: function (e) {
      var checkboxItems = this.data.checkboxItems,
        values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if(checkboxItems[i].value == values[j]){
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },//记录舞种信息
  // addNumber(){
  //   let obj = this.data.info;
  //   if (obj.limit == '无限制'){
  //     obj.limit = 1;
  //   } else {
  //     obj.limit++;
  //   }
  //   this.setData({
  //     info:obj
  //   })
  // },//加人数
  // minusNumber(){
  //   let obj = this.data.info;
  //   if (obj.limit -1 == '0'){
  //     obj.limit = '无限制'
  //   }
  //   else {
  //     obj.limit--;
  //   }
  //   this.setData({
  //     info:obj
  //   })
  // },//减人数
  changeTitle(e){
    let obj = this.data.info;
    obj.title = e.detail.value;
    this.setData({
      info:obj
    })
  },//改变标题触发事件
  changeContent(e){
    let obj = this.data.info;
    obj.content = e.detail.value;
    this.setData({
      info:obj
    })
  },
  changeCondition(e){
    let obj = this.data.info;
    obj.condition = e.detail.value;
    this.setData({
      info:obj
    })
  },
  changeContact(e){
    let obj = this.data.contactItems;
    obj.forEach(item =>{
      item.flag = false
    })
    let infoObj= this.data.info;
    infoObj.contact = e.target.dataset.name
    obj.forEach(
        item =>{
           if (item.name == e.target.dataset.name){
             item.flag = true;
             this.setData({
                contactName:item.name,
                contactItems:obj,
                info:infoObj
             })
           }
        }
    )
  },//改变选择的联系方式
  changePhoneNumber(e){
     let obj = this.data.info;//设置中间值
     obj.phone =  e.detail.value;
     this.setData({
       info:obj
     })
    },
  // touchStart(e) {
  //   this.setData({
  //     "touch.x": e.changedTouches[0].clientX,
  //     "touch.y": e.changedTouches[0].clientY
  //   });
  // },
  // touchEnd(e) {
  //   let x = e.changedTouches[0].clientX;
  //   let y = e.changedTouches[0].clientY;
  //   let option = util.getTouchData(x,y,this.data.touch.x,this.data.touch.y);
  //   if (option === 'left'){
  //     if (this.data.step+1<6){
  //       switch (this.data.step) {
  //         case 0:if (this.data.info.identify === ''){
  //                 this.setData({
  //                   topTip:true
  //                 })
  //               }
  //               else { this.setData({
  //                   step:this.data.step+1,
  //                   basics:this.data.basics+1
  //                 })
  //               }
  //               break;
  //         case 1:if (this.data.info.type === ''){
  //                 this.setData({
  //                   topTip:true
  //                 })
  //               }
  //               else { this.setData({
  //                 step:this.data.step+1,
  //                 basics:this.data.basics+1
  //                })
  //               }
  //           break;
  //         case 2: let tipFlag = false;
  //                this.data.checkboxItems.forEach((item)=>{
  //                  if(item.checked){
  //
  //                     tipFlag = true
  //                  }
  //                })
  //                if (tipFlag){
  //                  this.setData({
  //                    step:this.data.step+1,
  //                    basics:this.data.basics+1,
  //                    topTip:false
  //                  })
  //                }
  //                else{
  //                  this.setData({
  //                    topTip:true
  //                  })
  //                }
  //                break;
  //         case 3: let formFlag = true
  //           for (let i in  this.data.info)
  //             {
  //               if (i==='location'){
  //                 if (this.data.info[i].name === '') {
  //                   this.setData({
  //                     topTip:true
  //                   })
  //                   formFlag = false
  //                 }
  //               }else if (i!='contact'&&i!='QR_code'&&i!='phone') {
  //                 if (this.data.info[i]=== '') {
  //                   this.setData({
  //                     topTip:true
  //                   })
  //                   formFlag = false
  //                 }
  //               }
  //             }
  //             if (formFlag){
  //               obj.time = `${this.data.timestamp.date} ${this.data.timestamp.time}`//一系列信息
  //               this.setData({
  //                 info:obj,//由中间量导入数据到info
  //                 step:this.data.step+1,//更新step
  //                 basics:this.data.basics+1,
  //                 topTip:false
  //               })
  //             }
  //             break;
  //       }
  //     }
  //   }
  //   if (option === 'right'){
  //     if (this.data.step -1>=0&&this.data.step!=5){
  //       this.setData({
  //         step:this.data.step-1,
  //         basics:this.data.basics-1,
  //         topTip:false
  //       })
  //     }
  //   }
  // }
    onReady(){
        var arr1 = new Array(100);
        for(var i=0;i<arr1.length;i++){
            arr1[i] = i+1;
        }
        this.setData({
           "numLimit" : arr1,
            cover_num : 0,
            QR_num: 0
        })
    }
})
