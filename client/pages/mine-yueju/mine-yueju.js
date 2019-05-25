import regeneratorRuntime from '../../utils/wxPromise.min.js' //引入async await语法糖
var app = getApp();
Page({
    data:{
        myJoined:[],
        mySetted:[],
        flag:'fq',  //导航标志，我发起的/我加入的
        tabList:[{name:'我发起的',type:'fq'},{name:'我加入的',type:'jr'}],
        TabCur:0,
    },
    goTo(ev){
        console.log(ev)
        if (ev.currentTarget.dataset.type=="fq"){
            this.setData({
                TabCur:ev.currentTarget.dataset.id,
                flag:'fq'
            })
        }
        else if(ev.currentTarget.dataset.type=="jr"){
            this.setData({
                TabCur:ev.currentTarget.dataset.id,
                flag:'jr'
            })
        }
    },
    onReady:async function () {
        console.log("请求参数:",{
            method:"getMyAppoint",
            openid:app.data.openid
        })
      let res =await wx.cloud.callFunction({
          name:"mine",
          data:{
              method:"getMyAppoint",
              openid:app.data.openid
          }
      })
      console.log("RES:",res)
        res.result.overDance.map(item=>{
            item.overFlag = true; //过期标志
            return item
        })
        res.result.sentOverDance.map(item =>{
            item.overFlag = true;
            return item;
        })
        let danceArr = res.result.Dance.concat(res.result.overDance);
        let sentArr = res.result.sentDance.concat(res.result.sentOverDance);
        danceArr.map(item =>{
            let a =[]; //处理舞种
            item.dance_type.map(val=>{
                if (val.checked){
                    a.push(val.name)
                }
            })
            item.dance_type_show = a;
            return item
        })
        sentArr.map(item =>{
            let a =[]; //处理舞种
            item.dance_type.map(val=>{
                if (val.checked){
                    a.push(val.name)
                }
            })
            item.dance_type_show = a;
            return item
        })
      this.setData({
          myJoined:danceArr,
          mySetted:sentArr
      })
    }
})
