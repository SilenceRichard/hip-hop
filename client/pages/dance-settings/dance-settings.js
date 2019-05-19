// pages/dance-settings/dance-settings.js
import util from '../../utils/util'
const app = getApp();
Page({
  data: {
    step:0, //记录填报表单的步骤数
    info:{
      limit:1,
      location:{
        name:'',
        address:'',
        latitude:'',
        longtitude:''
      }
    },//存入数据库的约局信息对象
    checkboxItems: [
      {name: 'Hiphop', value: 'Hiphop', checked: true},
      {name: 'Popping', value: 'Popping'},
      {name: 'Locking', value: 'Locking'},
      {name: 'Breaking', value: 'Breaking'},
      {name: 'Waacking', value: 'Waacking'},
      {name: 'House', value: 'House'},
      {name: 'Jazz', value: 'Jazz'},
      {name: 'Urban', value: 'Urban'},
      {name: 'Krumping', value: 'Krumping'},
      {name: 'Reggae', value: 'Reggae'},
      {name: '不限', value: '不限'},
    ],//记录舞种信息
    contactItems:[{name:'手机号',flag:false},{name:'微信',flag:false},{name:'微信群聊',flag:false}], //联系方式
    timestamp:{
      date:util.formatDate(new Date()),
      time:"00:00"
    },//时间戳
    contactName:'', //当前选择联系方式项
  },
  setInfo(ev){//点击事件
    console.log(ev)
    let obj = this.data.info;//信息中间量
    let step0 = this.data.step;//step中间量
    step0 ++;
    if (this.data.step == 0){//如果是第一步
      obj.identify = ev.target.dataset.identify; //身份
    }
    if (this.data.step == 1) {//如果是第二步
      obj.type = ev.target.dataset.type; //活动形式
    }
    if (this.data.step == 2){//如果是第三步
      obj.dance_type = this.data.checkboxItems;//舞种
    }
    if (this.data.step == 3) {//如果是第四步
      obj.time = `${this.data.timestamp.date} ${this.data.timestamp.time}`//一系列信息
    }
    if (this.data.step == 4){//如果是第五步
       wx.cloud.callFunction({
           name:"dance",
           data:{
               method:'danceSettings',
               info:this.data.info,
               openid:app.data.openid
           },
           success(res) {
               console.log(res)
           }
       })
    }//上传至云端
    this.setData({
      info:obj,//由中间量导入数据到info
      step:step0//更新step
    })
  },
  bindDateChange(ev){
    console.log(ev);
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
  chooseImage() {//上传图片点击事件
      let that = this;
      let obj = this.data.info;
      wx.chooseImage({
        count:1,
        success:function(res){
          obj.cover = res.tempFilePaths[0] //保存图片路径
          that.setData({
             info:obj
          })
        }
      })
  },
  chooseImageQR(){
    let obj = this.data.info;
    let that = this;
    wx.chooseImage({count:1,
      success:function (res) {
      obj.QR_code = res.tempFilePaths[0]
        that.setData({
          info:obj
        })
       }
    })
  },
  chooseLocation() {
    let that = this;
    let obj = this.data.info;
    wx.chooseLocation({
      success(res){
          obj.location = {
            name:res.name,
            address:res.address,
            latitude:res.latitude,
            longtitude:res.longtitude
          }
          that.setData({
            info:obj
          })
      }
    })
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var checkboxItems = this.data.checkboxItems,
        values = e.detail.value;
       console.log(values)
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
  addNumber(){
    let obj = this.data.info;
    if (obj.limit == '无限制'){
      obj.limit = 1;
    } else {
      obj.limit++;
    }
    this.setData({
      info:obj
    })
  },//加人数
  minusNumber(){
    let obj = this.data.info;
    if (obj.limit -1 == '0'){
      obj.limit = '无限制'
    }
    else {
      obj.limit--;
    }
    this.setData({
      info:obj
    })
  },//减人数
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
})
