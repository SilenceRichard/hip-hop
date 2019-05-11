// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')
cloud.init()

// getMineInfo = function(){
//   return "hhh"
// }
// 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
const wxContext = cloud.getWXContext()
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.method  == 'getMineInfo'){
    console.log("请求参数：",event)
    let checkResult= await runDB.main('get',{db:'user',condition:{"openid":event.openid}})
    console.log("查询结果：",checkResult)
    if (checkResult.data.length == 0){ //新用户登录

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
      let indexKey = event.userInfo._id;
      delete event.userInfo._id
      await runDB.main('update',{db:'user',indexKey:indexKey,data: event.userInfo})
      //通过集合上的 doc 方法来获取集合中一个指定 ID 的记录的引用
      return{
        status:'0' //返回状态0 表示更新成功！
      }
  }
}
