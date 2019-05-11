import ajax from '../../utils/ajax'
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();
Page({
    data:{
      userInfo:{
          nickName:'',
          gender:'',
          avatarUrl:''
      }, //用户信息
      sign:'暂无签名TAT',
      // openid:'',//该用户字段在数据库中存储对应的openid
    },
    getUSER(){
      wx.getUserInfo({
        "open-type":'getUserInfo',
        success:function(res){
          console.log(res) 
        },
        complete:function(res){
          console.log(res)
        }
      })
    },
    toMineInfo(){
        //跳转到个人信息详情页，携带参数id
        wx.navigateTo({url:'../mine-person/mine-person?openid='+app.data.openid})
    },
    onReady:async function () {
      //关于数据库的操作，使用云函数
      //   let info =  await util.getUserInfo({});//获取用户数据
        let result = await wx.cloud.callFunction({
            name:"mine",
            //传给云函数的请求参数，在云中为event.属性名
            data: {
                method:"getMineInfo",
                openid:app.data.openid,
            },
        })//将用户数据传到云函数
        console.log(result)//打印
        if (result.result.status == '1'){
            wx.showToast({
                title:'请更新用户信息！',
                duration:1000
            })
        }
        else {
            this.setData({
                userInfo:result.result.res
            })
        }

        // await wx.showLoading({title:'加载中'})
        //这段JS代码是为了获取用户存储在数据库中的信息并展示，
        //对于前端来说，合理的设计模式是只关心发起请求和拿到数据的行为，不要暴露太多业务逻辑的操作！所以之前的写法是存在问题的
        // let res2 = await ajax.find_page({_openid:app.data.openid},1,10,'user');
        // console.log("获取到数据库中user表的用户信息：",res2)
        // //如果表中无该用户的信息，新增一条
        // if (res2.length == 0) {
        //    let info =  await util.getUserInfo({});
        //     console.log("通过getUserInfo查询获取到用户信息：",info.userInfo)
        //    await ajax.add(info.userInfo,'user') //将用户信息存入数据库
        //          that.setData({userInfo:info.userInfo})//将获取到的用户信息传递给前端展示
        // }
        // else {
        //     //已获取到用户信息，前端可以直接进行展示
        //     console.log("该用户已在小程序中登录，从数据库获取到用户信息：",res2[0])
        //     that.setData({
        //         userInfo:res2[0],
        //         id:res2[0]._id
        //     }) //将获取到的用户信息传递给前端展示
        // }
        // await  wx.hideLoading();

    }, //页面加载完成时触发
    onShow: async function () {
        //页面出现时不断地更新数据,因为onShow周期会在onReady周期前执行一次，所以加一层判断

    }
})
