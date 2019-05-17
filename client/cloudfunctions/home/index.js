// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')

cloud.init()
const db = cloud.database();
const _ = db.command;


exports.main = async (event, context) => {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
    if(event.method=="getInfo") {
        if (event.type == 'All'){
            let result = await runDB.main('get',{db:'dance-info',condition:{}});
            return{
                checkResult:result.data
            }
        }
        if (event.type == 'time') {
          const formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
          }
          let now = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
          const targetDB = db.collection('dance-info');
          let result = await await targetDB.orderBy('time', 'asc').get();//获取
          for (var i = 0; i < result.data.length-1; i++) {//去掉过时的
            if(result.data[i].time<now){
              result.data.splice(i,1); 
            }
          }
          console.log(result);
          return {
            checkResult: result.data
          }
        }
        if (event.type == 'location'){
            let result = await runDB.main('get',{db:'dance-info',condition:{}});//获取所有
            console.log("获取所有：", result);
              for (var j = result.data.length - 2; j >= 0; j--) {//冒泡排序
                for (var i = 0; i <= j; i++) {
                  if (Math.sqrt((result.data[i].location.latitude - event.userLocation.latitude) * (result.data[i].location.latitude - event.userLocation.latitude) + (result.data[i].location.longitude - event.userLocation.longitude) * (result.data[i].location.longitude - event.userLocation.longitude)) > Math.sqrt((result.data[i + 1].location.latitude - event.userLocation.latitude) * (result.data[i + 1].location.latitude - event.userLocation.latitude) + (result.data[i + 1].location.longitude - event.userLocation.longitude) * (result.data[i + 1].location.longitude - event.userLocation.longitude))) //若前一个大于后一个
                  {//交换
                     let temp = result.data[i];
                     result.data[i] = result.data[i + 1];
                     result.data[i + 1] = temp;
                     console.log("交换了一次");
                  }
                }
              }
          console.log(result);
          return {
            checkResult: result.data
          }
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

// 云函数入口函数

}
