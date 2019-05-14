// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')

cloud.init()
const db = cloud.database();
const _ = db.command;

const date = new Date();
const year = date.getFullYear()
const month = date.getMonth() + 1
const day = date.getDate()
const hour = date.getHours()
const minute = date.getMinutes()
const second = date.getSeconds()

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.method=="getInfo") {
    if (event.type == 'All'){
      let result = await runDB.main('get',{db:'dance-info',condition:{}});
      return{
        checkResult:result.data
      }
    }
    if (event.type == 'time'){
      const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
       let now = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
       const targetDB = db.collection('dance-info');
       let result =await targetDB.where({time:_.gte(now)}).get();
       console.log(result)
      function sortNumber(a,b)
      {
         if (a.time<b.time) {
           return -1
         }
        else if (a.time == b.time) {
          return 0
         }
        else if (a.time>b.time){
          return 1
         }
      }
      result.data.sort(sortNumber)
      return{
        checkResult:result.data
      }
    }
      if (event.type == 'location'){
          let result = await runDB.main('get',{db:'dance-info',condition:{}});//获取所有

      }
      if (event.type == 'getByIndividual'){
          let result = await db.collection('dance-info').where({identify:_.eq('person')}).get();
          console.log(result)
          return{
              checkResult:result.data
          }
      }
      if (event.type == 'getByOfficial'){
          let result = await db.collection('dance-info').where({identify:_.eq('official')}).get();
          console.log(result)
          return{
              checkResult:result.data
          }
      }
  }
}
