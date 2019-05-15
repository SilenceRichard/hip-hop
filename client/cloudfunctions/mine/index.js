// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')
cloud.init()

const db = cloud.database();
const _ = db.command;
// getMineInfo = function(){
//   return "hhh"
// }
// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
const wxContext = cloud.getWXContext()
// 云函数入口函数
exports.main = async (event, context) => {
    const targetDB = db.collection('user')
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
}
