// 云函数入口文件
const cloud = require('wx-server-sdk');
const runDB = require('./database');
cloud.init();

const db = cloud.database();
const _ = db.command;
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
  if (event.method == 'getUserInfo') {
    console.log("请求参数：", event)
    let checkResult = await targetDB.where({ _openid: _.eq(event.openid) }).get();
    console.log("查询结果：", checkResult)
    if (checkResult.data.length == 0) {
      console.log("查找不到约舞发起者账户");
    } else {
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
      const targetDB = db.collection('dance-info');
      let  allMy = await  targetDB.doc(event.id).get();
           let a = allMy.data[0].applicant.forEach(item =>{
               if (item._openid === event.checkedId){
                   item.state = event.state
               }
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
        var myApply = [];
        var checkedApply = [];
        var checkedApply2 = [];
        let Apply = await targetDB.where()
            .get()
        Apply.data.forEach((item)=>{
            if(item._openid == event.openid){
                myApply.push(item);
            }
            item.applicant.forEach((val)=> {
                if (val._openid == event.openid){
                    if(val.state == "0"){
                        checkedApply.push(item)
                    }
                    if(val.state == "2"){
                        checkedApply2.push(item)
                    }
                }
            })
        })
        return {
            myApply:myApply,//我发起的
            checkedApply:checkedApply,//已通过的
            checkedApply2:checkedApply2//未通过的
        }
    }
  }


