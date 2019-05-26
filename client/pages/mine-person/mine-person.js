import ajax from '../../utils/ajax'
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();
Page({
    data:{
      userInfo:{}, //用户信息
      edit:false, //编辑标志
      open: false, //舞种选择框
      // gender:[
      //     {name: '保密', value: '0'},
      //     {name: '男生', value: '1'},
      //     {name: '女生', value: '2'}
      // ],
      genterarray:["保密","男生","女生"],
      region: ['广东省', '广州市', '海珠区'],
      identyarray:["学生", "其他社会人员"],
      agearray: ["一年以下", "一到三年", "三年以上"],
        danceType: [
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
        // danceType:[
        //     {name:'Hiphop',checked: false,class:'cu-tag round bg-orange light'},
        //     {name:'Breaking',checked: false,class:'cu-tag round bg-olive light'},
        //     {name:'Popping',checked: false,class:'cu-tag round bg-blue light'},
        //     {name:'Locking',checked: false,class:'cu-tag round bg-white light'},
        //     {name:'Jazz',checked: false,class:'cu-tag round  bg-yellow light'},
        //     {name:'Weacking',checked: false,class:'cu-tag round bg-green light'},
        //     {name:'Urban',checked: false,class:'cu-tag round bg-cyan light'},
        //     {name:'其他',checked: false,class:'cu-tag round bg-purple light'}
        //     ], //舞种
        danceAge:[
            {name:"lessOne",value:"一年以下",checked:false},
            {name:"oneToThree",value:"一到三年",checked:false},
            {name:"moreThree",value:"三年以上",checked:false},
        ],//舞龄
        openid:'',//操作用户的openid
        showTopTips:false, //错误提示标志
        showModalFlag:false,
    },
    changeImage: function(){
        let that = this;
        wx.chooseImage({
            count: 1,
            success(chooseResult){
                wx.cloud.uploadFile({
                    cloudPath: util.uuid()+'my-person-photo.png',
                    filePath: chooseResult.tempFilePaths[0],
                    success: res => {
                        that.setData({
                            "userInfo.avatarUrl": res.fileID,//云存储图片路径
                        });
                    },
                })
            },
        })
    },
    changeSex: function (e) {
      this.setData({
        "userInfo.gender": e.detail.value
      })
      console.log("性别变为", e.detail.value);
      //  util.showActionSheet({itemList:['保密','男生','女生']}).then(res =>{
      //     if (res.tapIndex == 0){
      //         let info = this.data.userInfo;
      //         info.gender = '0';
      //         this.setData({
      //             userInfo:info
      //         })
      //     }
      //     else if(res.tapIndex == 1){
      //         let info = this.data.userInfo;
      //         info.gender = '1';
      //         this.setData({
      //             userInfo:info
      //         })
      //     }
      //     else {
      //         let info = this.data.userInfo;
      //         info.gender = '2';
      //         this.setData({
      //             userInfo:info
      //         })
      //     }
      //  })
    }, //性别单选项改变事件
    openchooseDanceType: function (e) {
      this.setData({
        "userInfo.open": 1
      })
      console.log("open设为", this.data.userInfo.open)
    },//打开选择框
    closechooseDanceType: function (e) {
      this.setData({
        "userInfo.open": 0
      })
    },//关闭选择框
    bindDateChange: function (e) {
        let  info = this.data.userInfo;
        info.birthday = e.detail.value;
        this.setData({
            userInfo:info
        })
    }, //日期改变时的相关处理
    regionChange: function (e) {
      // let info = this.data.userInfo;
      // info.birthday = e.detail.value;
      this.setData({
        "userInfo.region": e.detail.value
      })
      console.log("地址改变为", e.detail.value)
    }, //地址改变时的相关处理
    chooseDanceType:function (e) {
        console.log(e.detail.value)
        let arr =  e.detail.value; //勾选事件传递的数组
        let type =  this.data.danceType; //用type记录data中的舞种
        type.forEach(item =>{
            item.checked = false;
        }) //先把默认勾选状态赋予否
        arr.forEach(item =>{
            type.forEach(val => {
                if (item == val.name){
                    val.checked = true;
                }
            })
        })
        let info = this.data.userInfo;
        info.danceType = type;
        console.log(type)
        this.setData({
            userInfo:info,
            danceType:type
        })
    }, //选择舞种类型
    chooseDanceAge:function(e){
        this.setData({
          "userInfo.danceAge": e.detail.value
        })
      console.log("舞龄变为", e.detail.value);
    }, //选择舞龄
    changeInputVal:function(e){
      console.log("进入changeInputVal,e",e);
        let info = this.data.userInfo;
        info[e.target.dataset.type] = e.detail.value; //将info对应的属性值改变
        this.setData({
                userInfo:info
        })
    }, //根据输入框的值改变userInfo
    changeRole: function (e) {
      this.setData({
        "userInfo.role": e.detail.value
      })
      console.log("身份", e.detail.value);
    },//改变身份
    showModal: function (e) {
      this.setData({
          showModalFlag:true
      })
      console.log("舞种变为", e.detail.value);
    },//改变舞种
    hideModal: function(){
        this.setData({
            showModalFlag:false
        })
    },
    saveUserInfo:async function(){
        var that = this;
        console.log(this.data.userInfo)
        this.data.userInfo.openid = app.data.openid
        console.log('更新信息-----',this.data.userInfo)
       let result = await wx.cloud.callFunction({
            name:'mine',
            data:{
                method:'updateMineInfo',
                info:this.data.userInfo,
                openid:app.data.openid
            }
        })
        console.log('更新返回值---',result)
        await   wx.showToast({
                                title: '用户信息已更新!',
                                icon: 'success',
                                duration: 3000
                            })
        this.setData({edit:false});
        // ajax.find_page({"_openid":that.data.openid},1,10,'user')
        //     .then(res =>{
        //         let id = res[0]._id;
        //         delete that.data.userInfo._openid;
        //         delete that.data.userInfo._id;
        //         ajax.update(res[0]._id,that.data.userInfo,'user').then(
        //             util.showToast({
        //                 title: '用户信息已更新!',
        //                 icon: 'success',
        //                 duration: 3000
        //             }).then(
        //                 ()=>{
        //                     that.setData({
        //                         edit:false
        //                     })
        //                 }
        //
        //             )
        //         )
        //     })

        //错误提示，暂不用此逻辑，后期需加上
        // this.setData({
        //     showTopTips: true
        // });
        // setTimeout(function(){
        //     that.setData({
        //         showTopTips: false
        //     });
        // }, 3000);
    }, //保存用户信息
    editUserInfo: function(){
      this.setData(
          {
              edit:true
          }
      )
    }, //启用编辑
    onLoad:async function (info) {
        //在页面加载时，根据传过来的id，查询数据库中的用户信息
        //小程序的路由传参 和get请求一样 ?后拼接参数进行传递
        //接受参数的形式为一对象
        console.log("参数传过来啦-----",info.openid)
        var that = this;
        that.setData({
            openid:info.openid
        })
        let result = await wx.cloud.callFunction({
            name:"mine",
            // 传给云函数的请求参数，在云中为event.属性名
            data: {
                method:"getMineInfo",
                openid:app.data.openid,
            },
        })
        if ( typeof result.result.res !='undefined'){
          this.setData({
            userInfo: result.result.res
          })
        }
        //如果该用户之前填写过默认舞种 ，则做处理，默认勾选
        if ( typeof this.data.userInfo.danceType!= 'undefined'){
            this.setData({
                danceType:this.data.userInfo.danceType
            })//如果该用户之前填写过默认舞种 ，则做处理，默认勾选
        }
        //如果该用户之前填写过默认舞龄 ，则做处理，默认勾选
        if ( typeof this.data.userInfo.danceAge != 'undefined'){
            let arr = this.data.danceAge;
            arr.forEach(item =>{
                if (item.name == this.data.userInfo.danceAge){
                    item.checked = true
                }
            })//如果该用户之前填写过默认舞龄 ，则做处理，默认勾选
            that.setData({
                danceAge:arr
            })
        }
    },
})
