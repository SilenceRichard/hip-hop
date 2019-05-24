// 云函数入口文件
const cloud = require('wx-server-sdk');
const runDB = require('./database');

cloud.init();
const db = cloud.database();
const _ = db.command;
//时间参数
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();
const second = date.getSeconds();
const now = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');//获取时间


exports.main = async (event, context) => {
    if(event.method=="sendInfo"){
            var targetDB = db.collection('dance-info');
            var visit = 0;
            let obj = {
                _openid: event.openid,
                info: event.info,
                dance_id: event.info.id,
                state: '1' //‘0’通过 ‘1’审核中 ，‘2’未通过
            };
            let temp = await targetDB.doc(event.info.id).get();
            // console.log("查询结果：",temp.data)
            // console.log('applicant',temp.data.applicant)
            temp.data.applicant.forEach((item)=>{
                if(item._openid == event.openid)visit=1;
                }
            );
            if(visit == 0){
                let res = await targetDB.update(
                {data: {applicant:_.push(obj)}})
                return {
                    status: res
                }
            }
            else {
                return {
                    status:'1',
                    msg:'已报名，无需更新'
                }
            }
    }
    if(event.method=="getFunderInfo"){
        const targetDB = db.collection('user');
        let res = await targetDB.where({
            _id:event.id
        }).get();
        return {
            res:res
        }
    }
    if(event.method=="getInfo") {
        if (event.type == 'All'){
            let result = await db.collection('dance-info').where({time:_.gte(now)}).orderBy('clicktime','desc').get();
            console.log("---查到的结果- - ",result)
            result.data.splice(5);
            return{
                checkResult:result.data
            }
        }//全部约局
        if (event.type == 'time') {
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
          let result =await db.collection('dance-info').where({time:_.gte(now)}).get();//获取所有约舞信息
          function sortNumber(a, b) {
            let a_latitude_Dvalue = a.location.latitude - event.userLocation.latitude;//前一个点的纬度差值
            let a_longtitude_Dvalue = a.location.longtitude - event.userLocation.longtitude;//前一个点的经度差值
            let b_latitude_Dvalue = b.location.latitude - event.userLocation.latitude;//前一个点的纬度差值
            let b_longtitude_Dvalue = b.location.longtitude - event.userLocation.longtitude;//前一个点的经度差值

            let a_distance_square = Math.pow(a_latitude_Dvalue, 2) + Math.pow(a_longtitude_Dvalue, 2);//前一个点的距离平方
            let b_distance_square = Math.pow(b_latitude_Dvalue, 2) + Math.pow(b_longtitude_Dvalue, 2);//后一个点的距离平方

            return a_distance_square - b_distance_square
          }
          result.data = result.data.sort(sortNumber);

          // for (var j = result.data.length - 2; j >= 0; j--) {//冒泡排序法
          //   for (var i = 0; i <= j; i++) {
          //     let a_latitude_Dvalue = result.data[i].location.latitude - event.userLocation.latitude;//前一个点的纬度差值
          //     let a_longtitude_Dvalue = result.data[i].location.longtitude - event.userLocation.longtitude;//前一个点的经度差值
          //     let b_latitude_Dvalue = result.data[i + 1].location.latitude - event.userLocation.latitude;//前一个点的纬度差值
          //     let b_longtitude_Dvalue = result.data[i + 1].location.longtitude - event.userLocation.longtitude;//前一个点的经度差值
          //     let a_distance_square = Math.pow(a_latitude_Dvalue, 2) + Math.pow(a_longtitude_Dvalue, 2);//前一个点的距离平方
          //     let b_distance_square = Math.pow(b_latitude_Dvalue, 2) + Math.pow(b_longtitude_Dvalue, 2);//后一个点的距离平方
          //     if (a_distance_square > b_distance_square) //若前一个距离的平方大于后一个则交换
          //     {
          //         let temp = result.data[i];
          //         result.data[i] = result.data[i + 1];
          //         result.data[i + 1] = temp;
          //         console.log("交换了一次",i,i+1);
          //     }
          //   }
          // }

          console.log("按距离查询结果：", result.data);
          return {
            checkResult: result.data
          }
        }//按距离查询
        if (event.type == 'getByIndividual'){
            let result = await db.collection('dance-info').where({identify:_.eq('person'),time:_.gte(now)}).get();
            console.log(result)
            return{
                checkResult:result.data
            }
        }
        if (event.type == 'getByOfficial'){
            let result = await db.collection('dance-info').where({identify:_.eq('official'),time:_.gte(now)}).get();
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
          let result = await targetDB.where({time:_.gte(now)}).orderBy('clicktime', 'desc').get();//获取
          console.log("查询结果：",result.data);
          //console.log("result.data.checkResult", result.data.checkResult);
          result.data.splice(5);
          return {
            checkResult: result.data
          }
        }//查找到的最热的五条约舞
        if (event.type == 'keyword') {

          //存储用户的搜索历史
          let result_ = await db.collection('user').where({_openid:event.openid}).get();
          let thehistory = result_.data[0].history;
          if (thehistory.length == 0)
          {
            let thehistory = [];
          }
          thehistory.push(event.info);
          db.collection('user').where({ _openid: event.openid }).update({
            data: {
              history: thehistory
            }
          })

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
               if (i ==='dance_type_search'||i==='location_search'||i==='title'||i==='authorName'){
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
          let result = await db.collection('user').get();//获取全部
          let  worddata = [];
          result.data.forEach((item)=>{
            if(item.history!=undefined){
                worddata = worddata.concat(item.history)
            } //合并热搜数组 ['词汇1'，'词汇2'...]
          });
          let resultArr = worddata.map((item)=>{
              let obj = {name:item,time:0};
              worddata.forEach(val =>{
                  if (val===item){
                      obj.time++;
                  }
              })
              return obj;
          })
            console.log("resultArr:",resultArr)
            //去重
           let  resultArr2 = [];
           resultArr.forEach((item,idx)=>{
               //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
               if (worddata.indexOf(item.name) == idx) {
                   resultArr2.push(item);
               }
           })
           console.log("去重：",resultArr2)
           //排序
           const sortArr = function(a,b){
              if (a.time > b.time) return -1;
              if (a.time < b.time) return 1;
           }
           let max = resultArr2.sort(sortArr).slice(0,9);  //选取10条
           let checkResult = max.map(item =>{
               return item.name
           })
          // worddata.map((item,idx,arr) =>{
          //     let obj = {};
          //     arr.forEach(val =>{
          //         if (item === val)
          //     })
          // })
          //todo 这下面是小辉写的
          // //获取所有关键字及相应的搜索数
          // for (var i = 0; i <= result.data.length-1;i++){
          //   for (var j = 0; j <= result.data[i].history.length - 1; j++) {
          //     for (var k = 0, flag = 0; k <= worddata.length - 1; k++){
          //       if (worddata[k].word == result.data[i].history[j]){
          //         flag=1;
          //         worddata[k].times ++;
          //       }
          //     }//遍历worddata数组，若没有查到则以 flag == 0 退出
          //     if (flag == 0){
          //       worddata.push({word:result.data[i].history[j], times: 1 });
          //     }
          //   }
          // }
          //
          // //根据搜索数排序
          // for (var j = worddata.length - 2; j >= 0; j--) {//冒泡排序
          //   for (var i = 0; i <= j; i++) {
          //     if (worddata[i].times < worddata[i+1].times){
          //       //交换
          //       let temp = worddata[i];
          //       worddata[i] = worddata[i+1];
          //       worddata[i + 1] = temp;
          //     }
          //   }
          // }
          //
          // var words = [];//词汇数组
          // for (var i = 0; i <= worddata.length - 1; i++) {
          //   words.push(worddata[i].word);
          // }
          return {
            checkResult: checkResult
          }
        }//热门搜索标签
        if (event.type == 'history') {
          let result = await db.collection('user').where({_openid:event.openid}).get();
            let resultArr = [];
            if (result.data[0].history!=undefined){
                result.data[0].history.forEach((item,idx) =>{
                    if (result.data[0].history.indexOf(item) == idx){
                        resultArr.push(item)
                    }
                })
                resultArr = resultArr.slice(0,9);
                //筛选去重  选取历史前10条
                return {
                    checkResult: resultArr
                }
            }else {
                let obj = result.data[0];
                obj.history = []; //为对象增加history属性
                delete obj._id;
                await db.collection('user').where({_openid:event.openid}).update({data:obj});
                return {
                    checkResult:[]
                }
            }


        }//该用户的历史搜索记录标签
    }
    if(event.method == "getAppointInfo"){
      let result = await db.collection('dance-info').where({ _id: _.eq(event.info) }).get();
      db.collection('dance-info').doc(event.info).update({
        data: {
          clicktime: _.inc(1)
        }
      })
      console.log("result.data",result.data);
      return {
        checkResult: result.data
      }
    }//根据_id查找到的约局详情
}
