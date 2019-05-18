// 云函数入口文件
const cloud = require('wx-server-sdk')
const runDB = require('./database')

cloud.init()
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {

  //时间参数
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
          let now = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');//获取时间
          const targetDB = db.collection('dance-info');
          let result = await targetDB.orderBy('time', 'asc').get();//获取
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
          console.log("结果：",result);
          return {
            checkResult: result.data
          }
        }//（未完成，有BUG)
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
        if (event.type =='getAdvertise'){
          let result = await runDB.main('get', { db: 'advertise', condition: {} });
          return {
            checkResult: result.data
          }
        }//获取广告
        if (event.type == 'getNewsInfo') {
          const targetDB = db.collection('dance-info');
          let result = await targetDB.orderBy('clicktime', 'desc').get();//获取
          return {
            checkResult: result.data
          }
        }//查找到的最热的五条
        if (event.type == 'keyword') {

          db.collection('user').doc(event.openid).update({
            data: {
              history: _.push([event.info])
            }
          })//存储用户的搜索历史

          let searchInfo = event.info.toLowerCase();
          let result = await db.collection('dance-info').where({}).get();//获取
          let a =result.data.map(item=>{
              item.dance_type_search = [];
              item.dance_type.forEach(val =>{
                if (val.checked){
                   item.dance_type_search.push(val.name.toLowerCase()) 
                }
              })
              item.location_search = item.location.name.toLowerCase();
              return item
          })
          let result0=[];
          a.forEach(item=>{
             for (i in item)
             {
               if (i ==='dance_type_search'||i==='location_search'){
                 if (JSON.stringify(item[i]).indexOf(searchInfo)!=-1){
                    result0.push(item)
                 }
               }
             }
          })
          // let result1 = [];
          // result0.forEach(item=>{
          //   if (item.flag==true) result1.push(item)
          // })
          return {
            checkResult:result0
          }
        }//搜索
        if (event.type == 'hot') {
          let result = await runDB.main('get', { db: 'user', condition: {} });//获取全部
          let worddata = [];
          for (var i = 0; i <= result.data.length-1;i++){
            for (var j = 0; j <= result.data[i].history.length - 1; j++) {
              for (var k = 0, flag = 0; k <= worddata.length - 1; k++){
                if (worddata[k] == result.data[i].history[j]){
                  flag=1;
                  worddata[k].times ++;
                }
              }
              if (flag == 0){
                worddata.push = {word:result.data[i].history[j], times: 0 };
              }
            }
          }
          return {
            checkResult: worddata
          }
        }//热门搜索标签（未完成）
        if (event.type == 'history') {
          let result = await db.collection('user').where({ _openid: event.openid}).get();
          console.log(result.data[0].history);
          return {
            checkResult: result.data[0].history
          }
        }//该用户的历史搜索记录标签
    }
    if (event.method == "getAppointInfo") {
      let result = await db.collection('dance-info').where({ _id: _.eq(event.info) }).get();
      db.collection('dance-info').doc(event.info).update({
        data: {
          clicktime: _.inc(1)
        }
      })
      console.log(result);
      return {
        checkResult: result.data
      }
    }//根据_id查找到的约局详情
}
