// 云函数入口文件
const cloud = require('wx-server-sdk');
const runDB = require('./database');
cloud.init();

const db = cloud.database();
const _ = db.command;
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// getMineInfo = function(){
//   return "hhh"
// }
// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
const wxContext = cloud.getWXContext();
// 云函数入口函数
exports.main = async (event, context) => {
    const targetDB = db.collection('user');
  if (event.method  == 'getMineInfo'){
    console.log("请求参数：",event)
    let checkResult= await targetDB.where({_openid:_.eq(event.openid)}).get();
    console.log("查询结果：",checkResult)
    if (checkResult.data.length == 0){ //新用户登录
      await targetDB.add({data:{_openid:event.openid}})
      return{
        status:'1' //更新用户信息标识
      }
    }else { //老用户登录
      let res = checkResult.data[0]
      return {
        res
      }
    }
  }
  //更新数据库
  if (event.method == 'updateMineInfo'){
       const targetDB = db.collection('user');
       console.log(`请求参数${event}`)
       let  indexKey = event.info._id;
       delete  event.info._id;
       // delete  event.userInfo._openid;
       let data = event.info;
       data._openid = event.openid;
       let status = await targetDB.doc(indexKey).update({data:data}) //根据查询到的_id更新
      //通过集合上的 doc 方法来获取集合中一个指定 ID 的记录的引用
      return{
        status:status //返回状态staus
      }
  }
  if(event.method == 'getMyAppoint'){
      const targetDB = db.collection('dance-info');
      var  Dance = [];
      var  sentDance = [];
      let Apply = await targetDB.where()
          .get()
      Apply.data.forEach((item)=>{
          if(item._openid == event.openid){
              sentDance.push(item);
          }
          item.applicant.forEach((val)=> {
              if (val._openid == event.openid){
                  Dance.push(item)
              }
          })
      })
      return {
          sentDance:sentDance,
          Dance:Dance
      }
  }
  if(event.method == 'exam'){
      console.log("参数",event)
      const targetDB = db.collection('dance-info');
      let  allMy = await  targetDB.doc(event.id).get();
          let a=allMy.data.applicant.map(item =>{
               if (item._openid === event.checkedId){
                   item.state = event.state
               }
               return item
           })
           await  targetDB.doc(event.id).update({data:{
                    applicant:a
               }})
      return{
               status:a
      }
  }
  if(event.method == 'getSystemInfo'){
        const targetDB = db.collection('dance-info');
        var myTeamedDance = [];
        var myUpTimeDance = [];
        var uncheckedApply = [];
        var checkedApply = [];
        var checkedApply2 = [];
        var date0 = new Date()
        var time0 = formatTime(date0)//当前时间
        let Apply = await targetDB.where()
            .get()
        Apply.data.forEach((item)=>{
            if(item.openid == event.openid) {
                    let t = 0;
                    item.applicant.forEach(val => {
                        if (val.state == '0') t++
                    })
                    if (t == item.limit && time0<item.time) {
                        myTeamedDance.push(item);
                    }
                    item.applicant.forEach(val => {
                        if (item.time <= time0 && t<= item.limit) {
                            myUpTimeDance.push(item)
                        }
                        if (val.state == '1'&&time0<=item.time) {
                            uncheckedApply.push(val)
                        }
                    })
                }
                item.applicant.forEach((val) => {
                    if (val._openid == event.openid){
                        if (val.state == "0") {
                            checkedApply.push(item)
                        }
                        if (val.state == "2") {
                            checkedApply2.push(item)
                        }
                    }
                })

        })
        return {
            myTeamedDance:myTeamedDance,//我发起的组队成功的约舞 xt
            myUpTimeDance:myUpTimeDance,//我发起的时间已到且未组队成功的约舞 xt
            uncheckedApply:uncheckedApply,//我发起的约舞未审核的applicant信息 hd
            checkedApply:checkedApply,//我参加已通过的 hd
            checkedApply2:checkedApply2//未通过的 hd
        }
    }
  }


