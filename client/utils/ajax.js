/*
 Created by Zhao on 2019/4/27 主要解决小程序增删改的基本请求操作
 */
const app = getApp();
var service = {};
const db = wx.cloud.database({
    config: {
        env: app.globalData.env, //云开发控制台的环境ID
    }
}); //云数据库配置

//目前微信云开发的数据库get方法只能每次最多20条数据。如果我们想获取集合中的所有数据，就要联合使用count、skip和limit函数进行递归获取。
//
// count函数：返回指定条件下（where）的内容数量。
// skip函数：接受一个int类型的参数n，代表第n个结果后开始返回。
// limit函数：接受一个int类型参数m，代表每次获取m个item。

service.find_page = function (params,page,size,collection) {
    const tb = db.collection(collection); //获取表名
    var p = new Promise(function (resolve, reject) {
        page = page - 1;
        if (page > 0) {
            tb.where(params)
                .skip(page * size)
                .limit(size)
                .get().then(res => { resolve(res.data) })
                      .catch(err => { reject(err) })
        }
    else {
            tb.where(params)
                .limit(size)
                .get().then(res => { resolve(res.data) })
                      .catch(err => { reject(err) })
        }
    })
    return p;

} //分页查询，params查询参数，page页码，size每页条目数，collection表名
//我们这里创建一个flag_pop的函数用于递归，通过page变量决定是否递归，
// page是通过count函数和size进行计算而来的页数，向前进一确保数据不会遗漏。
service.find_all = function(params,collection){
    const tb = db.collection(collection); //获取表名
    var p = new Promise(
        function (resolve, reject) {
            let p = [];
            tb.where(params).count().then((res) => {
                let page = Math.ceil(res / 20, 10);
            flag_pop(params, 20, page, collection,[]).then(res => {
                resolve(res)
            })
        })
        }
    )
    return p
}
function flag_pop(params, size, page, collection,result) {
    return new Promise(
        function (resolve, reject) {
            service.find_page(params, page, 20,collection).then((e) => {
                result = result.concat(e);
                if (page - 1 > 0) {
                    resolve(flag_pop(params, 20, page - 1, result))
                } else {
                    resolve(result);
                }
            })
        }
    )
}
//查询全部数据

service.add = function(params,collection){
    const tb = db.collection(collection); //获取表名
    var p = new Promise(function (resolve,reject) {
       tb.add({data:params}).then (res =>{
           resolve(res.data)
       }).catch( err =>{
           reject(err)
        })
    })
    return p;
}//新增一条数据

service.remove = function(id,collection){
    const tb = db.collection(collection);
    var p = new Promise(function (resolve,reject) {
       tb.doc(id).remove().then( res => { resolve(res)})
                                .catch( err=> { reject(err)})
    })
    return p
}//删除一条数据 //doc只接受_id ,前端删除某条时我们需要先获取到条目的_id
service.update = function(id,data,collection){
    const  tb = db.collection(collection);
    var p =  new Promise(function (resolve,reject) {
        const _ = db.command
        db.collection(collection).doc(id)
            .update({
                data: data,
            })
            .then(console.log('更新成功！'))
            .catch(console.error)
    })
    return p;
}

module.exports = service;
