// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.method == 'danceSettings'){
     let obj = event.info;
     obj.openid = event.openid;
     obj._openid = event.openid;
     await runDB.main('insert',{db:'dance-info',data:obj});
     return {
       status:'0'  //新增信息成功！
     }
  }

}
