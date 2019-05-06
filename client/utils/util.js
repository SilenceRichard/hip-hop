const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 *将微信小程序中的回调封装成Promise的形式，避免回调地狱
 * **/
//添加finally：因为还有一个参数里面还有一个complete方法。
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
  );
};
//封装回调式api
const wxPromisify = fn => {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res)
      }

      obj.fail = function (res) {
        reject(res)
      }

      fn(obj)
    })
  }
}
const loginPromisified = wxPromisify(wx.login);//登录
const showLoadingPromisified = wxPromisify(wx.showLoading); //加载状态Promise化
const hideLoadingPromisified = wxPromisify(wx.hideLoading); //加载完成
const chooseImagePromisified = wxPromisify(wx.chooseImage);//选择图片
const chooseLocationPromisified = wxPromisify(wx.chooseLocation);//选择位置
const getLocationPromisified = wxPromisify(wx.getLocation);//获取经纬度
const showModalPromisified = wxPromisify(wx.showModal);//弹窗
const showToastPromisified = wxPromisify(wx.showToast);//提示窗
const showActionSheetPromisified = wxPromisify(wx.showActionSheet);//选项窗
const getUserInfoPromisified = wxPromisify(wx.getUserInfo); //获取用户信息
const hideTabBarPromisified = wxPromisify(wx.hideTabBar); //隐藏底部导航栏
const showTabBarPromisified = wxPromisify(wx.showTabBar); //展示底部导航栏

const post = (url,data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token':wx.getStorageSync('token')
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}// 封装post请求
const get = (url, data) => {
  var promise = new Promise((resolve, reject) => {
    //网络请求
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {//服务器返回数据
        if (res.statusCode == 200) {
          resolve(res);
        } else {//返回错误提示信息
          reject(res.data);
        }
      },
      error: function (e) {
        reject('网络出错');
      }
    })
  });
  return promise;
}// 封装get请求


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  wxPromisify:wxPromisify,//将微信的API方法改为异步写法
  login:loginPromisified,//微信登录方法
  chooseLocation:chooseLocationPromisified,//获取当前位置
  getLocation:getLocationPromisified, //获取经纬度 用promise的方式实现
  showModal:showModalPromisified,//弹窗 用promise的方式实现
  showToast:showToastPromisified,//提示窗 用promise的方式实现
  getUserInfo:getUserInfoPromisified, //获取用户信息
  showActionSheet:showActionSheetPromisified,//选项窗
  chooseImage:chooseImagePromisified,//选择图片
  showLoading:showLoadingPromisified,//加载中
  hideLoading:hideLoadingPromisified,//加载完成
  hideTabBar:hideTabBarPromisified,//隐藏底部导航栏
  showTabBar:showTabBarPromisified,//展示底部导航栏
  post:post,
  get:get
}
