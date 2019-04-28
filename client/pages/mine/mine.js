import ajax from '../../utils/ajax'
import util from '../../utils/util'
Page({
    data:{
      userInfo:{}, //用户信息
      sign:'暂无签名TAT',
      openid:'',//该用户字段在数据库中存储对应的openid
    },
    toMineInfo(){
        //跳转到个人信息详情页，携带参数id
        wx.navigateTo({url:'../mine-person/mine-person?openid='+this.data.openid})
    },
    onLoad: function () {
      var that = this;
      //1.调用login云函数，取到返回的openid
      wx.cloud.callFunction(
          {
              name:"login",
          }
      ).then(res => {
          console.log("获取到用户的openid：",res.result.openid);
          //将openid字段保存
           that.setData({
               openid:res.result.openid
           })
          //根据openid查询数据库的user表，判断用户有无在小程序进行过登录操作
           ajax.find_page({_openid:res.result.openid},1,10,'user').then(res2 =>{
               console.log("获取到数据库中user表的用户信息：",res2)
               //如果表中无该用户的信息，新增一条
               if (res2.length == 0){util.getUserInfo({}).then(info =>{
                              console.log("通过getUserInfo查询获取到用户信息：",info.userInfo)
                              ajax.add(info.userInfo,'user') //将用户信息存入数据库
                              .then( that.setData({userInfo:info.userInfo})) //将获取到的用户信息传递给前端展示
                            })
                         }
               else {
                   //已获取到用户信息，前端可以直接进行展示
                   console.log("该用户已在小程序中登录，从数据库获取到用户信息：",res2[0])
                    that.setData({
                        userInfo:res2[0],
                        id:res2[0]._id
                    }) //将获取到的用户信息传递给前端展示
               }
           })
      })

    }, //页面加载完成时触发
    onShow: function () {

    }

})
