// runDB云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (method,event, context) => {
  const targetDB = db.collection(event.db)
  try {
    if(method == "insert"){
      return await targetDB.add({
        data: event.data
      })
    }

    if(method == "update"){
      return await targetDB.doc(event.indexKey).update({
        data: event.data
      })
    }

    if(method == "delete"){
      return await targetDB.where(event.condition).remove()
    }

    if(method == "get"){
      if (event.skip && event.limit){
        return await targetDB.where(event.condition)
            .skip(event.limit * event.skip)
            .limit(event.limit)
            .get()
      }
      else {
        console.log(event)
        return await targetDB.where(event.condition)
            .skip(0)
            .limit(10)
            .get()
      }
    }
  } catch (e) {
    console.error(e)
  }
}
