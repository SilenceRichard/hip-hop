import ajax from '../../utils/ajax'
import util from '../../utils/util'
import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
const app = getApp();
console.log(app)
Page({
    data:{
      userInfo:{
          nickName:'',
          gender:'',
          avatarUrl:''
      }, //用户信息
      sign:'暂无签名TAT',
      openid:'',//该用户字段在数据库中存储对应的openid
    },
    toMineInfo(){
        //跳转到个人信息详情页，携带参数id
        wx.navigateTo({url:'../mine-person/mine-person?openid='+this.data.openid})
    },
    onReady:async function () {
      var that = this;
        await wx.showLoading({title:'加载中'})
        that.setData({
            openid:app.data.openid
        })
        let res2 = await ajax.find_page({_openid:app.data.openid},1,10,'user');
        console.log("获取到数据库中user表的用户信息：",res2)
        //如果表中无该用户的信息，新增一条
        if (res2.length == 0) {
           let info =  await util.getUserInfo({});
            console.log("通过getUserInfo查询获取到用户信息：",info.userInfo)
           await ajax.add(info.userInfo,'user') //将用户信息存入数据库
                 that.setData({userInfo:info.userInfo})//将获取到的用户信息传递给前端展示
        }
        else {
            //已获取到用户信息，前端可以直接进行展示
            console.log("该用户已在小程序中登录，从数据库获取到用户信息：",res2[0])
            that.setData({
                userInfo:res2[0],
                id:res2[0]._id
            }) //将获取到的用户信息传递给前端展示
        }
        await  wx.hideLoading();

    }, //页面加载完成时触发
    onShow: async function () {
        //页面出现时不断地更新数据,因为onShow周期会在onReady周期前执行一次，所以加一层判断
        if (this.data.openid!=''){
            util.showLoading({title:'加载中'}).then(
                ajax.find_page({_openid:this.data.openid},1,10,'user')
                    .then(res =>{
                        this.setData({
                            userInfo:res[0]
                        })
                    })
                    .then(util.hideLoading())
            )
        }
    }

})
